import type { Hotspot } from "@/data/types";

export type ItineraryDay = { title: string; body: string };

// Generic day-by-day template personalized with each hotspot's own real data
// (species, habitat, boating, ideal duration) — not a researched, park-specific
// plan (no zone/gate names), so it stays honest about what it actually knows.
export function buildItinerary(hotspot: Hotspot, boating: boolean): ItineraryDay[] {
  const topMammal = hotspot.mainSpecies[0];
  const topBird = hotspot.birdSpecies[0];
  const firstNumber = parseInt(hotspot.idealDuration, 10) || 2;
  const dayCount = firstNumber <= 2 ? 2 : 3;

  const days: ItineraryDay[] = [
    {
      title: "Day 1",
      body: "Arrive and settle in. If time allows, use the evening for a first safari or walk to get oriented" + (topMammal ? ", keeping an eye out for " + topMammal.toLowerCase() + "." : "."),
    },
    {
      title: "Day 2",
      body: "A full day exploring " + hotspot.habitat.toLowerCase() + " with morning and afternoon safari or birding sessions" + (topBird ? ", watching for " + topBird.toLowerCase() : "") + (boating ? ", plus a boat ride through the core area." : "."),
    },
  ];

  if (dayCount === 3) {
    days.push({
      title: "Day 3",
      body: (boating ? "A second boat ride or a walk to a nearby viewpoint" : "A final safari session or a walk to a nearby viewpoint") + ", then a relaxed departure.",
    });
  }

  return days;
}
