import React from "react";
import type { Metadata } from "next";
import { OffersPageClient } from "@/components/pages/OffersPageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Special Offers & Curry Deals Plymouth | Ceylon Curry",
  description:
    "Discover daily promotional offers, chef's specials, and curry meal deals at Ceylon Curry Plymouth. Save on authentic Sri Lankan Kottu Roti and curries.",
  keywords: [
    "Ceylon Curry Offers",
    "Sri Lankan Food Deals Plymouth",
    "Curry Discounts Plymouth",
    "Special Meal Deals Mayflower St",
  ],
  alternates: {
    canonical: "/offers",
  },
  openGraph: {
    title: "Special Offers & Curry Deals | Ceylon Curry Plymouth",
    description: "Save on signature Sri Lankan curries, Kottu Roti, and chef's daily specials in Plymouth.",
    url: `${SITE_CONFIG.url}/offers`,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Special Offers at Ceylon Curry Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function OffersPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Offers", item: "/offers" },
        ]}
      />
      <OffersPageClient />
    </>
  );
}
