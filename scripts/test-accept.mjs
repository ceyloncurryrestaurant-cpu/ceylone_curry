// Run: node scripts/test-accept.mjs
import mongoose from "mongoose";
import Reservation from "../src/models/Reservation.js";
import Table from "../src/models/Table.js";

const MONGODB_URI = "mongodb+srv://shalini252002sm_db_user:cXYX37apRe6eaTHl@cluster0.rjcekup.mongodb.net/ceylon_curry?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB Atlas!");

  // Find one accepted reservation
  const res = await Reservation.findOne({ status: "Accepted" });
  if (res) {
    console.log("Found Accepted Reservation:", res.reservationNumber, "for tableId:", res.tableId);
    
    // Check the table status in DB
    const table = await Table.findById(res.tableId);
    if (table) {
      console.log(`Table ${table.tableNumber} status is: "${table.status}"`);
    } else {
      console.log("Table not found in DB!");
    }
  } else {
    console.log("No accepted reservations found in DB!");
  }

  await mongoose.disconnect();
}

run().catch(console.error);
