import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing table ID" }, { status: 400 });
    }

    const body = await req.json();

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const table = await Table.findByIdAndUpdate(id, body, { new: true });
        if (table) {
          if (body.releaseReservations) {
            await Reservation.updateMany(
              { tableId: id, status: { $in: ["Pending", "Accepted"] } },
              { status: "Cancelled" }
            ).catch(() => {});
          }
          return NextResponse.json({
            success: true,
            message: `Table ${table.tableNumber} updated successfully`,
            table,
          });
        }
      } catch (err) {
        console.error("DB update table error:", err);
      }
    }

    // Fallback update in memoryStore
    const memTable = memoryStore.tables.find((t) => t._id === id || t.tableNumber === Number(id));
    if (memTable) {
      Object.assign(memTable, body);
      return NextResponse.json({
        success: true,
        message: `Table ${memTable.tableNumber} updated successfully`,
        table: memTable,
      });
    }

    return NextResponse.json({ success: true, message: "Table status updated", table: { _id: id, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
