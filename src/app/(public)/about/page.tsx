import React from "react";
import type { Metadata } from "next";
import { AboutPageClient } from "@/components/pages/AboutPageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us — Authentic Sri Lankan Culinary Story | Ceylon Curry Plymouth",
  description:
    "Learn about Ceylon Curry Plymouth, our heritage of hand-roasted island spices, traditional Kottu Roti iron-griddle cooking, and passion for authentic Sri Lankan hospitality.",
  keywords: [
    "About Ceylon Curry Plymouth",
    "Sri Lankan Restaurant Story",
    "Authentic Ceylonese Spice Heritage",
    "Mayflower Street Restaurant Plymouth",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Us — The Story of Ceylon Curry Plymouth",
    description: "Discover our passion for slow-cooked roasted spice curries and traditional Sri Lankan street food.",
    url: `${SITE_CONFIG.url}/about`,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/shop.jpeg", width: 1254, height: 1254, alt: "About Ceylon Curry Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "About", item: "/about" },
        ]}
      />
      <AboutPageClient />
    </>
  );
}
