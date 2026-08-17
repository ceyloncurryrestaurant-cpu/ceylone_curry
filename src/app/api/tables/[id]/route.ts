import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing table ID" }, { status: 400 });
    }

    const body = await req.json();

    const table = await Table.findByIdAndUpdate(id, body, { new: true });
    if (!table) {
      return NextResponse.json({ success: false, error: "Table not found" }, { status: 404 });
    }

    // Release reservations if table status set to Available
    if (body.releaseReservations) {
      await Reservation.updateMany(
        { tableId: id, status: { $in: ["Pending", "Accepted"] } },
        { status: "Cancelled" }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Table ${table.tableNumber} updated successfully`,
      table,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
