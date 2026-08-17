import React from "react";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "@/components/ui/Toast";
import { LogoIntroOverlay } from "@/components/LogoIntroOverlay";
import { SettingsProvider } from "@/context/SettingsContext";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <CartProvider>
        <LogoIntroOverlay />
        <div className="flex flex-col min-h-screen bg-ceylon-ivory text-ceylon-espresso">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Toaster />
      </CartProvider>
    </SettingsProvider>
  );
}
