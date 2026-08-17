import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getAdminSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      const { memoryStore } = await import("@/lib/memoryStore");
      return NextResponse.json({ success: true, count: memoryStore.products.length, products: memoryStore.products });
    }
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const isOffer = searchParams.get("isOffer");
    const isFeatured = searchParams.get("isFeatured");
    const isAvailable = searchParams.get("isAvailable");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort"); // 'featured', 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest'

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "all") {
      // Find category ID by slug or ID
      const catDoc = await Category.findOne({
        $or: [{ _id: category.match(/^[0-9a-fA-F]{24}$/) ? category : null }, { slug: category }],
      });
      if (catDoc) {
        query.categoryId = catDoc._id;
      }
    }

    if (isOffer === "true") {
      query.isOffer = true;
    }

    if (isFeatured === "true") {
      query.isFeatured = true;
    }

    if (isAvailable === "true") {
      query.isAvailable = true;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOptions: any = { createdAt: -1 };
    if (sort === "price-asc") sortOptions = { price: 1 };
    else if (sort === "price-desc") sortOptions = { price: -1 };
    else if (sort === "name-asc") sortOptions = { name: 1 };
    else if (sort === "name-desc") sortOptions = { name: -1 };
    else if (sort === "featured") sortOptions = { isFeatured: -1, createdAt: -1 };
    else if (sort === "offers") sortOptions = { isOffer: -1, createdAt: -1 };

    const products = await Product.find(query)
      .populate("categoryId", "name slug")
      .sort(sortOptions);

    return NextResponse.json({ success: true, count: products.length, products });
  } catch (error: any) {
    const { memoryStore } = await import("@/lib/memoryStore");
    return NextResponse.json({ success: true, count: memoryStore.products.length, products: memoryStore.products });
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getAdminSession();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Backend validation: Maximum 4 images
    if (body.images && body.images.length > 4) {
      return NextResponse.json(
        { success: false, error: "A maximum of 4 product images is allowed." },
        { status: 400 }
      );
    }

    // Auto calculate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    }

    // Auto calculate discount percentage if offer is enabled
    if (body.isOffer && body.price && body.offerPrice) {
      body.originalPrice = body.price;
      body.discountPercentage = Math.round(((body.price - body.offerPrice) / body.price) * 100);
    }

    const conn = await connectToDatabase();
    if (conn) {
      try {
        const product = await Product.create(body);
        return NextResponse.json({ success: true, message: "Product added successfully", product });
      } catch (err) {
        console.error("DB create product error:", err);
      }
    }

    // Fallback: add to memoryStore
    const { memoryStore } = await import("@/lib/memoryStore");
    const newProduct = { _id: `prod_${Date.now()}`, ...body };
    memoryStore.products.push(newProduct);
    return NextResponse.json({ success: true, message: "Product added successfully", product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
