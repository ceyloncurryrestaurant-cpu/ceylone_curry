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
    const body = await req.json();
    const { action, email, password, newPassword } = body;

    if (action === "logout") {
      const response = NextResponse.json({ success: true, message: "Logged out successfully" });
      response.cookies.delete(COOKIE_NAME);
      return response;
    }

    // Try DB connection safely
    let dbConnected = false;
    try {
      await connectToDatabase();
      dbConnected = true;
      const adminCount = await Admin.countDocuments().catch(() => 0);
      if (adminCount === 0) {
        const { seedDatabase } = await import("@/lib/seed");
        await seedDatabase().catch((e) => console.error("Auto seed error:", e));
      }
    } catch (dbErr) {
      console.warn("MongoDB connection failed in auth route, relying on fallback auth:", dbErr);
    }

    const cleanEmail = (email || "").toLowerCase().trim();

    if (action === "reset-password") {
      if (!newPassword) {
        return NextResponse.json({ success: false, error: "New password is required" }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ success: false, error: "Password must be at least 6 characters" }, { status: 400 });
      }

      if (dbConnected) {
        const session = await getAdminSession().catch(() => null);
        let admin = null;

        // 1. Try to find admin by session ID
        if (session && session.id && session.id !== "default_admin_id") {
          admin = await Admin.findById(session.id).catch(() => null);
        }

        // 2. Try to find admin by session email
        if (!admin && session && session.email) {
          admin = await Admin.findOne({ email: session.email.toLowerCase().trim() }).catch(() => null);
        }

        // 3. Try to find admin by cleanEmail
        if (!admin && cleanEmail) {
          admin = await Admin.findOne({ email: cleanEmail }).catch(() => null);
        }

        const newHash = await hashPassword(newPassword);

        if (admin) {
          admin.passwordHash = newHash;
          await admin.save();
          return NextResponse.json({
            success: true,
            message: "Admin password updated successfully! You can now log in with your new password.",
          });
        }

        // 4. Fallback: if the default admin document is missing, create it
        const isDefaultAdmin = cleanEmail === "admin@ceyloncurry.co.uk" || (session && session.email === "admin@ceyloncurry.co.uk");
        if (isDefaultAdmin) {
          const newAdmin = await Admin.create({
            email: "admin@ceyloncurry.co.uk",
            passwordHash: newHash,
            name: "Ceylon Curry Admin",
            role: "admin",
          });
          if (newAdmin) {
            return NextResponse.json({
              success: true,
              message: "Admin password updated successfully! You can now log in with your new password.",
            });
          }
        }
      }
      return NextResponse.json({ success: false, error: "Admin account with this email not found" }, { status: 404 });
    }

    if (!email || !password) {
      return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 });
    }

    let adminObj: { id: string; email: string; name: string } | null = null;

    if (dbConnected) {
      try {
        const adminDoc = await Admin.findOne({ email: cleanEmail });
        if (adminDoc) {
          const isMatch = await comparePassword(password, adminDoc.passwordHash);
          if (isMatch) {
            adminObj = {
              id: adminDoc._id.toString(),
              email: adminDoc.email,
              name: adminDoc.name,
            };
          }
        }
      } catch (e) {
        console.error("Error querying admin user:", e);
      }
    }

    // Fallback authentication for default credentials (admin@ceyloncurry.co.uk / admin123)
    if (!adminObj && cleanEmail === "admin@ceyloncurry.co.uk" && password === "admin123") {
      adminObj = {
        id: "default_admin_id",
        email: "admin@ceyloncurry.co.uk",
        name: "Ceylon Curry Admin",
      };
    }

    if (!adminObj) {
      return NextResponse.json({ success: false, error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = await createAdminToken(adminObj);

    const response = NextResponse.json({
      success: true,
      message: "Admin login successful",
      admin: adminObj,
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
