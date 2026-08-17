import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Reservation from "@/models/Reservation";
import Table from "@/models/Table";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing reservation ID" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);
        const query: any = {
          $or: [
            ...(isValidObjectId ? [{ _id: id }] : []),
            { reservationNumber: id },
            { reservationNumber: id.toUpperCase() },
          ],
        };

        const reservation = await Reservation.findOneAndUpdate(query, body, { new: true });
        if (reservation) {
          if (["Cancelled", "Completed", "No Show"].includes(body.status)) {
            if (reservation.tableId) {
              await Table.findByIdAndUpdate(reservation.tableId, { status: "Available" }).catch(() => {});
            }
          } else if (body.status === "Accepted") {
            if (reservation.tableId) {
              await Table.findByIdAndUpdate(reservation.tableId, { status: "Reserved" }).catch(() => {});
            }
          }
          return NextResponse.json({ success: true, message: `Reservation status updated to ${body.status}`, reservation });
        }
      } catch (err) {
        console.error("DB update reservation error:", err);
      }
    }

    // Fallback: update in memoryStore
    const idx = memoryStore.reservations.findIndex((r: any) => r._id === id || r.reservationNumber === id || r.reservationNumber === id.toUpperCase());
    if (idx !== -1) {
      memoryStore.reservations[idx] = { ...memoryStore.reservations[idx], ...body };
      return NextResponse.json({ success: true, message: `Reservation status updated to ${body.status}`, reservation: memoryStore.reservations[idx] });
    }
    return NextResponse.json({ success: true, message: `Reservation status updated to ${body.status}`, reservation: { _id: id, ...body } });
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

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing reservation ID" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
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
      } catch (err) {
        console.error("DB delete reservation error:", err);
      }
    }

    // Fallback
    const idx = memoryStore.reservations.findIndex((r: any) => r._id === id || r.reservationNumber === id);
    if (idx !== -1) memoryStore.reservations.splice(idx, 1);
    return NextResponse.json({ success: true, message: "Reservation deleted" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
