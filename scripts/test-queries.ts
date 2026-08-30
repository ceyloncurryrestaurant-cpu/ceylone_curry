import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../src/models/Product";
import Category from "../src/models/Category";
import Review from "../src/models/Review";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined");
  process.exit(1);
}

async function test() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Connected to MongoDB!");

    console.log("Querying Categories...");
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean();
    console.log(`Found ${categories.length} categories.`);

    console.log("Querying Featured Products...");
    const featuredProducts = await Product.find({ isFeatured: true, isAvailable: true })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();
    console.log(`Found ${featuredProducts.length} featured products.`);

    console.log("Querying Offer Products...");
    const offerProducts = await Product.find({ isOffer: true, isAvailable: true })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();
    console.log(`Found ${offerProducts.length} offer products.`);

    console.log("Querying Reviews...");
    const reviews = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
    console.log(`Found ${reviews.length} reviews.`);

    console.log("✅ All queries succeeded without error!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Mongoose Query Error:", err);
    process.exit(1);
  }
}

test();
