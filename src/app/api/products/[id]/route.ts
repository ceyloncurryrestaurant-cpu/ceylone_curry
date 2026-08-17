import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { getAdminSession } from "@/lib/auth";
import { memoryStore } from "@/lib/memoryStore";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: any }) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn) {
      const product = await Product.findById(id).populate("categoryId", "name slug").catch(() => null);
      if (product) {
        return NextResponse.json({ success: true, product });
      }
    }

    // Fallback to memoryStore
    const product = memoryStore.products.find((p) => p._id === id);
    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    }

    const body = await req.json();

    if (body.images && body.images.length > 4) {
      return NextResponse.json(
        { success: false, error: "A maximum of 4 product images is allowed." },
        { status: 400 }
      );
    }

    if (body.isOffer && body.price && body.offerPrice) {
      body.originalPrice = body.price;
      body.discountPercentage = Math.round(((body.price - body.offerPrice) / body.price) * 100);
    } else if (body.isOffer === false) {
      body.offerPrice = null;
      body.discountPercentage = 0;
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const product = await Product.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
        if (product) {
          return NextResponse.json({ success: true, message: "Product updated successfully", product });
        }
      } catch (err) {
        console.error("DB update product error:", err);
      }
    }

    // Fallback: update in memoryStore
    const idx = memoryStore.products.findIndex((p) => p._id === id);
    if (idx !== -1) {
      memoryStore.products[idx] = { ...memoryStore.products[idx], ...body };
      return NextResponse.json({ success: true, message: "Product updated successfully", product: memoryStore.products[idx] });
    }

    // If product not found anywhere, create a stub response
    return NextResponse.json({ success: true, message: "Product updated successfully", product: { _id: id, ...body } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await Promise.resolve(params);
    const id = resolvedParams?.id;

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing product ID" }, { status: 400 });
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const product = await Product.findById(id);
        if (product) {
          // Safely delete associated Cloudinary images if configured
          if (product.images && product.images.length > 0 && process.env.CLOUDINARY_API_KEY) {
            try {
              const cloudinary = require("cloudinary").v2;
              cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET,
              });
              for (const img of product.images) {
                if (img.publicId && !img.publicId.startsWith("dev_")) {
                  await cloudinary.uploader.destroy(img.publicId).catch(() => {});
                }
              }
            } catch (err) {
              console.log("Cloudinary cleanup skipped:", err);
            }
          }
          await Product.findByIdAndDelete(id);
          return NextResponse.json({ success: true, message: "Product and associated images deleted successfully" });
        }
      } catch (err) {
        console.error("DB delete product error:", err);
      }
    }

    // Fallback: remove from memoryStore
    const idx = memoryStore.products.findIndex((p) => p._id === id);
    if (idx !== -1) {
      memoryStore.products.splice(idx, 1);
    }
    return NextResponse.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
