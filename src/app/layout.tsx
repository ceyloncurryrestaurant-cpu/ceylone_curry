import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/seo";
import { RestaurantJsonLd } from "@/components/seo/JsonLd";

export const viewport: Viewport = {
  themeColor: "#071B5C",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: SITE_CONFIG.keywords,
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  applicationName: SITE_CONFIG.name,
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    images: [
      {
        url: "/shop.jpeg",
        width: 1254,
        height: 1254,
        alt: `${SITE_CONFIG.name} — Authentic Sri Lankan Cuisine in Plymouth`,
      },
    ],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: ["/shop.jpeg"],
    creator: "@ceyloncurry",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "CLprLedSKuTq5WNygZ-txpDVw49AWTmqAFrBd_SCMnk",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="CLprLedSKuTq5WNygZ-txpDVw49AWTmqAFrBd_SCMnk" />
        <RestaurantJsonLd />
      </head>
      <body className="antialiased bg-ceylon-volcanic text-ceylon-ivory">
        {/* Google Analytics 4 (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-S2BVY43G1D"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-S2BVY43G1D');
          `}
        </Script>
        <div className="grain-overlay" />
        {children}
      </body>
    </html>
  );
}

