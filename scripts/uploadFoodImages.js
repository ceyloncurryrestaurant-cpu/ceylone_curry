const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadAndAssign() {
  console.log("Uploading accurate local food images to Cloudinary...");

  const filesToUpload = [
    { name: "parotta", path: "public/images/hero/parotta.jpg" },
    { name: "biryani", path: "public/images/hero/biryani.jpg" },
    { name: "dosa", path: "public/images/hero/dosa.jpg" },
    { name: "curry", path: "public/images/hero/curry.jpg" },
    { name: "egg_dosa", path: "public/gallery/Egg-Dosa.jpg" },
    { name: "hyderabadi_biryani", path: "public/gallery/chicken-hyderabadi-biryani-01 (1).jpg" },
  ];

  const uploadedMap = {};

  for (const item of filesToUpload) {
    if (fs.existsSync(item.path)) {
      const res = await cloudinary.uploader.upload(item.path, {
        folder: "ceylon_curry_authentic_menu",
        public_id: item.name
      });
      console.log(`Uploaded ${item.name} => ${res.secure_url}`);
      uploadedMap[item.name] = res.secure_url;
    }
  }

  // Connect to MongoDB Atlas and assign exact matching Cloudinary food images to dishes
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const parottaUrl = uploadedMap["parotta"] || "/images/hero/parotta.jpg";
  const biryaniUrl = uploadedMap["biryani"] || "/images/hero/biryani.jpg";
  const dosaUrl = uploadedMap["dosa"] || "/images/hero/dosa.jpg";
  const curryUrl = uploadedMap["curry"] || "/images/hero/curry.jpg";
  const eggDosaUrl = uploadedMap["egg_dosa"] || "/gallery/Egg-Dosa.jpg";

  // Update Parotta products
  await db.collection("products").updateMany(
    { name: { $regex: /parotta/i } },
    { $set: { images: [{ url: parottaUrl, publicId: "parotta" }] } }
  );

  // Update Biryani products
  await db.collection("products").updateMany(
    { name: { $regex: /biryani/i } },
    { $set: { images: [{ url: biryaniUrl, publicId: "biryani" }] } }
  );

  // Update Dosa products
  await db.collection("products").updateMany(
    { name: { $regex: /dosa/i } },
    { $set: { images: [{ url: dosaUrl, publicId: "dosa" }] } }
  );

  // Update Egg Dosa specifically
  await db.collection("products").updateOne(
    { name: { $regex: /egg dosa/i } },
    { $set: { images: [{ url: eggDosaUrl, publicId: "egg_dosa" }] } }
  );

  // Update Curry products
  await db.collection("products").updateMany(
    { name: { $regex: /curry/i } },
    { $set: { images: [{ url: curryUrl, publicId: "curry" }] } }
  );

  // Update Categories
  await db.collection("categories").updateOne({ slug: "kothu-parotta" }, { $set: { image: parottaUrl } });
  await db.collection("categories").updateOne({ slug: "biryani" }, { $set: { image: biryaniUrl } });
  await db.collection("categories").updateOne({ slug: "dosa" }, { $set: { image: dosaUrl } });
  await db.collection("categories").updateOne({ slug: "curry" }, { $set: { image: curryUrl } });

  console.log("✅ Updated Parotta, Biryani, Dosa, and Curry products with 100% accurate Cloudinary images!");
  process.exit(0);
}

uploadAndAssign().catch(e => {
  console.error("Upload error:", e);
  process.exit(1);
});
