// Deep diagnostic: tests the full table image update flow against production
// Run: node scripts/diagnose-tables.mjs
const PROD = "https://ceyloncurry.vercel.app";

async function run() {
  console.log("=== DEEP TABLE DIAGNOSTIC ===\n");

  // 1. Check GET /api/tables
  console.log("STEP 1: GET /api/tables...");
  const r1 = await fetch(`${PROD}/api/tables`);
  const d1 = await r1.json();
  console.log("  Status:", r1.status);
  console.log("  Success:", d1.success);
  console.log("  Count:", d1.tables?.length);
  d1.tables?.forEach(t => {
    const isRealId = /^[a-f\d]{24}$/i.test(t._id);
    console.log(`  Table ${t.tableNumber}: _id="${t._id}" realObjectId=${isRealId} image=${t.image?.url || "(none)"}`);
  });

  const hasFakeIds = d1.tables?.some(t => !/^[a-f\d]{24}$/i.test(t._id));

  if (hasFakeIds) {
    console.log("\n⚠️  ROOT CAUSE: Tables are coming from memoryStore (fake IDs like tbl_1, tbl_2)");
    console.log("   Reason: MongoDB tables collection is EMPTY - so GET falls back to memoryStore");
    console.log("   Result: Any image update saved to MongoDB is invisible because GET never reads it");
  } else {
    console.log("\n✅ Tables have real MongoDB IDs");

    // Check if any have images
    const withImages = d1.tables?.filter(t => t.image?.url);
    console.log(`  Tables with images: ${withImages?.length || 0}`);
  }

  // 2. Try to hit the tables seeder endpoint
  console.log("\nSTEP 2: GET /api/tables/seed (checking if seed route exists)...");
  const r2 = await fetch(`${PROD}/api/tables/seed`);
  console.log("  Status:", r2.status);

  console.log("\n=== DIAGNOSIS COMPLETE ===");
}

run().catch(console.error);
