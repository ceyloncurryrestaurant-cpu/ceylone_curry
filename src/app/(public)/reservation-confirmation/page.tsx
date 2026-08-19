import React from "react";
import type { Metadata } from "next";
import { ReservationConfirmationClient } from "@/components/pages/ReservationConfirmationClient";

export const metadata: Metadata = {
  title: "Reservation Confirmation | Ceylon Curry Plymouth",
  description: "Your dining table reservation confirmation at Ceylon Curry Plymouth.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ReservationConfirmationPage() {
  return <ReservationConfirmationClient />;
}
