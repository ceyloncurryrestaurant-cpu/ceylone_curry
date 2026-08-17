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
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const tableId = searchParams.get("tableId");

    // Strictly query only confirmed customer reservations with complete credentials
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
      .sort({ date: -1, startTime: -1 });

    return NextResponse.json({ success: true, count: reservations.length, reservations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
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

    // 2. Validate Table Existence & Capacity
    const table = await Table.findById(tableId);
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
      tableId,
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

    // 5. Generate Unique Reservation Reference ID (e.g. CC-20260817-001)
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
      tableId,
      date,
      startTime,
      endTime,
      guestCount,
      specialRequest,
      status: "Pending",
    });

    // 7. Retrieve Live Restaurant Settings for Emails
    const settingsDoc = await Settings.findOne();
    const settingsObj = {
      restaurantName: settingsDoc?.restaurantName || "Ceylon Curry",
      address: settingsDoc?.address || "44 Mayflower St, Plymouth PL1 1QX",
      mobileNumber: settingsDoc?.mobileNumber || "01752 941504",
      restaurantEmail: settingsDoc?.restaurantEmail || "info@ceyloncurry.co.uk",
      adminEmail: settingsDoc?.adminEmail || "admin@ceyloncurry.co.uk",
    };

    // 8. Dispatch Confirmation Email via Nodemailer (Background / async)
    sendReservationEmails({
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
