import React from "react";
import type { Metadata } from "next";
import { CartPageClient } from "@/components/pages/CartPageClient";

export const metadata: Metadata = {
  title: "Shopping Cart | Ceylon Curry Plymouth",
  description: "View and manage your selected Sri Lankan food items before checkout.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
