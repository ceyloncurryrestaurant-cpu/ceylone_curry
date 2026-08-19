import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || "emsmspoh").trim();
    const apiKey = (process.env.CLOUDINARY_API_KEY || "915836631434146").trim();
    const apiSecret = (process.env.CLOUDINARY_API_SECRET || "IZwegvdC40oWgR_MwtOPp-_Ds1U").trim();

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
      if (!file || typeof file.arrayBuffer !== "function") {
        continue;
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const mimeType = file.type || "image/jpeg";
      const base64Data = buffer.toString("base64");
      const fileUri = `data:${mimeType};base64,${base64Data}`;

      let uploadResult: any = null;

      if (cloudName && apiKey && apiSecret) {
        try {
          const cloudinary = require("cloudinary").v2;
          cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
            secure: true,
          });

          console.log(`📡 Attempting Cloudinary upload to cloud_name: ${cloudName}...`);

          uploadResult = await new Promise<any>((resolve, reject) => {
            cloudinary.uploader.upload(
              fileUri,
              {
                resource_type: "auto",
              },
              (error: any, result: any) => {
                if (error) {
                  console.error("❌ Cloudinary Raw Error Details:", JSON.stringify(error, null, 2));
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
          });
        } catch (err: any) {
          console.warn("⚠️ Cloudinary upload failed:", err?.message || err);
        }
      }

      // If Cloudinary succeeded, use secure_url; otherwise fallback to fileUri
      if (uploadResult && (uploadResult.secure_url || uploadResult.url)) {
        console.log("✅ Successfully uploaded to Cloudinary:", uploadResult.secure_url);
        uploadedImages.push({
          url: uploadResult.secure_url || uploadResult.url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
        });
      } else {
        console.warn("⚠️ Using Data URI fallback for image.");
        uploadedImages.push({
          url: fileUri,
          publicId: `local_${Date.now()}_${Math.random().toString(36).substring(7)}`,
          format: mimeType.split("/")[1] || "jpeg",
        });
      }
    }

    if (uploadedImages.length === 0) {
      return NextResponse.json({ success: false, error: "Failed to process uploaded files." }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Image(s) processed successfully",
      images: uploadedImages,
      url: uploadedImages[0]?.url || null,
      publicId: uploadedImages[0]?.publicId || null,
    });
  } catch (error: any) {
    console.error("❌ Upload route error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process image upload.",
      },
      { status: 500 }
    );
  }
}
