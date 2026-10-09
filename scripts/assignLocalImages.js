const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function assignExactImages() {
  console.log("Connecting to MongoDB Atlas to update accurate dish images...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const parottaImg = "/images/hero/parotta.jpg";
  const biryaniImg = "/images/hero/biryani.jpg";
  const dosaImg = "/images/hero/dosa.jpg";
  const curryImg = "/images/hero/curry.jpg";
  const eggDosaImg = "/gallery/Egg-Dosa.jpg";
  const hyderabadiBiryaniImg = "/gallery/chicken-hyderabadi-biryani-01 (1).jpg";

  // 1. Update Parotta products
  const parottaRes = await db.collection("products").updateMany(
    { name: { $regex: /parotta/i } },
    { $set: { images: [{ url: parottaImg, publicId: "local_parotta" }] } }
  );
  console.log(`Updated ${parottaRes.modifiedCount} Parotta products with /images/hero/parotta.jpg`);

  // 2. Update Biryani products
  const biryaniRes = await db.collection("products").updateMany(
    { name: { $regex: /biryani/i } },
    { $set: { images: [{ url: biryaniImg, publicId: "local_biryani" }] } }
  );
  console.log(`Updated ${biryaniRes.modifiedCount} Biryani products with /images/hero/biryani.jpg`);

  // 3. Update Dosa products
  const dosaRes = await db.collection("products").updateMany(
    { name: { $regex: /dosa/i } },
    { $set: { images: [{ url: dosaImg, publicId: "local_dosa" }] } }
  );
  console.log(`Updated ${dosaRes.modifiedCount} Dosa products with /images/hero/dosa.jpg`);

  // 4. Update Egg Dosa specifically
  await db.collection("products").updateOne(
    { name: { $regex: /egg dosa/i } },
    { $set: { images: [{ url: eggDosaImg, publicId: "local_egg_dosa" }] } }
  );

  // 5. Update Hyderabadi / Chicken Biryani specifically
  await db.collection("products").updateMany(
    { name: { $regex: /chicken biryani/i } },
    { $set: { images: [{ url: hyderabadiBiryaniImg, publicId: "local_hyderabadi_biryani" }] } }
  );

  // 6. Update Curry products
  const curryRes = await db.collection("products").updateMany(
    { name: { $regex: /curry/i } },
    { $set: { images: [{ url: curryImg, publicId: "local_curry" }] } }
  );
  console.log(`Updated ${curryRes.modifiedCount} Curry products with /images/hero/curry.jpg`);

  // 7. Update Category thumbnails
  await db.collection("categories").updateOne({ slug: "kothu-parotta" }, { $set: { image: parottaImg } });
  await db.collection("categories").updateOne({ slug: "biryani" }, { $set: { image: biryaniImg } });
  await db.collection("categories").updateOne({ slug: "dosa" }, { $set: { image: dosaImg } });
  await db.collection("categories").updateOne({ slug: "curry" }, { $set: { image: curryImg } });

  console.log("✅ Successfully updated all Parotta, Biryani, Dosa, and Curry products with exact matching images!");
  process.exit(0);
}

assignExactImages().catch(e => {
  console.error("Error updating images:", e);
  process.exit(1);
});
