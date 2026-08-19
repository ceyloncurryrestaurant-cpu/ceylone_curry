const mongoose = require('mongoose');

async function cleanAndSeedOffers() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ceylon_curry';
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  // 1. Reset isOffer = false on all products
  await db.collection('products').updateMany({}, { $set: { isOffer: false } });

  const crabImg = 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80';
  const kottuImg = 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=800&q=80';
  const lampraisImg = 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80';

  // 2. Set exact 3 offer products with consistent images & pricing
  // Product 1: Crab Curry
  const crab = await db.collection('products').findOne({ name: { $regex: 'Crab', $options: 'i' } });
  if (crab) {
    await db.collection('products').updateOne(
      { _id: crab._id },
      { $set: { isOffer: true, name: 'Jaffna Crab Curry Special', price: 18.50, offerPrice: 11.00, originalPrice: 18.50, discountPercentage: 41, images: [crabImg] } }
    );
  } else {
    await db.collection('products').insertOne({
      name: 'Jaffna Crab Curry Special',
      slug: 'jaffna-crab-curry',
      shortDescription: 'Whole mud crab in fiery Northern Jaffna roasted spice gravy.',
      description: 'A legendary Northern Sri Lanka specialty — whole mud crabs cracked and simmered in a bold jet-black roasted Jaffna spice curry with thick coconut milk.',
      price: 18.50,
      offerPrice: 11.00,
      originalPrice: 18.50,
      discountPercentage: 41,
      isOffer: true,
      isAvailable: true,
      isFeatured: true,
      images: [crabImg],
      createdAt: new Date()
    });
  }

  // Product 2: Cheese Kottu
  const kottu = await db.collection('products').findOne({ name: { $regex: 'Kottu', $options: 'i' } });
  if (kottu) {
    await db.collection('products').updateOne(
      { _id: kottu._id },
      { $set: { isOffer: true, name: 'Signature Cheese Kottu Roti', price: 14.50, offerPrice: 10.15, originalPrice: 14.50, discountPercentage: 30, images: [kottuImg] } }
    );
  }

  // Product 3: Lamprais
  const lamprais = await db.collection('products').findOne({ name: { $regex: 'Lamprais', $options: 'i' } });
  if (lamprais) {
    await db.collection('products').updateOne(
      { _id: lamprais._id },
      { $set: { isOffer: true, name: 'Ceylon Chicken Lamprais', price: 16.00, offerPrice: 12.80, originalPrice: 16.00, discountPercentage: 20, images: [lampraisImg] } }
    );
  }

  const offers = await db.collection('products').find({ isOffer: true }).toArray();
  console.log('MongoDB Seeded Cleanly! Exact Active Offer Products Count:', offers.length);
  offers.forEach((o, i) => console.log(` [${i+1}]`, o.name, '| £' + o.offerPrice, '(' + o.discountPercentage + '% OFF) | img:', typeof o.images[0] === 'string' ? o.images[0] : o.images[0].url));
  process.exit(0);
}

cleanAndSeedOffers().catch(err => {
  console.error(err);
  process.exit(1);
});
