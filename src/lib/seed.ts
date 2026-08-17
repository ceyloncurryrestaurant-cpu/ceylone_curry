import { connectToDatabase } from "./mongodb";
import Settings from "../models/Settings";
import Admin from "../models/Admin";
import Table from "../models/Table";
import Category from "../models/Category";
import Product from "../models/Product";
import { hashPassword } from "./auth";

export async function seedDatabase() {
  await connectToDatabase();
  console.log("🌱 Database connected for seeding...");

  // 1. Seed Settings (Centralized Single Source of Truth)
  const existingSettings = await Settings.findOne();
  if (!existingSettings) {
    await Settings.create({
      restaurantName: "Ceylon Curry",
      address: "44 Mayflower St, Plymouth PL1 1QX",
      mobileNumber: "01752 941504",
      whatsappNumber: "+441752941504",
      restaurantEmail: "info@ceyloncurry.co.uk",
      adminEmail: "admin@ceyloncurry.co.uk",
      openingHours: {
        monday: "12:00 PM - 10:00 PM",
        tuesday: "12:00 PM - 10:00 PM",
        wednesday: "12:00 PM - 10:00 PM",
        thursday: "12:00 PM - 10:00 PM",
        friday: "12:00 PM - 11:00 PM",
        saturday: "12:00 PM - 11:00 PM",
        sunday: "12:00 PM - 09:30 PM",
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
    });
    console.log("✅ Settings initialized.");
  } else {
    console.log("ℹ️ Settings already exist.");
  }

  // 2. Seed Admin User
  const adminEmail = "admin@ceyloncurry.co.uk";
  const existingAdmin = await Admin.findOne({ email: adminEmail });
  if (!existingAdmin) {
    const passwordHash = await hashPassword("admin123");
    await Admin.create({
      email: adminEmail,
      passwordHash,
      name: "Ceylon Curry Admin",
      role: "admin",
    });
    console.log("✅ Admin user created: admin@ceyloncurry.co.uk / admin123");
  } else {
    console.log("ℹ️ Admin user already exists.");
  }

  // 3. Seed 7 Restaurant Tables (PRD Requirement #55-56 & #130)
  const tableCount = await Table.countDocuments();
  if (tableCount === 0) {
    const defaultTables = [
      { tableNumber: 1, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 2, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 3, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 4, capacity: 2, type: "Couple", status: "Available" },
      { tableNumber: 5, capacity: 4, type: "Family", status: "Available" },
      { tableNumber: 6, capacity: 4, type: "Family", status: "Available" },
      { tableNumber: 7, capacity: 4, type: "Family", status: "Available" },
    ];
    await Table.insertMany(defaultTables);
    console.log("✅ All 7 Tables seeded successfully.");
  } else {
    console.log(`ℹ️ ${tableCount} Tables already exist.`);
  }

  // 4. Seed Categories
  const categoryCount = await Category.countDocuments();
  if (categoryCount === 0) {
    const categoriesData = [
      { name: "Starters", slug: "starters", description: "Crispy rolls, cutlets and traditional Sri Lankan street bites", displayOrder: 1 },
      { name: "Kottu", slug: "kottu", description: "Iconic Sri Lankan chopped flatbread tossed with vegetables, spices & curry", displayOrder: 2 },
      { name: "Rice & Biryani", slug: "rice-biryani", description: "Aromatic basmati rice, lamprais & spiced biryani bowls", displayOrder: 3 },
      { name: "Curries", slug: "curries", description: "Authentic roasted Ceylon spice curries cooked slowly with coconut milk", displayOrder: 4 },
      { name: "Seafood", slug: "seafood", description: "Fresh Jaffna crab curry, devilled prawns and fried fish", displayOrder: 5 },
      { name: "Vegetarian", slug: "vegetarian", description: "Plant-based curries, parathas, hoppers & dhal dishes", displayOrder: 6 },
      { name: "Desserts", slug: "desserts", description: "Traditional Watalappan, coconut pudding and sweets", displayOrder: 7 },
      { name: "Drinks", slug: "drinks", description: "Ceylon spiced tea, fresh mango lassi and refreshments", displayOrder: 8 },
    ];

    const insertedCategories = await Category.insertMany(categoriesData);
    console.log("✅ Categories seeded successfully.");

    // Map categories by slug for product association
    const catMap: Record<string, string> = {};
    insertedCategories.forEach((c) => {
      catMap[c.slug] = c._id.toString();
    });

    // 5. Seed Dishes & Offers
    const productsData = [
      {
        name: "Chicken Kottu",
        slug: "chicken-kottu",
        categoryId: catMap["kottu"],
        shortDescription: "Chopped roti stir-fried with tender chicken, egg, fresh vegetables and aromatic Ceylon curry spices.",
        description: "Our signature dish! Fresh paratha roti shredded on a hot griddle and tossed with spiced chicken, farm eggs, leeks, onions, and curry sauce.",
        price: 12.00,
        originalPrice: 12.00,
        isOffer: true,
        offerPrice: 9.99,
        discountPercentage: 17,
        ingredients: ["Chopped Roti", "Tender Chicken", "Eggs", "Onions", "Leeks", "Ceylon Spices"],
        allergens: ["Gluten", "Eggs"],
        isAvailable: true,
        isFeatured: true,
        images: [
          { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80" },
        ],
      },
      {
        name: "Devilled Prawns",
        slug: "devilled-prawns",
        categoryId: catMap["seafood"],
        shortDescription: "Juicy king prawns sauteed with capsicum, tomatoes, and spicy sweet chili Ceylon sauce.",
        description: "Fresh tiger prawns fried and tossed in a fiery, sweet-and-sour Sri Lankan devilled glaze with crunchy peppers and onions.",
        price: 14.50,
        originalPrice: 16.50,
        isOffer: true,
        offerPrice: 12.99,
        discountPercentage: 21,
        ingredients: ["King Prawns", "Bell Peppers", "Onions", "Chili Glaze", "Garlic", "Ginger"],
        allergens: ["Crustaceans", "Soy"],
        isAvailable: true,
        isFeatured: true,
        images: [
          { url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80" },
        ],
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
        images: [
          { url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80" },
        ],
      },
      {
        name: "Ceylon Chicken Lamprais",
        slug: "ceylon-chicken-lamprais",
        categoryId: catMap["rice-biryani"],
        shortDescription: "Dutch Burgher delicacy: Ghee rice, spiced chicken curry, aubergine moju, and fried egg wrapped in banana leaf.",
        description: "Authentic Ceylon Lamprais baked inside a fragrant banana leaf parcel, sealing in rich aromas of ghee rice, frikkadels, chicken curry, and sweet aubergine.",
        price: 15.00,
        originalPrice: 18.00,
        isOffer: true,
        offerPrice: 13.50,
        discountPercentage: 25,
        ingredients: ["Basmati Rice", "Chicken Curry", "Aubergine Moju", "Seeni Sambol", "Boiled Egg"],
        allergens: ["Eggs", "Mustard"],
        isAvailable: true,
        isFeatured: true,
        images: [
          { url: "https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=800&q=80" },
        ],
      },
      {
        name: "Mutton Rolls (3 Pcs)",
        slug: "mutton-rolls",
        categoryId: catMap["starters"],
        shortDescription: "Crispy breaded short-crust rolls filled with spiced minced mutton and potato.",
        description: "Classic Sri Lankan street food starter. Crispy golden rolls stuffed with seasoned minced mutton, braised potatoes, and curry leaves.",
        price: 6.50,
        originalPrice: 6.50,
        isOffer: false,
        ingredients: ["Minced Mutton", "Potatoes", "Curry Leaves", "Breadcrumbs"],
        allergens: ["Gluten"],
        isAvailable: true,
        isFeatured: false,
        images: [
          { url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" },
        ],
      },
      {
        name: "Sri Lankan Dhal Curry",
        slug: "sri-lankan-dhal-curry",
        categoryId: catMap["vegetarian"],
        shortDescription: "Creamy red lentils tempered with mustard seeds, curry leaves, garlic, and coconut milk.",
        description: "Essential Ceylon staple curry. Red split lentils cooked until smooth, tempered in coconut oil with fresh curry leaves, turmeric, and garlic.",
        price: 7.99,
        originalPrice: 7.99,
        isOffer: false,
        ingredients: ["Red Lentils", "Coconut Milk", "Mustard Seeds", "Turmeric", "Curry Leaves"],
        allergens: ["Mustard"],
        isAvailable: true,
        isFeatured: false,
        images: [
          { url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80" },
        ],
      },
      {
        name: "Watalappan",
        slug: "watalappan",
        categoryId: catMap["desserts"],
        shortDescription: "Traditional steamed coconut jaggery custard pudding spiced with cardamom and toasted cashews.",
        description: "Classic Sri Lankan royal dessert made with thick kitul jaggery syrup, coconut cream, eggs, nutmeg, cardamom, and roasted cashew nuts.",
        price: 5.50,
        originalPrice: 5.50,
        isOffer: false,
        ingredients: ["Kitul Jaggery", "Coconut Milk", "Eggs", "Cardamom", "Cashews"],
        allergens: ["Eggs", "Nuts"],
        isAvailable: true,
        isFeatured: false,
        images: [
          { url: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80" },
        ],
      },
    ];

    await Product.insertMany(productsData);
    console.log("✅ Dishes & Special Offers seeded successfully.");
  } else {
    console.log(`ℹ️ ${categoryCount} Categories already exist.`);
  }

  console.log("✨ Seed database completed successfully!");
}
