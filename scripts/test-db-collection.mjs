// Run: node scripts/test-db-collection.mjs
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://shalini252002sm_db_user:cXYX37apRe6eaTHl@cluster0.rjcekup.mongodb.net/ceylon_curry?retryWrites=true&w=majority&appName=Cluster0";

async function test() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  // List all collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections:", collections.map(c => c.name));

  // Count tables
  const db = mongoose.connection.db;
  const tablesCount = await db.collection("tables").countDocuments();
  console.log("Tables count in DB:", tablesCount);

  if (tablesCount > 0) {
    const sampleTables = await db.collection("tables").find().toArray();
    console.log("Sample Tables:", sampleTables.map(t => ({ _id: t._id, tableNumber: t.tableNumber, image: t.image })));
  } else {
    console.log("Tables collection is empty or does not exist!");
  }

  await mongoose.disconnect();
}

test().catch(console.error);
