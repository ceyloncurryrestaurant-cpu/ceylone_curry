import React from "react";
import type { Metadata } from "next";
import { MenuPageClient } from "@/components/pages/MenuPageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sri Lankan Food Menu & Prices | Ceylon Curry Plymouth",
  description:
    "Explore Ceylon Curry's full menu of authentic Sri Lankan dishes: Kottu Roti, Jaffna Black Lamb Curry, Devilled King Prawns, Rice & Biryani, and appetizers in Plymouth.",
  keywords: [
    "Sri Lankan Menu Plymouth",
    "Ceylon Curry Menu",
    "Kottu Roti Plymouth Price",
    "Jaffna Lamb Curry Plymouth",
    "Curry Takeaway Plymouth Menu",
    "Sri Lankan Restaurant Food Prices",
  ],
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Sri Lankan Food Menu | Ceylon Curry Plymouth",
    description: "View our full catalog of authentic Sri Lankan curries, Kottu Roti, and traditional spices.",
    url: `${SITE_CONFIG.url}/menu`,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Ceylon Curry Menu Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function MenuPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Menu", item: "/menu" },
        ]}
      />
      <MenuPageClient />
    </>
  );
}
