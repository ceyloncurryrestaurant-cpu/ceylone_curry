import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: Request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, tables: memoryStore.tables });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");
    const time = searchParams.get("time");

    let tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 }).catch(() => []);
    if (!tables || tables.length === 0) {
      try {
        const { seedDatabase } = await import("@/lib/seed");
        await seedDatabase();
        tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 }).catch(() => []);
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
