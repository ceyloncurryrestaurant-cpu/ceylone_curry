import React from "react";
import type { Metadata } from "next";
import { ReservePageClient } from "@/components/pages/ReservePageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Book a Table — Online Table Reservation | Ceylon Curry Plymouth",
  description:
    "Reserve your dining table online at Ceylon Curry Plymouth, 44 Mayflower St. Pick your date, time, party size, and seating experience.",
  keywords: [
    "Book Table Ceylon Curry",
    "Table Reservation Plymouth",
    "Sri Lankan Restaurant Booking Plymouth",
    "Ceylon Curry Online Booking",
  ],
  alternates: {
    canonical: "/reserve",
  },
  openGraph: {
    title: "Book a Table | Ceylon Curry Plymouth",
    description: "Select date, time, and table seating options for an authentic Sri Lankan dining experience.",
    url: `${SITE_CONFIG.url}/reserve`,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/logo.png", width: 1200, height: 630, alt: "Reserve a Table at Ceylon Curry Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function ReservePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Reserve", item: "/reserve" },
        ]}
      />
      <ReservePageClient />
    </>
  );
}
