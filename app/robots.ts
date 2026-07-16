import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/field-kit" },
    sitemap: "https://wild-india-atlas-mu.vercel.app/sitemap.xml",
  };
}
