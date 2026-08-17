import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, settings: memoryStore.settings });
    }
    let settings = await Settings.findOne().catch(() => null);
    if (!settings) {
      settings = memoryStore.settings as any;
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: true, settings: memoryStore.settings });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const conn = await connectToDatabase();
    if (conn) {
      try {
        let settings = await Settings.findOne();
        if (!settings) {
          settings = new Settings(body);
        } else {
          Object.assign(settings, body);
        }
        await settings.save();
        return NextResponse.json({
          success: true,
          message: "Restaurant settings updated successfully",
          settings,
        });
      } catch (err) {
        console.error("DB update settings error:", err);
      }
    }

    // Fallback in-memory update
    Object.assign(memoryStore.settings, body);
    return NextResponse.json({
      success: true,
      message: "Restaurant settings updated successfully",
      settings: memoryStore.settings,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
