const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ceylon_curry";

async function updateHours() {
  console.log("Connecting to Local MongoDB to update opening hours...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const newHours = {
    monday: "10:00 AM - 10:00 PM",
    tuesday: "10:00 AM - 10:00 PM",
    wednesday: "10:00 AM - 10:00 PM",
    thursday: "10:00 AM - 10:00 PM",
    friday: "10:00 AM - 10:00 PM",
    saturday: "10:00 AM - 10:00 PM",
    sunday: "10:00 AM - 10:00 PM",
  };

  await db.collection("settings").updateMany({}, {
    $set: { openingHours: newHours }
  });

  console.log("✅ Updated local MongoDB opening hours to: 10:00 AM - 10:00 PM for all days!");
  process.exit(0);
}

updateHours().catch((e) => {
  console.error("Error:", e);
  process.exit(1);
});
