import { MetadataRoute } from "next";
import { getFullUrl } from "@/lib/seo";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getFullUrl();
  const currentDate = new Date();

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: getFullUrl("/menu"),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: getFullUrl("/reserve"),
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: getFullUrl("/about"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: getFullUrl("/contact"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: getFullUrl("/offers"),
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: getFullUrl("/gallery"),
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Dynamically add menu product routes if database connection exists
  try {
    const conn = await connectToDatabase();
    if (conn) {
      const products = await Product.find({ isAvailable: true }).select("_id updatedAt").lean();
      products.forEach((prod: any) => {
        routes.push({
          url: getFullUrl(`/menu/${prod._id}`),
          lastModified: prod.updatedAt ? new Date(prod.updatedAt) : currentDate,
          changeFrequency: "weekly",
          priority: 0.75,
        });
      });
    }
  } catch (err) {
    console.warn("⚠️ Dynamic sitemap generation error:", err);
  }

  return routes;
}
