// Direct seed script - run with: node scripts/seed-atlas.mjs
import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://shalini252002sm_db_user:cXYX37apRe6eaTHl@cluster0.rjcekup.mongodb.net/ceylon_curry?retryWrites=true&w=majority&appName=Cluster0";

// ---- Schemas ----
const CategorySchema = new mongoose.Schema({
  name: String, slug: String, description: String, displayOrder: Number, isActive: { type: Boolean, default: true }
}, { timestamps: true });

const ProductSchema = new mongoose.Schema({
  name: String, slug: String, categoryId: mongoose.Schema.Types.ObjectId,
  shortDescription: String, description: String,
  price: Number, originalPrice: Number,
  isOffer: Boolean, offerPrice: Number, discountPercentage: Number,
  ingredients: [String], allergens: [String],
  isAvailable: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  images: [{ url: String, publicId: String }],
}, { timestamps: true });

const AdminSchema = new mongoose.Schema({
  email: String, passwordHash: String, name: String, role: String
}, { timestamps: true });

const SettingsSchema = new mongoose.Schema({
  restaurantName: String, address: String,
  mobileNumber: String, whatsappNumber: String,
  restaurantEmail: String, adminEmail: String,
  deliveryFee: { type: Number, default: 2.99 },
  openingHours: Object, socialLinks: Object,
  currency: { type: String, default: "£" },
  reservationSettings: Object,
}, { timestamps: true });

const TableSchema = new mongoose.Schema({
  tableNumber: Number, capacity: Number, type: String, status: { type: String, default: "Available" }
}, { timestamps: true });

