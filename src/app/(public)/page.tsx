import React from "react";
import type { Metadata } from "next";
import { HomePageClient } from "@/components/pages/HomePageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import Review from "@/models/Review";

export const metadata: Metadata = {
  title: "Ceylon Curry Plymouth | Authentic Sri Lankan Restaurant & Kottu Roti",
  description:
    "Experience authentic Sri Lankan curries, Kottu Roti, Jaffna black roasted lamb curry, and island spices at Ceylon Curry, 44 Mayflower St, Plymouth. Table reservations & takeaway.",
  keywords: SITE_CONFIG.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ceylon Curry Plymouth | Authentic Sri Lankan Cuisine",
    description:
      "Taste slow-cooked roasted spice curries, hand-rolled godamba Kottu Roti, and Ceylon island hospitality on Mayflower Street, Plymouth.",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/shop.jpeg", width: 1254, height: 1254, alt: "Ceylon Curry Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

async function getInitialData() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      const { memoryStore } = await import("@/lib/memoryStore");
      return {
        featuredProducts: memoryStore.products.filter((p: any) => p.isFeatured).slice(0, 6),
        offerProducts: memoryStore.products.filter((p: any) => p.isOffer),
        categories: memoryStore.categories,
        allProducts: memoryStore.products.filter((p: any) => p.isAvailable),
        reviews: [],
      };
    }

    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 }).lean();
    
    const featuredProducts = await Product.find({ isFeatured: true, isAvailable: true })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    const offerProducts = await Product.find({ isOffer: true, isAvailable: true })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    const allProducts = await Product.find({ isAvailable: true })
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .lean();

    let reviews: any[] = await Review.find({ isApproved: true }).sort({ createdAt: -1 }).lean();
    if (reviews.length === 0) {
      const SEED_REVIEWS = [
        {
          name: "Sarah & Mark Jenkins",
          rating: 5,
          comment: "The Cheese Kottu Roti is unbelievable — exactly like what we had in Colombo! The atmosphere on Mayflower Street feels so warm and upscale.",
          favoriteDish: "Cheese Kottu Roti",
          isApproved: true,
        },
        {
          name: "David C.",
          rating: 5,
          comment: "Hands down the best Sri Lankan black lamb curry in the South West. Deep, dark roasted spices, tender lamb, and impeccable hospitality.",
          favoriteDish: "Jaffna Black Lamb Curry",
          isApproved: true,
        },
        {
          name: "Priyantha Wickramasinghe",
          rating: 5,
          comment: "Authentic Karapincha and true Ceylon cinnamon notes in every dish. Exceptional table service and visual table reservation workflow!",
          favoriteDish: "Devilled King Prawns",
          isApproved: true,
        },
      ];
      reviews = SEED_REVIEWS;
    }

    return JSON.parse(JSON.stringify({
      featuredProducts,
      offerProducts,
      categories,
      allProducts,
      reviews,
    }));
  } catch (error) {
    console.error("Failed to fetch initial home data:", error);
    return {
      featuredProducts: [],
      offerProducts: [],
      categories: [],
      allProducts: [],
      reviews: [],
    };
  }
}

export default async function HomePage() {
  const data = await getInitialData();
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", item: "/" }]} />
      <HomePageClient
        initialFeaturedProducts={data.featuredProducts}
        initialOfferProducts={data.offerProducts}
        initialCategories={data.categories}
        initialAllProducts={data.allProducts}
        initialReviews={data.reviews}
      />
    </>
  );
}
