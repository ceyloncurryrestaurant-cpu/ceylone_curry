import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceylon Curry — Authentic Sri Lankan Cuisine in Plymouth",
  description: "Experience authentic Sri Lankan curries, aromatic spices, and warm hospitality at Ceylon Curry, 44 Mayflower St, Plymouth.",
  keywords: ["Ceylon Curry", "Sri Lankan Restaurant Plymouth", "Authentic Ceylonese Flavours", "Table Reservation Plymouth", "WhatsApp Order Curry"],
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="antialiased bg-ceylon-volcanic text-ceylon-ivory">
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}
