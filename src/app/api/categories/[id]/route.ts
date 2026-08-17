import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getAdminSession } from "@/lib/auth";

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
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    const body = await req.json();
    const category = await Category.findByIdAndUpdate(id, body, { new: true });
    if (!category) {
      return NextResponse.json({ success: false, error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Category updated successfully", category });
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
      return NextResponse.json({ success: false, error: "Missing category ID" }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
