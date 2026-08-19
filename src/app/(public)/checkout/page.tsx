import React from "react";
import type { Metadata } from "next";
import { CheckoutPageClient } from "@/components/pages/CheckoutPageClient";

export const metadata: Metadata = {
  title: "Checkout Order | Ceylon Curry Plymouth",
  description: "Complete your online takeaway order via direct WhatsApp dispatch.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
