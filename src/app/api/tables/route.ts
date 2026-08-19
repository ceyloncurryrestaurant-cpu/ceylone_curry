import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to auto-release reserved/occupied tables 1 hour after their reservation start time
async function autoReleaseExpiredTables() {
  try {
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
    const ukHours = parseInt(m.hour, 10);
    const ukMinutes = parseInt(m.minute, 10);
    const currentTotalMins = ukHours * 60 + ukMinutes;
    const nowMs = now.getTime();
    const ONE_HOUR_MS = 60 * 60 * 1000;

    // 1. Fetch tables that are currently Reserved or Occupied
    const reservedTables = await Table.find({ status: { $in: ["Reserved", "Occupied"] } }).catch(() => []);

    // 2. Fetch all reservations with active status
    const activeReservations = await Reservation.find({
      status: { $in: ["Pending", "Accepted"] }
    }).catch(() => []);

    for (const tbl of reservedTables) {
      const tableIdStr = tbl._id.toString();

      // Find reservations for this table
      const tblReservations = activeReservations.filter(
        (res) => ((res.tableId as any)?._id || res.tableId || "").toString() === tableIdStr
      );

      // Check if there is an active reservation right now
      const currentActiveRes = tblReservations.find((res) => {
        if (res.date !== localDateStr) return false;
        const [startH, startM] = res.startTime.split(":").map(Number);
        const startMins = startH * 60 + startM;
        const endMins = startMins + 60;
        return currentTotalMins >= startMins && currentTotalMins < endMins;
      });

      // Handle expiration of reservations
      for (const res of tblReservations) {
        const [startH, startM] = res.startTime.split(":").map(Number);
        const startMins = startH * 60 + startM;
        const endMins = startMins + 60;

        const isExpired =
          res.date < localDateStr ||
          (res.date === localDateStr && currentTotalMins >= endMins);

        if (isExpired) {
          await Reservation.findByIdAndUpdate(res._id, { status: "Completed" }).catch(() => null);
          res.status = "Completed";
        }
      }

      // Determine new status for the table
      let targetStatus = tbl.status;

      if (currentActiveRes && currentActiveRes.status !== "Completed") {
        if (tbl.status !== "Reserved" && tbl.status !== "Occupied") {
          targetStatus = "Reserved";
        }
      } else {
        // No active reservation right now
        if (tbl.status === "Reserved") {
          targetStatus = "Available";
        } else if (tbl.status === "Occupied") {
          const tableUpdatedMs = new Date(tbl.updatedAt || tbl.createdAt).getTime();
          if (nowMs - tableUpdatedMs > ONE_HOUR_MS) {
            targetStatus = "Available";
          }
        }
      }

      if (tbl.status !== targetStatus) {
        await Table.findByIdAndUpdate(tbl._id, { status: targetStatus, updatedAt: new Date() }).catch(() => null);
        tbl.status = targetStatus;
      }
    }

    // 3. Sync memoryStore fallback
    if (memoryStore.tables) {
      memoryStore.tables.forEach((memT: any) => {
        const tbl = reservedTables.find((t) => t._id.toString() === (memT._id || memT.id || "").toString());
        if (tbl) {
          memT.status = tbl.status;
        }
      });
    }
  } catch (err) {
    console.error("Auto-release expired tables error:", err);
  }
}

export async function GET(req: Request) {
  try {
    const conn = await connectToDatabase();
    
    // Run 1-Hour Automatic Table Expiration check before returning tables
    await autoReleaseExpiredTables();

    if (!conn) {
      return NextResponse.json({ success: true, tables: memoryStore.tables });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    let tables = await Table.find({ isActive: { $ne: false } }).sort({ tableNumber: 1 }).catch(() => []);
    if (!tables || tables.length === 0) {
      try {
        const { seedDatabase } = await import("@/lib/seed");
        await seedDatabase();
        tables = await Table.find({ isActive: { $ne: false } }).sort({ tableNumber: 1 }).catch(() => []);
      } catch (seedErr) {
        console.error("Auto-seed error in GET tables:", seedErr);
      }
    }
    if (!tables || tables.length === 0) {
      tables = memoryStore.tables as any;
    }

    if (!date || !time) {
      return NextResponse.json({ success: true, tables });
    }

    const [reqHours, reqMins] = time.split(":").map(Number);
    const reqStartTotal = reqHours * 60 + reqMins;
    const reqEndTotal = reqStartTotal + 60;

    const activeReservations = await Reservation.find({
      date,
      status: { $in: ["Pending", "Accepted"] },
    }).catch(() => []);

    const tablesWithAvailability = tables.map((t: any) => {
      const tableObj = typeof t.toObject === "function" ? t.toObject() : { ...t };
      const tableIdStr = (t._id || t.id || "").toString();

      const isReserved = activeReservations.some((res: any) => {
        const resTableId = (res.tableId?._id || res.tableId || "").toString();
        if (resTableId !== tableIdStr) return false;
        const [resHours, resMins] = (res.startTime || "00:00").split(":").map(Number);
        const resStartTotal = resHours * 60 + resMins;
        const resEndTotal = resStartTotal + 60;

        return reqStartTotal < resEndTotal && reqEndTotal > resStartTotal;
      });

      return {
        ...tableObj,
        isAvailableForSlot: !isReserved && t.status === "Available",
      };
    });

    return NextResponse.json({ success: true, tables: tablesWithAvailability });
  } catch (error: any) {
    return NextResponse.json({ success: true, tables: memoryStore.tables });
  }
}
