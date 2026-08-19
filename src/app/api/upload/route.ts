import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "emsmspoh").trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || "915836631434146").trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || "IZwegvdC40oWgR_MwtOPp-_Ds1U").trim();

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

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
      const mimeType = file.type || "image/jpeg";
      const base64Data = buffer.toString("base64");
      const fileUri = `data:${mimeType};base64,${base64Data}`;

      let uploadResult;

      try {
        // Direct Base64 upload
        uploadResult = await cloudinary.uploader.upload(fileUri, {
          folder: "ceylon_curry_uploads",
          resource_type: "auto",
        });
      } catch (cloudErr: any) {
        console.error("Cloudinary base64 upload failed, trying stream upload...", cloudErr?.message || cloudErr);

        // Fallback Stream Upload
        uploadResult = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ceylon_curry_uploads", resource_type: "auto" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(buffer);
        });
      }

      uploadedImages.push({
        url: uploadResult.secure_url || uploadResult.url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image(s) uploaded to Cloudinary successfully",
      images: uploadedImages,
      url: uploadedImages[0]?.url || null,
      publicId: uploadedImages[0]?.publicId || null,
    });
  } catch (error: any) {
    console.error("❌ Cloudinary upload route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to upload image to Cloudinary.",
      },
      { status: 500 }
    );
  }
}
