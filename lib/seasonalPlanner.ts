import type { Hotspot, Region, Season, Species } from "../data/types.ts";
import { monthToSeason } from "../data/seasonalWisdom.ts";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
export type Month = (typeof MONTHS)[number];
export type RegionFilter = "All regions" | Region;
export type ExperienceFilter = "All experiences" | "Safari" | "Birding" | "Photography" | "Trekking" | "Offbeat";

export const SEASON_STORIES: Record<Season, { title: string; signal: string; fieldNote: string; biome: "forest" | "wetland" | "desert" | "alpine" }> = {
  Winter: { title: "Cold air, open horizons.", signal: "Migrants gather at wetlands while dry forests become easier to read.", fieldNote: "Pack for cold dawns and reserve popular safari gates early.", biome: "alpine" },
  Summer: { title: "Follow the last water.", signal: "Heat draws wildlife toward dependable waterholes and thins forest cover.", fieldNote: "Choose first light, carry more water than you expect, and retreat before midday heat.", biome: "desert" },
  Monsoon: { title: "The landscape takes the lead.", signal: "Rain wakes forests, amphibians and alpine flowers while many safari cores rest.", fieldNote: "Treat access as weather-dependent and confirm roads, permits and open zones locally.", biome: "wetland" },
  "Post-monsoon": { title: "The wild reopens in green.", signal: "Fresh tracks, full rivers and early migrants mark the return of the field season.", fieldNote: "Reopening dates can move with track conditions; verify before committing to travel.", biome: "forest" },
};

export function isMonth(value: string | null): value is Month {
  return Boolean(value && MONTHS.includes(value as Month));
}

export function recommendationsFor(hotspots: Hotspot[], month: Month, region: RegionFilter, experience: ExperienceFilter): Hotspot[] {
  return hotspots
    .filter((hotspot) => hotspot.bestMonths.includes(month))
    .filter((hotspot) => region === "All regions" || hotspot.region === region)
    .filter((hotspot) => experience === "All experiences" || hotspot.experienceTags.includes(experience))
    .sort((a, b) => {
      const aIndex = a.bestMonths.indexOf(month);
      const bIndex = b.bestMonths.indexOf(month);
      return aIndex - bIndex || a.difficulty.localeCompare(b.difficulty) || a.name.localeCompare(b.name);
    });
}

export function speciesForRecommendations(matches: Hotspot[], allSpecies: Species[], limit = 4): Species[] {
  const names = matches.flatMap((hotspot) => [...hotspot.mainSpecies, ...hotspot.birdSpecies]);
  const slugs = Array.from(new Set(names.map((name) => allSpecies.find((item) => item.commonName === name || (item.commonName === "Indian Leopard" && name === "Leopard"))?.slug).filter((slug): slug is string => Boolean(slug))));
  return slugs.slice(0, limit).map((slug) => allSpecies.find((item) => item.slug === slug)).filter((item): item is Species => Boolean(item));
}

export function seasonForMonth(month: Month): Season {
  return monthToSeason[month];
}
