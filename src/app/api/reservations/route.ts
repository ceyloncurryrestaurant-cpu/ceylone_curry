import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Table from "@/models/Table";
import Settings from "@/models/Settings";
import { sendReservationEmails } from "@/lib/nodemailer";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      const { memoryStore } = await import("@/lib/memoryStore");
      return NextResponse.json({ success: true, count: memoryStore.reservations.length, reservations: memoryStore.reservations });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const tableId = searchParams.get("tableId");

    const query: any = {
      customerName: { $exists: true, $ne: "" },
      email: { $exists: true, $ne: "" },
      mobile: { $exists: true, $ne: "" },
    };
    if (date) query.date = date;
    if (status && status !== "all") query.status = status;
    if (tableId) query.tableId = tableId;

    const reservations = await Reservation.find(query)
      .populate("tableId", "tableNumber capacity type status")
      .sort({ date: -1, startTime: -1 })
      .catch(() => []);

    return NextResponse.json({ success: true, count: reservations.length, reservations });
  } catch (error: any) {
    const { memoryStore } = await import("@/lib/memoryStore");
    return NextResponse.json({ success: true, count: memoryStore.reservations.length, reservations: memoryStore.reservations });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { customerName, email, mobile, tableId, date, startTime, guestCount, specialRequest } = body;

    // 1. Mandatory Input Validation
    if (!customerName || !email || !mobile || !tableId || !date || !startTime || !guestCount) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required reservation fields." },
        { status: 400 }
      );
    }

    // 1.5. Validate that the date and time are in the future (using UK/Europe/London timezone)
    const now = new Date();
    const ukParts = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/London",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).formatToParts(now);

    const m: Record<string, string> = {};
    ukParts.forEach((p) => {
      m[p.type] = p.value;
    });

    const localDateStr = `${m.year}-${m.month}-${m.day}`;
    const currentHours = parseInt(m.hour, 10);
    const currentMinutes = parseInt(m.minute, 10);

    if (date < localDateStr) {
      return NextResponse.json(
        { success: false, error: "Reservations cannot be made for past dates." },
        { status: 400 }
      );
    }

    if (date === localDateStr) {
      const [reqHours, reqMins] = startTime.split(":").map(Number);

      if (reqHours < currentHours || (reqHours === currentHours && reqMins <= currentMinutes)) {
        return NextResponse.json(
          { success: false, error: "Reservations cannot be made for past times today." },
          { status: 400 }
        );
      }
    }

    // 1.7. Validate that the time falls within the restaurant's opening hours
    try {
      const settingsDoc = await Settings.findOne().catch(() => null);
      if (settingsDoc && settingsDoc.openingHours) {
        const [year, month, day] = date.split("-").map(Number);
        const bookingDate = new Date(year, month - 1, day);
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const dayName = daysOfWeek[bookingDate.getDay()];
        
        const hoursForDay = (settingsDoc.openingHours as any)[dayName];
        if (hoursForDay) {
          if (hoursForDay.toLowerCase().includes("closed")) {
            return NextResponse.json(
              { success: false, error: `Sorry, the restaurant is closed on ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}.` },
              { status: 400 }
            );
          }

          const parts = hoursForDay.split("-");
          if (parts.length === 2) {
            const parse12HourToMins = (timeStr: string): number => {
              const match = timeStr.trim().toUpperCase().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
              if (!match) return 0;
              let h = parseInt(match[1], 10);
              const m = parseInt(match[2], 10);
              const ampm = match[3];
              if (ampm === "PM" && h !== 12) h += 12;
              else if (ampm === "AM" && h === 12) h = 0;
              return h * 60 + m;
            };

            const startMins = parse12HourToMins(parts[0]);
            const endMins = parse12HourToMins(parts[1]);

            const [reqHours, reqMins] = startTime.split(":").map(Number);
            const reqMinsTotal = reqHours * 60 + reqMins;

            if (reqMinsTotal < startMins || reqMinsTotal > endMins) {
              return NextResponse.json(
                { success: false, error: `Selected time is outside opening hours. Ceylon Curry is open from ${hoursForDay} on ${dayName.charAt(0).toUpperCase() + dayName.slice(1)}.` },
                { status: 400 }
              );
            }
          }
        }
      }
    } catch (err) {
      console.error("Opening hours validation error:", err);
    }

    // 2. Validate Table Existence & Capacity
    let resolvedTableId = tableId;
    if (typeof tableId === "string" && !/^[a-f\d]{24}$/i.test(tableId)) {
      const numericPart = parseInt(tableId.replace(/[^0-9]/g, ""), 10);
      if (!isNaN(numericPart)) {
        const foundByNumber = await Table.findOne({ tableNumber: numericPart }).catch(() => null);
        if (foundByNumber) {
          resolvedTableId = foundByNumber._id.toString();
        } else {
          return NextResponse.json({ success: false, error: "Selected table not found." }, { status: 404 });
        }
      } else {
        return NextResponse.json({ success: false, error: "Invalid table ID." }, { status: 400 });
      }
    }

    const table = await Table.findById(resolvedTableId);
    if (!table) {
      return NextResponse.json({ success: false, error: "Selected table not found." }, { status: 404 });
    }

    if (guestCount > table.capacity) {
      return NextResponse.json(
        {
          success: false,
          error: `This table can accommodate up to ${table.capacity} guests. Please select a table with higher capacity or adjust guest count.`,
        },
        { status: 400 }
      );
    }

    // 3. Calculate 1-Hour Protection Window End Time
    const [hours, minutes] = startTime.split(":").map(Number);
    const startTotalMins = hours * 60 + minutes;
    const endTotalMins = startTotalMins + 60;
    const endHours = Math.floor(endTotalMins / 60);
    const endMins = endTotalMins % 60;
    const endTime = `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;

    // 4. Concurrent Double-Booking Prevention (1-hour window overlap check)
    const existingReservations = await Reservation.find({
      tableId: resolvedTableId,
      date,
      status: { $in: ["Pending", "Accepted"] },
    });

    const hasConflict = existingReservations.some((res) => {
      const [resH, resM] = res.startTime.split(":").map(Number);
      const resStart = resH * 60 + resM;
      const resEnd = resStart + 60;

      return startTotalMins < resEnd && endTotalMins > resStart;
    });

    if (hasConflict) {
      return NextResponse.json(
        {
          success: false,
          error: "Sorry, this table has just been reserved for that time slot. Please choose another table or time.",
        },
        { status: 409 }
      );
    }

    // 5. Generate Unique Reservation Reference ID
    const dateFormatted = date.replace(/-/g, "");
    const countForDate = await Reservation.countDocuments({ date });
    const sequence = (countForDate + 1).toString().padStart(3, "0");
    const reservationNumber = `CC-${dateFormatted}-${sequence}`;

    // 6. Create Reservation Record
    const newReservation = await Reservation.create({
      reservationNumber,
      customerName,
      email,
      mobile,
      tableId: resolvedTableId,
      date,
      startTime,
      endTime,
      guestCount,
      specialRequest,
      status: "Pending",
    });

    // 6.5. Update Table status to "Reserved" with timestamp for 1-hour automatic expiration
    await Table.findByIdAndUpdate(resolvedTableId, { status: "Reserved", updatedAt: new Date() }).catch(() => null);

    try {
      const { memoryStore } = await import("@/lib/memoryStore");
      if (memoryStore.tables) {
        const memT = memoryStore.tables.find((t: any) => t._id === resolvedTableId || t.tableNumber === table.tableNumber);
        if (memT) {
          (memT as any).status = "Reserved";
          (memT as any).reservedAt = Date.now();
        }
      }
    } catch (memErr) {}

    // 7. Retrieve Live Restaurant Settings for Emails
    const settingsDoc = await Settings.findOne();
    const settingsObj = {
      restaurantName: settingsDoc?.restaurantName || "Ceylon Curry",
      address: settingsDoc?.address || "44 Mayflower St, Plymouth PL1 1QX",
      mobileNumber: settingsDoc?.mobileNumber || "01752 941504",
      restaurantEmail: settingsDoc?.restaurantEmail || "info@ceyloncurry.co.uk",
      adminEmail: settingsDoc?.adminEmail || "admin@ceyloncurry.co.uk",
    };

    // 8. Dispatch Confirmation Emails
    await sendReservationEmails({
      reservationNumber,
      customerName,
      email,
      mobile,
      tableNumber: table.tableNumber,
      tableType: table.type,
      guestCount,
      date,
      startTime,
      specialRequest,
      restaurantName: settingsObj.restaurantName,
      restaurantAddress: settingsObj.address,
      restaurantPhone: settingsObj.mobileNumber,
      restaurantEmail: settingsObj.restaurantEmail,
      adminEmail: settingsObj.adminEmail,
    }).catch((err) => console.error("Email dispatch failed:", err));

    return NextResponse.json({
      success: true,
      message: "Reservation submitted successfully!",
      reservation: newReservation,
      reservationNumber,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
