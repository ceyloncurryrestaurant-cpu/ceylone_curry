import React from "react";
import type { Metadata } from "next";
import { HomePageClient } from "@/components/pages/HomePageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

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
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Ceylon Curry Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Home", item: "/" }]} />
      <HomePageClient />
    </>
  );
}
