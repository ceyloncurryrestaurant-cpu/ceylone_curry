// Run: node scripts/test-accept.cjs
const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://shalini252002sm_db_user:cXYX37apRe6eaTHl@cluster0.rjcekup.mongodb.net/ceylon_curry?retryWrites=true&w=majority&appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB Atlas!");

  const db = mongoose.connection.db;
  
  // Find accepted reservations
  const reservations = await db.collection("reservations").find({ status: "Accepted" }).toArray();
  console.log("Accepted Reservations:", reservations.length);
  for (const res of reservations) {
    console.log(`- Ref: ${res.reservationNumber}, TableId: ${res.tableId}`);
    const table = await db.collection("tables").findOne({ _id: res.tableId });
    if (table) {
      console.log(`  -> Table ${table.tableNumber} status is: "${table.status}"`);
    } else {
      console.log(`  -> Table not found in DB!`);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
