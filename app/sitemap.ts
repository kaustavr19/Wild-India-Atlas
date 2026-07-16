import type { MetadataRoute } from "next";
import { hotspots } from "@/data/hotspots";
import { species } from "@/data/species";
import { getExtendedSpecies } from "@/lib/extendedSpecies";

const baseUrl = "https://wild-india-atlas-mu.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const core = ["", "/map", "/hotspots", "/species", "/seasonal-planner", "/field-journal", "/data-sources"].map((path) => ({ url: `${baseUrl}${path}`, lastModified: now, changeFrequency: "weekly" as const, priority: path === "" ? 1 : 0.8 }));
  const placeRoutes = hotspots.map((item) => ({ url: `${baseUrl}/hotspots/${item.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 }));
  const speciesRoutes = [...species.map((item) => item.slug), ...getExtendedSpecies().map((item) => item.slug)].map((slug) => ({ url: `${baseUrl}/species/${slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 }));
  return [...core, ...placeRoutes, ...speciesRoutes];
}
