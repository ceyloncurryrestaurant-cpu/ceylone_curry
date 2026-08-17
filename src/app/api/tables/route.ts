import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { getAdminSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date"); // YYYY-MM-DD
    const time = searchParams.get("time"); // HH:mm (24-hour)

    const tables = await Table.find({ isActive: true }).sort({ tableNumber: 1 });

    if (!date || !time) {
      return NextResponse.json({ success: true, tables });
    }

    // Convert requested time to total minutes for 1-hour overlap checking
    const [reqHours, reqMins] = time.split(":").map(Number);
    const reqStartTotal = reqHours * 60 + reqMins;
    const reqEndTotal = reqStartTotal + 60; // 1-hour protection window

    // Find active reservations for this date
    const activeReservations = await Reservation.find({
      date,
      status: { $in: ["Pending", "Accepted"] },
    });

    const tablesWithAvailability = tables.map((t) => {
      const tableObj = t.toObject();
      // Check if table is booked in an overlapping window
      const isReserved = activeReservations.some((res) => {
        if (res.tableId.toString() !== t._id.toString()) return false;
        const [resHours, resMins] = res.startTime.split(":").map(Number);
        const resStartTotal = resHours * 60 + resMins;
        const resEndTotal = resStartTotal + 60;

        // Check window overlap: reqStart < resEnd AND reqEnd > resStart
        return reqStartTotal < resEndTotal && reqEndTotal > resStartTotal;
      });

      return {
        ...tableObj,
        isAvailableForSlot: !isReserved && t.status === "Available",
      };
    });

    return NextResponse.json({ success: true, tables: tablesWithAvailability });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
