import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files uploaded" }, { status: 400 });
    }

    if (files.length > 4) {
      return NextResponse.json(
        { success: false, error: "Maximum 4 images allowed per upload batch." },
        { status: 400 }
      );
    }

    const uploadedImages = [];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());

      if (process.env.CLOUDINARY_API_KEY) {
        try {
          const cloudinary = require("cloudinary").v2;
          cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
          });

          const uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                { folder: "ceylon_curry_products", resource_type: "image" },
                (error: any, result: any) => {
                  if (error) reject(error);
                  else resolve(result);
                }
              )
              .end(buffer);
          });

          uploadedImages.push({
            url: uploadResult.secure_url,
            publicId: uploadResult.public_id,
            width: uploadResult.width,
            height: uploadResult.height,
            format: uploadResult.format,
          });
          continue;
        } catch (err) {
          console.log("Cloudinary upload fallback to data URL:", err);
        }
      }

      // Local Base64 preview fallback
      const base64Data = buffer.toString("base64");
      const mimeType = file.type || "image/jpeg";
      const dataUrl = `data:${mimeType};base64,${base64Data}`;

      uploadedImages.push({
        url: dataUrl,
        publicId: `dev_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        format: file.type.split("/")[1] || "jpeg",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image(s) uploaded successfully",
      images: uploadedImages,
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
