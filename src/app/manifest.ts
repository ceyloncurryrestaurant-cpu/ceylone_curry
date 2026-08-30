import { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.title,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#071B5C",
    theme_color: "#071B5C",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/screenshot-desktop.png",
        sizes: "1280x800",
        type: "image/png",
        form_factor: "wide",
        label: "Ceylon Curry Desktop View",
      },
      {
        src: "/screenshot-mobile.png",
        sizes: "390x800",
        type: "image/png",
        form_factor: "narrow",
        label: "Ceylon Curry Mobile View",
      },
    ],
  } as any;
}

