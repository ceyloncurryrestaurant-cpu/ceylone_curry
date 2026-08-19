import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Helper to auto-release reserved tables that are older than 1 hour (60 minutes)
async function autoReleaseExpiredTables() {
  try {
    const ONE_HOUR_MS = 60 * 60 * 1000;
    const nowMs = Date.now();

    // 1. Auto-release in MongoDB
    const reservedTables = await Table.find({ status: "Reserved" }).catch(() => []);
    for (const tbl of reservedTables) {
      const tableIdStr = tbl._id.toString();

      // Find active reservation for this table
      const activeRes = await Reservation.findOne({
        tableId: tbl._id,
        status: { $in: ["Pending", "Accepted"] },
      }).sort({ createdAt: -1 }).catch(() => null);

      let shouldRelease = false;

      if (activeRes) {
        const resCreatedMs = new Date(activeRes.createdAt || activeRes.updatedAt).getTime();
        if (nowMs - resCreatedMs > ONE_HOUR_MS) {
          shouldRelease = true;
        }
      } else {
        // If table is marked Reserved but has no active reservation, or updatedAt > 1 hr
        const tableUpdatedMs = new Date(tbl.updatedAt || tbl.createdAt).getTime();
        if (nowMs - tableUpdatedMs > ONE_HOUR_MS) {
          shouldRelease = true;
        }
      }

      if (shouldRelease) {
        await Table.findByIdAndUpdate(tbl._id, { status: "Available" }).catch(() => null);
        tbl.status = "Available";
      }
    }

    // 2. Auto-release in memoryStore fallback
    if (memoryStore.tables) {
      memoryStore.tables.forEach((memT: any) => {
        if (memT.status === "Reserved") {
          const reservedAt = memT.reservedAt || memT.updatedAt || 0;
          if (nowMs - reservedAt > ONE_HOUR_MS) {
            memT.status = "Available";
          }
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
