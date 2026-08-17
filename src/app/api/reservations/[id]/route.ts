import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Table from "@/models/Table";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json(); // { status: 'Accepted' | 'Cancelled' | 'Completed' | 'No Show' }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing reservation ID" }, { status: 400 });
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    const query: any = {
      $or: [
        ...(isValidObjectId ? [{ _id: id }] : []),
        { reservationNumber: id },
        { reservationNumber: id.toUpperCase() },
      ],
    };

    const reservation = await Reservation.findOneAndUpdate(query, body, { new: true });

    if (!reservation) {
      return NextResponse.json({ success: false, error: "Reservation not found" }, { status: 404 });
    }

    // Update associated table status based on reservation progress
    if (["Cancelled", "Completed", "No Show"].includes(body.status)) {
      if (reservation.tableId) {
        await Table.findByIdAndUpdate(reservation.tableId, { status: "Available" });
      }
    } else if (body.status === "Accepted") {
      if (reservation.tableId) {
        await Table.findByIdAndUpdate(reservation.tableId, { status: "Reserved" });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Reservation status updated to ${body.status}`,
      reservation,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing reservation ID" }, { status: 400 });
    }

    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query: any = {
      $or: [
        ...(isValidObjectId ? [{ _id: id }] : []),
        { reservationNumber: id },
        { reservationNumber: id.toUpperCase() },
      ],
    };

    await Reservation.findOneAndDelete(query);
    return NextResponse.json({ success: true, message: "Reservation deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
