import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { mappings, categoryMappings } = body;

    let updatedProducts = 0;
    let updatedCategories = 0;

    // 1. Update Product Images
    if (mappings && Array.isArray(mappings)) {
      for (const item of mappings) {
        if (item.productId && item.imageUrl) {
          const publicId = item.imageUrl.split("/").pop().split(".")[0];
          await Product.findByIdAndUpdate(item.productId, {
            images: [{ url: item.imageUrl, publicId }]
          });
          updatedProducts++;
        } else if (item.productName && item.imageUrl) {
          const publicId = item.imageUrl.split("/").pop().split(".")[0];
          await Product.updateMany(
            { name: { $regex: new RegExp(`^${item.productName}$`, "i") } },
            { images: [{ url: item.imageUrl, publicId }] }
          );
          updatedProducts++;
        }
      }
    }

    // 2. Update Category Images
    if (categoryMappings && Array.isArray(categoryMappings)) {
      for (const catItem of categoryMappings) {
        if (catItem.categoryId && catItem.imageUrl) {
          await Category.findByIdAndUpdate(catItem.categoryId, {
            image: catItem.imageUrl
          });
          updatedCategories++;
        } else if (catItem.categorySlug && catItem.imageUrl) {
          await Category.updateMany(
            { slug: catItem.categorySlug },
            { image: catItem.imageUrl }
          );
          updatedCategories++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${updatedProducts} product images and ${updatedCategories} category images!`,
    });
  } catch (error: any) {
    console.error("Bulk image update error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
