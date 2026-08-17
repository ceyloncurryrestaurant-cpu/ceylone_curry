import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Table from "@/models/Table";
import Reservation from "@/models/Reservation";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";
import mongoose from "mongoose";

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
    if (!conn) {
      // Fallback: update in memoryStore
      const memTable = memoryStore.tables.find(
        (t) => t._id === id || String(t.tableNumber) === id || `tbl_${t.tableNumber}` === id
      );
      if (memTable) {
        Object.assign(memTable, body);
        return NextResponse.json({ success: true, message: "Table updated in memory", table: memTable });
      }
      return NextResponse.json({ success: true, message: "Table updated", table: { _id: id, ...body } });
    }

    // Build the $set payload
    const setPayload: any = {};
    for (const [key, value] of Object.entries(body)) {
      if (key === "image" && value && typeof value === "object") {
        const img = value as any;
        setPayload["image"] = {
          url: img.url || "",
          publicId: img.publicId || "",
          width: img.width || 0,
          height: img.height || 0,
          format: img.format || "",
        };
      } else {
        setPayload[key] = value;
      }
    }

    let table = null;

    // 1. Try find by Mongoose ObjectId if valid
    if (mongoose.Types.ObjectId.isValid(id)) {
      table = await Table.findByIdAndUpdate(
        id,
        { $set: setPayload },
        { new: true, runValidators: false }
      ).catch((err) => {
        console.error("findByIdAndUpdate error:", err);
        return null;
      });
    }

    // 2. Fallback: Extract number from ID (e.g. "tbl_1", "1") and find by tableNumber
    if (!table) {
      const numericId = parseInt(String(id).replace(/[^0-9]/g, ""));
      if (!isNaN(numericId)) {
        table = await Table.findOneAndUpdate(
          { tableNumber: numericId },
          { $set: setPayload },
          { new: true, runValidators: false }
        ).catch((err) => {
          console.error("findOneAndUpdate by tableNumber error:", err);
          return null;
        });
      }
    }

    // 3. Fallback: If table document doesn't exist in DB yet, create it
    if (!table) {
      const numericId = parseInt(String(id).replace(/[^0-9]/g, "")) || 1;
      table = await Table.create({
        tableNumber: numericId,
        capacity: numericId <= 4 ? 2 : 4,
        type: numericId <= 4 ? "Couple" : "Family",
        status: body.status || "Available",
        ...setPayload,
      }).catch((err) => {
        console.error("Table create error:", err);
        return null;
      });
    }

    if (!table) {
      return NextResponse.json({ success: false, error: `Could not save table with id ${id}` }, { status: 404 });
    }

    if (body.releaseReservations) {
      await Reservation.updateMany(
        { tableId: table._id, status: { $in: ["Pending", "Accepted"] } },
        { status: "Cancelled" }
      ).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      message: `Table ${table.tableNumber} updated successfully`,
      table,
    });
  } catch (error: any) {
    console.error("Table PUT error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
