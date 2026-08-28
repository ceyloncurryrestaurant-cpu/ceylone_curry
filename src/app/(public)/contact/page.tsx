import React from "react";
import type { Metadata } from "next";
import { ContactPageClient } from "@/components/pages/ContactPageClient";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_CONFIG } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us & Location | Ceylon Curry Plymouth",
  description:
    "Contact Ceylon Curry at 44 Mayflower St, Plymouth PL1 1QX. Call 01752 941504 or order via WhatsApp. Open 7 days a week from 10:00 AM to 10:00 PM.",
  keywords: [
    "Contact Ceylon Curry Plymouth",
    "Ceylon Curry Address Plymouth",
    "44 Mayflower St Plymouth",
    "Ceylon Curry Telephone",
    "WhatsApp Order Ceylon Curry",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact & Location | Ceylon Curry Plymouth",
    description: "Visit us at 44 Mayflower St, Plymouth. Reach us for table reservations, WhatsApp takeaway, or catering.",
    url: `${SITE_CONFIG.url}/contact`,
    siteName: SITE_CONFIG.name,
    images: [{ url: "/shop.jpeg", width: 1254, height: 1254, alt: "Contact Ceylon Curry Plymouth" }],
    locale: "en_GB",
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", item: "/" },
          { name: "Contact", item: "/contact" },
        ]}
      />
      <ContactPageClient />
    </>
  );
}
