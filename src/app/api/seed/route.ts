import { NextResponse } from "next/server";
import { seedDatabase } from "@/lib/seed";

export async function GET() {
  try {
    await seedDatabase();
    return NextResponse.json(
      {
        success: true,
        message: "🌱 Database seeded successfully!",
        adminCredentials: {
          email: "admin@ceyloncurry.co.uk",
          password: "admin123",
          role: "admin",
        },
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Database seeding error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to seed database.",
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
