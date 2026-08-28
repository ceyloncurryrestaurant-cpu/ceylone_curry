import React from "react";
import type { Metadata } from "next";
import { GalleryPageClient } from "@/components/pages/GalleryPageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Food & Restaurant Gallery | Ceylon Curry Plymouth",
  description:
    "View our photography gallery featuring authentic Sri Lankan curries, Kottu Roti, island spices, and restaurant ambiance at Ceylon Curry Plymouth.",
  keywords: [
    "Ceylon Curry Photos",
    "Sri Lankan Food Photography Plymouth",
    "Curry Gallery Plymouth",
    "Ceylon Curry Ambiance",
  ],
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "Food & Restaurant Gallery | Ceylon Curry Plymouth",
    description: "Take a visual journey through our authentic Ceylonese culinary creations and dining room.",
    url: `${SITE_CONFIG.url}/gallery`,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/shop.jpeg", width: 1254, height: 1254, alt: "Ceylon Curry Gallery Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function GalleryPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Gallery", item: "/gallery" },
        ]}
      />
      <GalleryPageClient />
    </>
  );
}
