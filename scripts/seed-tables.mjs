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

async function setTableImages() {
  console.log("🔌 Connecting to Atlas...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected.");

  const defaultImgCouple = "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80";
  const defaultImgFamily = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80";

  for (let i = 1; i <= 7; i++) {
    const defaultUrl = i <= 4 ? defaultImgCouple : defaultImgFamily;
    await Table.findOneAndUpdate(
      { tableNumber: i },
      {
        $set: {
          image: {
            url: defaultUrl,
            publicId: `default_table_${i}`,
          },
        },
      },
      { upsert: true, new: true }
    );
    console.log(`✅ Table #${i} updated with default image!`);
  }

  const updatedTables = await Table.find({}).sort({ tableNumber: 1 });
  console.log("\nFinal state of tables in Atlas:");
  updatedTables.forEach((t) => {
    console.log(`Table #${t.tableNumber} | Image URL: ${t.image?.url}`);
  });

  await mongoose.disconnect();
}

setTableImages().catch((err) => console.error("Error:", err));
