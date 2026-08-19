import React from "react";
import { SITE_CONFIG, getFullUrl } from "@/lib/seo";

export function RestaurantJsonLd() {
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": getFullUrl(),
    name: SITE_CONFIG.name,
    alternateName: SITE_CONFIG.shortName,
    image: [
      getFullUrl("/logo.png"),
      "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
    ],
    url: getFullUrl(),
    telephone: SITE_CONFIG.telephone,
    priceRange: SITE_CONFIG.priceRange,
    servesCuisine: SITE_CONFIG.servesCuisine,
    menu: getFullUrl("/menu"),
    acceptsReservations: "True",
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "22:00",
      },
    ],
    sameAs: SITE_CONFIG.socialLinks,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; item: string }[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http") ? crumb.item : getFullUrl(crumb.item),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}

export function MenuItemJsonLd({
  name,
  description,
  image,
  price,
  category,
  isAvailable = true,
}: {
  name: string;
  description: string;
  image?: string;
  price: number;
  category?: string;
  isAvailable?: boolean;
}) {
  const menuItemSchema = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: name,
    description: description,
    image: image || getFullUrl("/logo.png"),
    offers: {
      "@type": "Offer",
      price: price.toFixed(2),
      priceCurrency: "GBP",
      availability: isAvailable
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    suitableForDiet: "https://schema.org/HalalDiet",
    menuAddOn: category ? { "@type": "MenuItem", name: category } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(menuItemSchema) }}
    />
  );
}
