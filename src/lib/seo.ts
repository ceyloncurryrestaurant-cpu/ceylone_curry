export const SITE_CONFIG = {
  name: "Ceylon Curry",
  shortName: "Ceylon Curry Plymouth",
  title: "Ceylon Curry — Authentic Sri Lankan Cuisine in Plymouth",
  description:
    "Experience authentic Sri Lankan curries, hand-roasted island spices, sizzling Kottu Roti, and Lamprais at Ceylon Curry, 44 Mayflower St, Plymouth PL1 1QX. Online table reservations & takeaway ordering.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.ceyloncurry.co.uk",
  domain: "www.ceyloncurry.co.uk",
  telephone: "+44 1752 941504",
  formattedPhone: "01752 941504",
  whatsappNumber: "+441752941504",
  address: {
    streetAddress: "44 Mayflower St",
    addressLocality: "Plymouth",
    postalCode: "PL1 1QX",
    addressCountry: "GB",
    region: "Devon",
  },
  geo: {
    latitude: 50.3736,
    longitude: -4.1425,
  },
  openingHours: "Mon-Sun: 10:00 - 22:00",
  priceRange: "££",
  servesCuisine: ["Sri Lankan", "South Asian", "Curry", "Kottu Roti", "Lamprais", "Asian Fusion"],
  keywords: [
    "Ceylon Curry",
    "Ceylon Curry Plymouth",
    "Sri Lankan Restaurant Plymouth",
    "Authentic Sri Lankan Food Plymouth",
    "Kottu Roti Plymouth",
    "Lamprais Plymouth",
    "Jaffna Black Lamb Curry",
    "Devilled Prawns Plymouth",
    "South Asian Restaurant Mayflower St",
    "Table Reservation Plymouth Curry",
    "WhatsApp Order Curry Plymouth",
    "Takeaway Delivery Plymouth",
  ],
  socialLinks: [
    "https://facebook.com",
    "https://instagram.com",
  ],
};

export function getFullUrl(path: string = ""): string {
  const baseUrl = SITE_CONFIG.url.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}
