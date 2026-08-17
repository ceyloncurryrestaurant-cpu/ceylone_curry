import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { comparePassword, createAdminToken, getAdminSession, hashPassword } from "@/lib/auth";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "ceylon_admin_token";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true, admin: session });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    // Auto seed database if no admin user exists in live DB cluster
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const { seedDatabase } = await import("@/lib/seed");
      await seedDatabase().catch((e) => console.error("Auto seed error:", e));
    }

    const body = await req.json();
    const { action, email, password, newPassword } = body;

    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    if (action === "reset-password") {
      if (!email || !newPassword) {
        return NextResponse.json({ success: false, error: "Email and new password are required" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
      }

      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
        return NextResponse.json({ success: false, error: "Admin account with this email not found" }, { status: 404 });
      }

      const newHash = await hashPassword(newPassword);
      admin.passwordHash = newHash;
      await admin.save();

      return NextResponse.json({
        success: true,
        message: "Admin password updated successfully! You can now log in with your new password.",
      });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = await createAdminToken({
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
      admin: { id: admin._id, email: admin.email, name: admin.name },
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete(COOKIE_NAME);
  return response;
}
