import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return NextResponse.json({ success: false, error: "MONGODB_URI environment variable is not set." });
  }

  // Mask password for safety
  const maskedUri = uri.replace(/:([^:@]+)@/, ":******@");

  try {
    console.log("Debug DB: Connecting to", maskedUri);
    
    // Attempt connection with 10s timeout
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    
    if (!conn.connection.db) {
      throw new Error("conn.connection.db is not initialized.");
    }

    const collections = await conn.connection.db.listCollections().toArray();
    const tableCount = await conn.connection.db.collection("tables").countDocuments();

    await mongoose.disconnect();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      maskedUri,
      collections: collections.map(c => c.name),
      tableCount,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed!",
      maskedUri,
      errorName: err.name,
      errorMessage: err.message,
      errorStack: err.stack,
    });
  }
}
