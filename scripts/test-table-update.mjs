import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://shalini252002sm_db_user:cXYX37apRe6eaTHl@cluster0.rjcekup.mongodb.net/ceylon_curry?retryWrites=true&w=majority&appName=Cluster0";

const TableSchema = new mongoose.Schema(
  {
    tableNumber: { type: Number, required: true, unique: true },
    capacity: { type: Number, required: true },
    type: { type: String, enum: ["Couple", "Family"], default: "Couple" },
    status: { type: String, enum: ["Available", "Reserved", "Occupied", "Maintenance"], default: "Available" },
    image: {
      url: { type: String },
      publicId: { type: String },
      width: { type: Number },
      height: { type: Number },
      format: { type: String },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Table = mongoose.models.Table || mongoose.model("Table", TableSchema);

async function testUpdate() {
  console.log("🔌 Connecting to Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.");

  const testUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

  const updated = await Table.findOneAndUpdate(
    { tableNumber: 1 },
    { $set: { "image.url": testUrl, "image.publicId": "test_123" } },
    { returnDocument: "after" }
  );

  console.log("Updated Table #1 in Atlas:", JSON.stringify(updated, null, 2));
  await mongoose.disconnect();
}

testUpdate().catch((e) => console.error("Error:", e));
