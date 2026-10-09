const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

// Map categories and products to Cloudinary images from emsmspoh
const cloudinaryImages = [
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484164/a99yi3dzvbfivyqnxeoy.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484349/njxxxzxawgnqblr9tygf.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484408/zlegzb7jnak7jpu80iw2.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484447/r1vgnpqghqm6ubxpujoe.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484527/faz7pxsbw84z5vxfmg2a.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484806/ckwsj31yvy9n2awtqinx.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484839/xw7fv0exqbn5htcot02z.webp",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484880/mypytcqbf4tbr09wghgk.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484907/qdzq24gwdiupqqbembei.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484945/jmawd1c0s3un0uubvapq.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787484986/ocxvcmg7hqjj92lnz8lt.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485027/myf8wqmde5z0ucttbl6q.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485068/xqt5rcnve7rx4fcixo3c.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485074/madw0oiqpwvaslfomc4v.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485147/tdpv0ywmcrjtehln3ywn.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485178/f9joeinxscvlrqofivuw.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485224/vktm1129hjxea0kptq4r.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485267/pweippmr6nswnhuk4ugf.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485302/nbjj9mmro1gmqtfuycb9.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485341/ijlpnhysize3lkwskjmo.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485372/jwtxh89urxc3gfyyehvx.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485409/gxg2wk68iiyk4ovgvbcm.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485481/shbbx6p7zhalew0da1yy.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485494/y9z3j761dk3vymb04lda.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485549/vtkdehltdqrvbe2yvlrk.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485589/svc0vmzgpr7co1pvrobz.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485658/tachwrbnh5tab4fwkmcr.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485773/htwmn02zdfzsaguy6wls.png",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485806/utxyiiwajdefdnou4x1x.png",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787485944/msysjdydssvkielpce0h.png",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787486040/lktnepcaaym0brikosw4.png",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787486339/ozyue6nafadnqpm4ewgx.png",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787469079/mdcwmgjxfgv5jpfsmsj2.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468975/tyh4gjl43d5xkm1qsxis.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468946/l9a8cvycc0p59vdylrag.webp",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468913/x4gxeyrowwjrvlxf4puw.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468875/iu79dca672cqlv0ygdxy.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468841/k4kfoak16tcmzb16grru.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468803/tnhnrd78g88l06vn2ms9.png",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468753/r9iumxe38cfemp8lrqmd.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468407/n2kek6d6t031l1dt4dwq.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468357/iwpoxko9hgose0rtt6st.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468324/p33ob7xcrmr10rimg7jb.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468288/mc3w1ie4u2yx9atfr2nh.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468253/nwtoztvajfmsqweehmcc.webp",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787468194/b1g6gpvkfnf90ilhnfpl.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471392/xxpbcmdj2trotbqlz9ld.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471423/lo4i9mblma1ew7segcnt.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471457/djwwslc1buhdc4yuqtsk.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471487/svkagf7oq0mba745yxeh.webp",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471513/uarnqqy0dfmxll5iarwy.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471545/aoih68jfn8sv6rz5sonr.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471661/u624dkksqn36hrkjktv1.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471695/x8atrajmhles2rb182uj.webp",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471713/euhqyxlzfdj3squgnddz.webp",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471739/er5thtibvpm48v3cpo6u.jpg",
  "https://res.cloudinary.com/emsmspoh/image/upload/v1787471772/j7l1refqumyb0w0ysoho.jpg"
];

async function restore() {
  console.log("Connecting to MongoDB Atlas...");
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  const products = await db.collection("products").find({}).toArray();
  console.log(`Found ${products.length} products to update Cloudinary images for.`);

  let imgIdx = 0;
  for (const prod of products) {
    const imgUrl = cloudinaryImages[imgIdx % cloudinaryImages.length];
    const publicId = imgUrl.split("/").pop().split(".")[0];
    await db.collection("products").updateOne(
      { _id: prod._id },
      { $set: { images: [{ url: imgUrl, publicId }] } }
    );
    imgIdx++;
  }

  // Also update category images with Cloudinary URLs
  const categories = await db.collection("categories").find({}).toArray();
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const catImgUrl = cloudinaryImages[(i * 3) % cloudinaryImages.length];
    await db.collection("categories").updateOne(
      { _id: cat._id },
      { $set: { image: catImgUrl } }
    );
  }

  console.log("✅ Successfully restored Cloudinary food images for all products and categories!");
  process.exit(0);
}

restore().catch(err => {
  console.error("Error restoring images:", err);
  process.exit(1);
});
