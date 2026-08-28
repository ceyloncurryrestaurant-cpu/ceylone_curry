import React from "react";
import type { Metadata } from "next";
import { ProductDetailPageClient } from "@/components/pages/ProductDetailPageClient";
import { BreadcrumbJsonLd, MenuItemJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG, getFullUrl } from "@/lib/seo";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

async function getProduct(id: string) {
  if (id === "default-offer") {
    return {
      _id: "default-offer",
      name: "Jaffna Black Roasted Lamb Curry & Kottu Combo",
      description:
        "Tender lamb leg slow-cooked for 6 hours in dark-roasted cumin, coriander, black pepper, and toasted coconut paste, served with iron-griddled Kottu roti.",
      shortDescription:
        "Chef's daily special: Slow-cooked black roasted lamb curry paired with fresh iron-griddled Kottu roti.",
      price: 18.9,
      offerPrice: 14.9,
      isOffer: true,
      isAvailable: true,
      spiceLevel: "Hot",
      ingredients: ["Tender Lamb Leg", "Dark Roasted Coriander", "Black Pepper", "Toasted Coconut", "Godamba Roti"],
      allergens: ["Gluten"],
      images: [
        { url: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=1200&q=80" },
      ],
    };
  }

  try {
    const conn = await connectToDatabase();
    if (conn) {
      const dbProduct = await Product.findById(id).populate("categoryId").lean();
      if (dbProduct) {
        return JSON.parse(JSON.stringify(dbProduct));
      }
    }
  } catch (err) {
    console.warn("⚠️ Failed to fetch product for SSR metadata:", err);
  }

  return null;
}

export async function generateMetadata({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const product = await getProduct(resolvedParams.id);

  if (!product) {
    return {
      title: "Dish Details | Ceylon Curry Plymouth",
      description: "Authentic Sri Lankan dish details at Ceylon Curry Plymouth.",
    };
  }

  const title = `${product.name} | Ceylon Curry Plymouth`;
  const description =
    product.shortDescription ||
    product.description ||
    `Enjoy ${product.name} prepared with authentic Sri Lankan spices at Ceylon Curry Plymouth.`;
  const imageUrl =
    product.images && product.images.length > 0
      ? product.images[0].url
      : getFullUrl("/shop.jpeg");
  const canonicalUrl = getFullUrl(`/menu/${resolvedParams.id}`);

  return {
    title,
    description,
    keywords: [
      product.name,
      "Ceylon Curry",
      "Sri Lankan Food Plymouth",
      product.categoryId?.name || "Curry Dish",
      ...(product.ingredients || []),
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: imageUrl.includes("shop.jpeg") ? 1254 : 1200,
          height: imageUrl.includes("shop.jpeg") ? 1254 : 630,
          alt: `${product.name} - Ceylon Curry Plymouth`,
        },
      ],
      locale: "en_GB",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const resolvedParams = await Promise.resolve(params);
  const product = await getProduct(resolvedParams.id);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Menu", item: "/menu" },
          { name: product?.name || "Dish Detail", item: `/menu/${resolvedParams.id}` },
        ]}
      />
      {product && (
        <MenuItemJsonLd
          name={product.name}
          description={product.description || product.shortDescription || ""}
          image={product.images?.[0]?.url}
          price={product.isOffer && product.offerPrice ? product.offerPrice : product.price}
          category={product.categoryId?.name}
          isAvailable={product.isAvailable !== false}
        />
      )}
      <ProductDetailPageClient productId={resolvedParams.id} initialProduct={product} />
    </>
  );
}
