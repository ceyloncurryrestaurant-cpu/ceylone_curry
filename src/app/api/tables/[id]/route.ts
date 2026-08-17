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

    // Use $set to ensure nested fields (like image.url) are properly updated in MongoDB
    const updateQuery = { $set: body };

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const table = await Table.findByIdAndUpdate(id, updateQuery, { new: true, runValidators: false });
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
        // Table not found by id — try by tableNumber
        const tableByNumber = await Table.findOneAndUpdate(
          { tableNumber: Number(id) },
          updateQuery,
          { new: true, runValidators: false }
        );
        if (tableByNumber) {
          return NextResponse.json({
            success: true,
            message: `Table ${tableByNumber.tableNumber} updated successfully`,
            table: tableByNumber,
          });
        }
      } catch (err) {
        console.error("DB update table error:", err);
      }
    }

    // Fallback: update in memoryStore
    const memTable = memoryStore.tables.find((t) => t._id === id || t.tableNumber === Number(id));
    if (memTable) {
      Object.assign(memTable, body);
      return NextResponse.json({
        success: true,
        message: `Table updated successfully`,
        table: memTable,
      });
    }

    return NextResponse.json({ success: true, message: "Table updated", table: { _id: id, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
