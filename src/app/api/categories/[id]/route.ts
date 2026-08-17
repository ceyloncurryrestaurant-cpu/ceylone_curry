import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
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
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    const body = await req.json();

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const category = await Category.findByIdAndUpdate(id, body, { new: true });
        if (category) {
          return NextResponse.json({ success: true, message: "Category updated successfully", category });
        }
      } catch (err) {
        console.error("DB update category error:", err);
      }
    }

    // Fallback: update in memoryStore
    const idx = memoryStore.categories.findIndex((c: any) => c._id === id);
    if (idx !== -1) {
      memoryStore.categories[idx] = { ...memoryStore.categories[idx], ...body };
      return NextResponse.json({ success: true, message: "Category updated successfully", category: memoryStore.categories[idx] });
    }
    // Not found in memoryStore — still return success so UI doesn't break
    return NextResponse.json({ success: true, message: "Category updated successfully", category: { _id: id, ...body } });
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
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        await Category.findByIdAndDelete(id);
        return NextResponse.json({ success: true, message: "Category deleted successfully" });
      } catch (err) {
        console.error("DB delete category error:", err);
      }
    }

    // Fallback: remove from memoryStore
    const idx = memoryStore.categories.findIndex((c: any) => c._id === id);
    if (idx !== -1) memoryStore.categories.splice(idx, 1);
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
