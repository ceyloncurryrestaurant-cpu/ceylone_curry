import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({
        restaurantName: "Ceylon Curry",
        address: "44 Mayflower St, Plymouth PL1 1QX",
        mobileNumber: "01752 941504",
        whatsappNumber: "+441752941504",
        restaurantEmail: "info@ceyloncurry.co.uk",
        adminEmail: "admin@ceyloncurry.co.uk",
      });
    }
    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const body = await req.json();

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
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
