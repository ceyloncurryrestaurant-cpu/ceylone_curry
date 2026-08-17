import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, categories: memoryStore.categories });
    }
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).catch(() => []);
    if (!categories || categories.length === 0) {
      return NextResponse.json({ success: true, categories: memoryStore.categories });
    }
    return NextResponse.json({ success: true, categories });
  } catch (error: any) {
    return NextResponse.json({ success: true, categories: memoryStore.categories });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const category = await Category.create(body);
        return NextResponse.json({ success: true, message: "Category created successfully", category });
      } catch (err) {
        console.error("DB create category error:", err);
      }
    }

    // Memory fallback
    const newCat = {
      _id: `cat_${Date.now()}`,
      ...body,
    };
    memoryStore.categories.push(newCat);
    return NextResponse.json({ success: true, message: "Category created successfully", category: newCat });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
