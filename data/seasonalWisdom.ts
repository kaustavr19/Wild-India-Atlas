import type { Season } from "./types";

export const monthToSeason: Record<string, Season> = {
  Jan: "Winter", Feb: "Winter", Mar: "Summer", Apr: "Summer", May: "Summer", Jun: "Summer",
  Jul: "Monsoon", Aug: "Monsoon", Sep: "Monsoon", Oct: "Post-monsoon", Nov: "Winter", Dec: "Winter",
};

export type SeasonalWisdom = { bestFor: string; avoid: string; travelCaution: string };

// General, broadly-true seasonal patterns for Indian wildlife travel — not sourced to a
// specific park (see data/officialLinks.ts / accessPoints.ts for per-park verified facts).
// Exact closure dates and rules vary by state and reserve; treat "avoid" as a planning
// flag to double-check locally, not a fixed calendar.
export const seasonalWisdom: Record<Season, SeasonalWisdom> = {
  Winter: {
    bestFor: "Peak wildlife sightings, most tiger reserve safaris, Himalayan and wetland birding, comfortable trekking weather.",
    avoid: "Nothing closes broadly, but high-altitude Himalayan/alpine sites are often snowed in or inaccessible.",
    travelCaution: "Cold early-morning safaris, North Indian fog can delay flights and trains, and peak-season permits/lodges book out early.",
  },
  Summer: {
    bestFor: "Near-guaranteed tiger and predator sightings as water scarcity concentrates wildlife at waterholes — strong for photography.",
    avoid: "Coastal, plains, and desert parks get extremely hot by midday, making extended walks or open-vehicle safaris uncomfortable.",
    travelCaution: "Heat exhaustion risk on safaris — carry water, favor early starts, and check for forest-fire advisories in dry-deciduous reserves.",
  },
  Monsoon: {
    bestFor: "Monsoon greenery and alpine blooms, Western Ghats birding and amphibian activity, lush landscapes, and thinner crowds.",
    avoid: "Core zones of most tiger reserves close to tourists for the monsoon (rules and exact dates vary by state; buffer zones often stay open) — confirm before booking.",
    travelCaution: "Landslides and road closures in hill and Western Ghats regions, leeches on forest trails, slippery terrain — check permits and road status before travel.",
  },
  "Post-monsoon": {
    bestFor: "Parks reopening after the monsoon closure, lush post-rain landscapes, and early migratory bird arrivals.",
    avoid: "Some reserves reopen on a staggered schedule, so early in the month tracks can still be muddy or access limited — confirm reopening dates first.",
    travelCaution: "Residual monsoon showers and humidity early on, plus a post-reopening booking rush — plan ahead for permits and lodging.",
  },
};