const Category = mongoose.models.Category || mongoose.model("Category", CategorySchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
const Table = mongoose.models.Table || mongoose.model("Table", TableSchema);

// ---- Helpers ----
import crypto from "crypto";
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  console.log("🔌 Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  console.log("✅ Connected!\n");

  // 1. Settings
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      restaurantName: "Ceylon Curry",
      address: "44 Mayflower St, Plymouth PL1 1QX",
      mobileNumber: "01752 941504",
      whatsappNumber: "+441752941504",
      restaurantEmail: "info@ceyloncurry.co.uk",
      adminEmail: "admin@ceyloncurry.co.uk",
      deliveryFee: 2.99,
      openingHours: {
        monday: "12:00 PM - 10:00 PM", tuesday: "12:00 PM - 10:00 PM",
        wednesday: "12:00 PM - 10:00 PM", thursday: "12:00 PM - 10:00 PM",
        friday: "12:00 PM - 11:00 PM", saturday: "12:00 PM - 11:00 PM",
        sunday: "12:00 PM - 09:30 PM",
      },
      socialLinks: { facebook: "https://facebook.com/ceyloncurry", instagram: "https://instagram.com/ceyloncurry", tiktok: "https://tiktok.com/@ceyloncurry" },
      currency: "£",
      reservationSettings: { reservationDurationMinutes: 60, minNoticeHours: 1, maxAdvanceDays: 30 },
    });
    console.log("✅ Settings created.");
  } else { console.log("ℹ️  Settings already exist."); }

  // 2. Admin
  await Admin.deleteMany({ email: { $in: ["admin@ceyloncurry.co.uk", "admin@ceyloncurry"] } });
  await Admin.create({
    email: "admin@ceyloncurry",
    passwordHash: hashPassword("ceyloncurry@3443"),
    name: "Ceylon Curry Admin",
    role: "admin",
  });
  console.log("✅ Admin user created: admin@ceyloncurry / ceyloncurry@3443");

  // 3. Tables
  const tableCount = await Table.countDocuments();
  if (tableCount === 0) {
    await Table.insertMany([
      { tableNumber: 1, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 2, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 3, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 4, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 5, capacity: 4, type: "Family", status: "Available" },
      { tableNumber: 6, capacity: 4, type: "Family", status: "Available" },
      { tableNumber: 7, capacity: 4, type: "Family", status: "Available" },
    ]);
    console.log("✅ 7 Tables seeded.");
  } else { console.log(`ℹ️  ${tableCount} Tables already exist.`); }

  // 4. Categories
  const catCount = await Category.countDocuments();
  if (catCount > 0) {
    console.log(`ℹ️  ${catCount} Categories already exist. Skipping products seed.`);
    await mongoose.disconnect();
    return;
  }

  const cats = await Category.insertMany([
    { name: "Starters",      slug: "starters",     description: "Crispy rolls, cutlets and traditional Sri Lankan street bites",                displayOrder: 1 },
    { name: "Kottu",         slug: "kottu",         description: "Iconic Sri Lankan chopped flatbread tossed with vegetables, spices & curry",   displayOrder: 2 },
    { name: "Rice & Biryani",slug: "rice-biryani",  description: "Aromatic basmati rice, lamprais & spiced biryani bowls",                       displayOrder: 3 },
    { name: "Curries",       slug: "curries",       description: "Authentic roasted Ceylon spice curries cooked slowly with coconut milk",       displayOrder: 4 },
    { name: "Seafood",       slug: "seafood",       description: "Fresh Jaffna crab curry, devilled prawns and fried fish",                      displayOrder: 5 },
    { name: "Vegetarian",    slug: "vegetarian",    description: "Plant-based curries, parathas, hoppers & dhal dishes",                         displayOrder: 6 },
    { name: "Desserts",      slug: "desserts",      description: "Traditional Watalappan, coconut pudding and sweets",                           displayOrder: 7 },
    { name: "Drinks",        slug: "drinks",        description: "Ceylon spiced tea, fresh mango lassi and refreshments",                        displayOrder: 8 },
  ]);
  console.log(`✅ ${cats.length} Categories seeded.`);

  const cm = {};
  cats.forEach(c => cm[c.slug] = c._id);

  // 5. Products
  await Product.insertMany([
    // ── STARTERS ──
    {
      name: "Mutton Rolls (3 Pcs)", slug: "mutton-rolls", categoryId: cm["starters"],
      shortDescription: "Crispy breaded rolls filled with spiced minced mutton and potato.",
      description: "Classic Sri Lankan street food starter. Crispy golden rolls stuffed with seasoned minced mutton, braised potatoes, and curry leaves.",
      price: 6.50, isOffer: false, ingredients: ["Minced Mutton","Potatoes","Curry Leaves","Breadcrumbs"], allergens: ["Gluten"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Prawn Cutlets (4 Pcs)", slug: "prawn-cutlets", categoryId: cm["starters"],
      shortDescription: "Golden-fried prawn cutlets with a crispy coating and creamy filling.",
      description: "Succulent prawn filling encased in a crisp crumb shell, seasoned with green chilli, onion, and curry leaves.",
      price: 7.50, isOffer: false, ingredients: ["Prawns","Onions","Green Chilli","Breadcrumbs"], allergens: ["Gluten","Crustaceans"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Papadam Basket", slug: "papadam-basket", categoryId: cm["starters"],
      shortDescription: "Crispy lentil wafers served with coconut sambol and mint chutney.",
      description: "Light, crispy rice and lentil papadams served warm with freshly grated coconut sambol and a cooling mint-coriander chutney.",
      price: 3.99, isOffer: false, ingredients: ["Lentil Wafers","Coconut Sambol","Mint Chutney"], allergens: ["Gluten"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── KOTTU ──
    {
      name: "Chicken Kottu", slug: "chicken-kottu", categoryId: cm["kottu"],
      shortDescription: "Chopped roti stir-fried with tender chicken, egg, fresh vegetables and aromatic Ceylon curry spices.",
      description: "Our signature dish! Fresh paratha roti shredded on a hot griddle and tossed with spiced chicken, farm eggs, leeks, onions, and curry sauce.",
      price: 12.00, isOffer: true, offerPrice: 9.99, discountPercentage: 17,
      ingredients: ["Chopped Roti","Tender Chicken","Eggs","Onions","Leeks","Ceylon Spices"], allergens: ["Gluten","Eggs"],
      isAvailable: true, isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Cheese Kottu", slug: "cheese-kottu", categoryId: cm["kottu"],
      shortDescription: "Sizzling iron-griddled flatbread with roasted chicken, farm eggs and melted cheddar sauce.",
      description: "Street-food comfort elevated. Shredded godamba flatbread flash-fried with chicken, eggs, leeks, and finished with rich melted cheddar cheese sauce.",
      price: 13.50, isOffer: false, ingredients: ["Godamba Roti","Chicken","Eggs","Cheddar Cheese","Leeks"], allergens: ["Gluten","Eggs","Dairy"],
      isAvailable: true, isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Vegetable Kottu", slug: "vegetable-kottu", categoryId: cm["kottu"],
      shortDescription: "Fresh-chopped roti tossed with seasonal vegetables, egg and aromatic island spices.",
      description: "A wholesome, fragrant vegetarian kottu made with crispy roti, stir-fried carrots, cabbage, leeks, green chilli and a Ceylon spice blend.",
      price: 10.50, isOffer: false, ingredients: ["Chopped Roti","Mixed Vegetables","Eggs","Ceylon Spices"], allergens: ["Gluten","Eggs"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── RICE & BIRYANI ──
    {
      name: "Ceylon Chicken Lamprais", slug: "ceylon-chicken-lamprais", categoryId: cm["rice-biryani"],
      shortDescription: "Dutch Burgher delicacy: Ghee rice, spiced chicken curry & fried egg wrapped in banana leaf.",
      description: "Authentic Ceylon Lamprais baked inside a fragrant banana leaf parcel, sealing in rich aromas of ghee rice, chicken curry, aubergine moju and sweet aubergine.",
      price: 15.00, isOffer: true, offerPrice: 13.50, discountPercentage: 10,
      ingredients: ["Basmati Rice","Chicken Curry","Aubergine Moju","Seeni Sambol","Boiled Egg"], allergens: ["Eggs","Mustard"],
      isAvailable: true, isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Lamb Biryani", slug: "lamb-biryani", categoryId: cm["rice-biryani"],
      shortDescription: "Fragrant basmati layered with slow-cooked spiced lamb and saffron crust.",
      description: "Dum-cooked aromatic lamb biryani layered with caramelised onions, whole spices, saffron milk, and freshly chopped coriander.",
      price: 14.99, isOffer: false, ingredients: ["Basmati Rice","Lamb","Saffron","Caramelised Onions","Whole Spices"], allergens: ["Gluten"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── CURRIES ──
    {
      name: "Jaffna Black Lamb Curry", slug: "jaffna-lamb-curry", categoryId: cm["curries"],
      shortDescription: "Slow-cooked boneless lamb infused with dark roasted Jaffna curry powder and coconut milk.",
      description: "Authentic Northern Sri Lankan style lamb curry simmered until melt-in-the-mouth tender with lemongrass, pandan leaves, and roasted dark spices.",
      price: 15.90, isOffer: false, ingredients: ["Boneless Lamb","Roasted Curry Powder","Coconut Milk","Lemongrass","Pandan Leaf"], allergens: [],
      isAvailable: true, isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Chicken Curry", slug: "chicken-curry", categoryId: cm["curries"],
      shortDescription: "Tender chicken pieces simmered in a rich Ceylon roasted spice and coconut milk gravy.",
      description: "Bone-in chicken slow-cooked in a deep-flavoured roasted Ceylon curry powder base with thick coconut cream, tomato and curry leaves.",
      price: 12.99, isOffer: true, offerPrice: 10.99, discountPercentage: 15,
      ingredients: ["Chicken","Ceylon Curry Powder","Coconut Milk","Tomato","Curry Leaves"], allergens: [],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Karapincha Claypot Curry", slug: "karapincha-claypot-curry", categoryId: cm["curries"],
      shortDescription: "Slow-simmered claypot curry fragrant with fresh curry leaves and island spices.",
      description: "A rustic Ceylon claypot special — tender meat pieces slow-braised with an abundance of fresh karapincha (curry leaves), roasted coriander and coconut.",
      price: 14.20, isOffer: false, ingredients: ["Meat","Curry Leaves","Roasted Coriander","Coconut"], allergens: [],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── SEAFOOD ──
    {
      name: "Devilled King Prawns", slug: "devilled-king-prawns", categoryId: cm["seafood"],
      shortDescription: "Jumbo king prawns wok-tossed with capsicum, banana peppers and sweet-spicy Ceylon chilli glaze.",
      description: "Fresh tiger prawns fried and tossed in a fiery, sweet-and-sour Sri Lankan devilled glaze with crunchy peppers, onions and garlic.",
      price: 14.80, isOffer: true, offerPrice: 12.99, discountPercentage: 12,
      ingredients: ["King Prawns","Bell Peppers","Onions","Chili Glaze","Garlic","Ginger"], allergens: ["Crustaceans","Soy"],
      isAvailable: true, isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Jaffna Crab Curry", slug: "jaffna-crab-curry", categoryId: cm["seafood"],
      shortDescription: "Whole mud crab cooked in fiery Northern Jaffna roasted spice gravy.",
      description: "A legendary Northern Sri Lanka specialty — whole mud crabs cracked and simmered in a bold, jet-black roasted Jaffna spice curry with thick coconut milk.",
      price: 18.50, isOffer: false, ingredients: ["Whole Mud Crab","Jaffna Curry Powder","Coconut Milk","Tomato"], allergens: ["Crustaceans"],
      isAvailable: true, isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Grilled Sea Bass", slug: "grilled-sea-bass", categoryId: cm["seafood"],
      shortDescription: "Pan-grilled sea bass fillet with Ceylon spice rub and coconut dressing.",
      description: "Fresh Atlantic sea bass fillet grilled to perfection with a dry Ceylon spice crust, served with coconut-lemon dressing and island slaw.",
      price: 16.50, isOffer: false, ingredients: ["Sea Bass","Ceylon Spice Rub","Coconut","Lemon"], allergens: ["Fish"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── VEGETARIAN ──
    {
      name: "Sri Lankan Dhal Curry", slug: "sri-lankan-dhal-curry", categoryId: cm["vegetarian"],
      shortDescription: "Creamy red lentils tempered with mustard seeds, curry leaves, garlic and coconut milk.",
      description: "Essential Ceylon staple curry. Red split lentils cooked until smooth, tempered in coconut oil with fresh curry leaves, turmeric and garlic.",
      price: 7.99, isOffer: false, ingredients: ["Red Lentils","Coconut Milk","Mustard Seeds","Turmeric","Curry Leaves"], allergens: ["Mustard"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Egg Hopper", slug: "egg-hopper", categoryId: cm["vegetarian"],
      shortDescription: "Crispy bowl-shaped fermented rice pancake with a soft-set egg in the centre.",
      description: "Traditional Ceylon breakfast and dinner staple. Lacy fermented rice batter cooked in a wok to create a light crispy bowl with a perfectly set runny egg.",
      price: 5.50, isOffer: false, ingredients: ["Fermented Rice Batter","Egg","Coconut Milk"], allergens: ["Eggs","Gluten"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Jackfruit Curry", slug: "jackfruit-curry", categoryId: cm["vegetarian"],
      shortDescription: "Young green jackfruit slow-cooked in coconut and Ceylon roasted spice curry.",
      description: "A firm favourite! Tender chunks of young jackfruit braised in a richly spiced coconut gravy with roasted curry powder, cinnamon and pandan.",
      price: 10.50, isOffer: true, offerPrice: 8.99, discountPercentage: 14,
      ingredients: ["Young Jackfruit","Coconut Milk","Roasted Curry Powder","Cinnamon","Pandan"], allergens: [],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── DESSERTS ──
    {
      name: "Watalappan", slug: "watalappan", categoryId: cm["desserts"],
      shortDescription: "Traditional steamed coconut jaggery custard pudding spiced with cardamom and toasted cashews.",
      description: "Classic Sri Lankan royal dessert made with thick kitul jaggery syrup, coconut cream, eggs, nutmeg, cardamom, and roasted cashew nuts.",
      price: 5.50, isOffer: false, ingredients: ["Kitul Jaggery","Coconut Milk","Eggs","Cardamom","Cashews"], allergens: ["Eggs","Nuts"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Coconut Panna Cotta", slug: "coconut-panna-cotta", categoryId: cm["desserts"],
      shortDescription: "Silky coconut cream panna cotta topped with mango coulis and toasted coconut flakes.",
      description: "A Ceylon-inspired Italian classic — silky fresh coconut milk panna cotta chilled to perfection, topped with tropical mango coulis and crunchy toasted coconut.",
      price: 5.99, isOffer: false, ingredients: ["Coconut Cream","Mango","Gelatin","Toasted Coconut"], allergens: ["Dairy"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80" }],
    },

    // ── DRINKS ──
    {
      name: "Ceylon Spiced Tea", slug: "ceylon-spiced-tea", categoryId: cm["drinks"],
      shortDescription: "Rich brewed Ceylon black tea spiced with cardamom, cinnamon and ginger.",
      description: "A warming cup of strong premium Ceylon black tea slow-brewed with whole green cardamom, cinnamon sticks, fresh ginger, and a touch of clove.",
      price: 3.50, isOffer: false, ingredients: ["Ceylon Black Tea","Cardamom","Cinnamon","Ginger","Clove"], allergens: [],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80" }],
    },
    {
      name: "Fresh Mango Lassi", slug: "fresh-mango-lassi", categoryId: cm["drinks"],
      shortDescription: "Thick and creamy blended mango and yoghurt drink with a hint of cardamom.",
      description: "Made to order with real Alphonso mango pulp, thick set yoghurt, a pinch of cardamom, and finished with crushed pistachio.",
      price: 4.50, isOffer: false, ingredients: ["Mango Pulp","Yoghurt","Cardamom","Pistachio"], allergens: ["Dairy","Nuts"],
      isAvailable: true, isFeatured: false,
      images: [{ url: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?auto=format&fit=crop&w=800&q=80" }],
    },
  ]);

  console.log("✅ 22 Products seeded across all categories!");
  console.log("\n🎉 Seed complete! Your Ceylon Curry database is ready.");
  await mongoose.disconnect();
}

seed().catch(e => { console.error("❌ Seed failed:", e); process.exit(1); });
