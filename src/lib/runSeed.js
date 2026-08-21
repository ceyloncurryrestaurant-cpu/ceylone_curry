const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/ceylon_curry";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function seed() {
  console.log("🌱 Connecting to Local MongoDB:", MONGODB_URI);
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB!");

  const db = mongoose.connection.db;

  // 1. Settings Collection
  const settingsColl = db.collection("settings");
  const existingSettings = await settingsColl.findOne({});
  if (!existingSettings) {
    await settingsColl.insertOne({
      restaurantName: "Ceylon Curry",
      address: "44 Mayflower St, Plymouth PL1 1QX",
      mobileNumber: "01752 941504",
      whatsappNumber: "+441752941504",
      restaurantEmail: "info@ceyloncurry.co.uk",
      adminEmail: "admin@ceyloncurry.co.uk",
      openingHours: {
        monday: "10:00 AM - 10:00 PM",
        tuesday: "10:00 AM - 10:00 PM",
        wednesday: "10:00 AM - 10:00 PM",
        thursday: "10:00 AM - 10:00 PM",
        friday: "10:00 AM - 10:00 PM",
        saturday: "10:00 AM - 10:00 PM",
        sunday: "10:00 AM - 10:00 PM",
      },
      socialLinks: {
        facebook: "https://facebook.com/ceyloncurry",
        instagram: "https://instagram.com/ceyloncurry",
        tiktok: "https://tiktok.com/@ceyloncurry",
      },
      currency: "£",
      reservationSettings: {
        reservationDurationMinutes: 60,
        minNoticeHours: 1,
        maxAdvanceDays: 30,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("✅ Settings collection initialized.");
  } else {
    // Update existing settings opening hours
    await settingsColl.updateMany({}, {
      $set: {
        openingHours: {
          monday: "10:00 AM - 10:00 PM",
          tuesday: "10:00 AM - 10:00 PM",
          wednesday: "10:00 AM - 10:00 PM",
          thursday: "10:00 AM - 10:00 PM",
          friday: "10:00 AM - 10:00 PM",
          saturday: "10:00 AM - 10:00 PM",
          sunday: "10:00 AM - 10:00 PM",
        }
      }
    });
    console.log("ℹ️ Settings updated with 10:00 AM - 10:00 PM opening hours.");
  }

  // 2. Admin Collection
  const adminColl = db.collection("admins");
  const adminEmail = "admin@ceyloncurry";
  // Clean up any old/new admin records to ensure fresh update
  await adminColl.deleteMany({ email: { $in: ["admin@ceyloncurry.co.uk", "admin@ceyloncurry"] } });
  
  const passwordHash = hashPassword("ceyloncurry@3443");
  await adminColl.insertOne({
    email: adminEmail,
    passwordHash,
    name: "Ceylon Curry Admin",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  console.log("✅ Admin user created: admin@ceyloncurry / ceyloncurry@3443");

  // 3. 7 Tables Collection with Individual High-Resolution Seating Photography
  const tablesColl = db.collection("tables");
  await tablesColl.deleteMany({}); // Re-seed tables with individual seating photography
  const defaultTables = [
    {
      tableNumber: 1,
      capacity: 2,
      type: "Couple",
      status: "Available",
      image: {
        url: "/images/couple_table.jpg",
        publicId: "table_1_cozy_window_booth",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tableNumber: 2,
      capacity: 2,
      type: "Couple",
      status: "Available",
      image: {
        url: "/images/couple_table.jpg",
        publicId: "table_2_candlelight_corner",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tableNumber: 3,
      capacity: 2,
      type: "Couple",
      status: "Available",
      image: {
        url: "/images/couple_table.jpg",
        publicId: "table_3_garden_view",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tableNumber: 4,
      capacity: 2,
      type: "Couple",
      status: "Available",
      image: {
        url: "/images/couple_table.jpg",
        publicId: "table_4_heritage_ceylon_nook",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tableNumber: 5,
      capacity: 4,
      type: "Family",
      status: "Available",
      image: {
        url: "/images/family_table.jpg",
        publicId: "table_5_royal_family_table",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tableNumber: 6,
      capacity: 4,
      type: "Family",
      status: "Available",
      image: {
        url: "/images/family_table.jpg",
        publicId: "table_6_center_dining_banquet",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      tableNumber: 7,
      capacity: 4,
      type: "Family",
      status: "Available",
      image: {
        url: "/images/family_table.jpg",
        publicId: "table_7_executive_family_alcove",
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await tablesColl.insertMany(defaultTables);
  console.log("✅ 7 Restaurant Tables seeded with individual seating photography.");

  // 4. Categories Collection
  const catColl = db.collection("categories");
  const catCount = await catColl.countDocuments({});
  let catMap = {};
  if (catCount === 0) {
    const categoriesData = [
      { name: "Starters", slug: "starters", description: "Crispy rolls, cutlets and traditional Sri Lankan street bites", displayOrder: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Kottu", slug: "kottu", description: "Iconic Sri Lankan chopped flatbread tossed with vegetables, spices & curry", displayOrder: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Rice & Biryani", slug: "rice-biryani", description: "Aromatic basmati rice, lamprais & spiced biryani bowls", displayOrder: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Curries", slug: "curries", description: "Authentic roasted Ceylon spice curries cooked slowly with coconut milk", displayOrder: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Seafood", slug: "seafood", description: "Fresh Jaffna crab curry, devilled prawns and fried fish", displayOrder: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Vegetarian", slug: "vegetarian", description: "Plant-based curries, parathas, hoppers & dhal dishes", displayOrder: 6, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Desserts", slug: "desserts", description: "Traditional Watalappan, coconut pudding and sweets", displayOrder: 7, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { name: "Drinks", slug: "drinks", description: "Ceylon spiced tea, fresh mango lassi and refreshments", displayOrder: 8, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    const inserted = await catColl.insertMany(categoriesData);
    console.log("✅ Categories seeded.");
    Object.values(inserted.insertedIds).forEach((id, idx) => {
      catMap[categoriesData[idx].slug] = id;
    });
  } else {
    const cats = await catColl.find({}).toArray();
    cats.forEach((c) => {
      catMap[c.slug] = c._id;
    });
  }

  // 5. Products Collection
  const prodColl = db.collection("products");
  await prodColl.deleteMany({}); // Clean seed for products to update offers

  const productsData = [
    {
      name: "Chicken Kottu",
      slug: "chicken-kottu",
      categoryId: catMap["kottu"],
      shortDescription: "Chopped roti stir-fried with tender chicken, egg, fresh vegetables and aromatic Ceylon curry spices.",
      description: "Our signature dish! Fresh paratha roti shredded on a hot griddle and tossed with spiced chicken, farm eggs, leeks, onions, and curry sauce.",
      price: 12.00,
      originalPrice: 12.00,
      isOffer: false,
      ingredients: ["Chopped Roti", "Tender Chicken", "Eggs", "Onions", "Leeks", "Ceylon Spices"],
      allergens: ["Gluten", "Eggs"],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "/images/chicken-kottu.jpg" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Devilled Prawns",
      slug: "devilled-prawns",
      categoryId: catMap["seafood"],
      shortDescription: "Juicy king prawns sauteed with capsicum, tomatoes, and spicy sweet chili Ceylon sauce.",
      description: "Fresh tiger prawns fried and tossed in a fiery, sweet-and-sour Sri Lankan devilled glaze with crunchy peppers and onions.",
      price: 14.50,
      originalPrice: 14.50,
      isOffer: false,
      ingredients: ["King Prawns", "Bell Peppers", "Onions", "Chili Glaze", "Garlic", "Ginger"],
      allergens: ["Crustaceans", "Soy"],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Jaffna Lamb Curry",
      slug: "jaffna-lamb-curry",
      categoryId: catMap["curries"],
      shortDescription: "Slow-cooked boneless lamb infused with dark roasted Jaffna curry powder and coconut milk.",
      description: "Authentic Northern Sri Lankan style lamb curry simmered until melt-in-the-mouth tender with lemongrass, pandan leaves, and roasted spices.",
      price: 13.99,
      originalPrice: 13.99,
      isOffer: false,
      ingredients: ["Boneless Lamb", "Roasted Curry Powder", "Coconut Milk", "Lemongrass", "Pandan Leaf"],
      allergens: [],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Ceylon Chicken Lamprais",
      slug: "ceylon-chicken-lamprais",
      categoryId: catMap["rice-biryani"],
      shortDescription: "Dutch Burgher delicacy: Ghee rice, spiced chicken curry, aubergine moju, and fried egg wrapped in banana leaf.",
      description: "Authentic Ceylon Lamprais baked inside a fragrant banana leaf parcel, sealing in rich aromas of ghee rice, frikkadels, chicken curry, and sweet aubergine.",
      price: 15.00,
      originalPrice: 15.00,
      isOffer: false,
      ingredients: ["Basmati Rice", "Chicken Curry", "Aubergine Moju", "Seeni Sambol", "Boiled Egg"],
      allergens: ["Eggs", "Mustard"],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Veg Thali",
      slug: "veg-thali",
      categoryId: catMap["rice-biryani"],
      shortDescription: "A traditional Sri Lankan vegetarian platter with rice, papadum, dhal, and assorted vegetable curries.",
      description: "A complete Sri Lankan meal served on a platter. Includes steamed basmati rice, crispy papadum, creamy red lentil dhal, and three seasonal vegetable curries packed with authentic spices.",
      price: 9.99,
      originalPrice: 9.99,
      isOffer: true,
      offerPrice: 7.99,
      discountPercentage: 20,
      ingredients: ["Basmati Rice", "Red Lentil Dhal", "Seasonal Vegetables", "Papadum", "Spices"],
      allergens: [],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "/images/veg-thali.jpg" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Non Veg Thali",
      slug: "non-veg-thali",
      categoryId: catMap["rice-biryani"],
      shortDescription: "A traditional Sri Lankan non-vegetarian platter with rice, papadum, dhal, chicken curry, and mutton curry.",
      description: "A rich and complete Sri Lankan non-vegetarian platter. Includes steamed basmati rice, crispy papadum, creamy red lentil dhal, devilled vegetables, authentic chicken curry, and slow-cooked mutton curry.",
      price: 13.99,
      originalPrice: 13.99,
      isOffer: true,
      offerPrice: 10.99,
      discountPercentage: 21,
      ingredients: ["Basmati Rice", "Chicken Curry", "Mutton Curry", "Red Lentil Dhal", "Papadum", "Spices"],
      allergens: [],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "/images/non-veg-thali.jpg" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Rice & 4 Veg Curry",
      slug: "rice-4-veg-curry",
      categoryId: catMap["vegetarian"],
      shortDescription: "Steamed basmati rice served with four varieties of traditional Sri Lankan vegetable curries.",
      description: "A wholesome and healthy plate of steamed basmati rice accompanied by four different authentic Sri Lankan vegetable curries, tempered red lentils, seeni sambol, and papadum.",
      price: 6.99,
      originalPrice: 6.99,
      isOffer: true,
      offerPrice: 4.99,
      discountPercentage: 28,
      ingredients: ["Basmati Rice", "Dhal Curry", "Aubergine Moju", "Pol Sambol", "Potato Curry", "Papadum"],
      allergens: [],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "/images/rice-4-veg-curry.jpg" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: "Rice & Fish Curry",
      slug: "rice-fish-curry",
      categoryId: catMap["seafood"],
      shortDescription: "Steamed basmati rice served with authentic Sri Lankan fish curry and side curries.",
      description: "Fragrant steamed basmati rice served with a rich, tangy, and spicy traditional Sri Lankan fish curry cooked in coconut milk, paired with dhal curry, seeni sambol, and papadum.",
      price: 6.99,
      originalPrice: 6.99,
      isOffer: true,
      offerPrice: 4.99,
      discountPercentage: 28,
      ingredients: ["Basmati Rice", "Ceylon Fish Curry", "Red Lentil Dhal", "Seeni Sambol", "Papadum"],
      allergens: ["Fish"],
      isAvailable: true,
      isFeatured: true,
      images: [{ url: "/images/rice-fish-curry.jpg" }],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await prodColl.insertMany(productsData);
  console.log("✅ Dishes & Special Offers seeded.");

  console.log("✨ Seed completed successfully!");
  process.exit(0);
}

seed().catch((e) => {
  console.error("Seed error:", e);
  process.exit(1);
});
