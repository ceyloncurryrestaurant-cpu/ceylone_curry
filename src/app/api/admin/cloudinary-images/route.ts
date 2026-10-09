import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    if (!process.env.CLOUDINARY_API_KEY) {
      return NextResponse.json({ success: false, error: "Cloudinary credentials missing in .env.local" }, { status: 400 });
    }

    const result = await cloudinary.api.resources({
      max_results: 500,
      resource_type: "image",
      type: "upload",
    });

    const images = (result.resources || [])
      .filter((r: any) => !r.public_id.startsWith("samples/"))
      .map((r: any) => ({
        public_id: r.public_id,
        url: r.secure_url || r.url,
        created_at: r.created_at,
        width: r.width,
        height: r.height,
        format: r.format,
      }));

    return NextResponse.json({
      success: true,
      count: images.length,
      images,
    });
  } catch (error: any) {
    console.error("Cloudinary list error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
