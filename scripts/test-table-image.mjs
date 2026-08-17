// Run this: node scripts/test-table-image.mjs
// Tests the full table image upload flow against production

const PROD_URL = "https://ceyloncurry.vercel.app";

async function testTableFlow() {
  console.log("=== Testing table image flow on Vercel production ===\n");

  // Step 1: Get tables
  console.log("1. Fetching tables from production...");
  const tablesRes = await fetch(`${PROD_URL}/api/tables`);
  const tablesData = await tablesRes.json();
  console.log("   success:", tablesData.success);
  console.log("   tables count:", tablesData.tables?.length);

  if (tablesData.tables?.length > 0) {
    const t = tablesData.tables[0];
    console.log(`   Table[0] _id: "${t._id}"`);
    console.log(`   Table[0] tableNumber: ${t.tableNumber}`);
    console.log(`   Table[0] image:`, t.image || "(none)");

    // Check if the _id looks like a real ObjectId or a fake tbl_X
    const isRealId = /^[a-f\d]{24}$/i.test(t._id);
    console.log(`   Table[0] _id is real ObjectId: ${isRealId}`);

    if (!isRealId) {
      console.log("\n⚠️  PROBLEM FOUND: Tables are being returned with FAKE IDs from memoryStore!");
      console.log("   This means MongoDB connection is failing or slow on this API call.");
      console.log("   The PUT to update the image is going to tbl_X which won't save properly.");
    }

    // Step 2: Try to update table image URL directly
    const testImageUrl = "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80";
    console.log(`\n2. Testing PUT /api/tables/${t._id} with image URL...`);
    // We can't do this without auth, so just check the response
    const updateRes = await fetch(`${PROD_URL}/api/tables/${t._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: { url: testImageUrl } }),
    });
    console.log("   Response status:", updateRes.status);
    const updateData = await updateRes.json();
    console.log("   Response:", JSON.stringify(updateData));
  }

  console.log("\n=== Done ===");
}

testTableFlow().catch(console.error);
