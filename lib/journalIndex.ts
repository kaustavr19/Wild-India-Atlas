import "server-only";

import { ecosystem } from "@/data/ecosystems";
import { hotspots } from "@/data/hotspots";
import { species } from "@/data/species";
import { getExtendedSpecies } from "@/lib/extendedSpecies";
import { hotspotsForSpecies } from "@/lib/speciesLinks";
import type { JournalIndex } from "@/lib/journalIndexTypes";

let cached: JournalIndex | undefined;

export function getJournalIndex(): JournalIndex {
  if (cached) return cached;

  const index: JournalIndex = {};

  for (const hotspot of hotspots) {
    index[`hotspot:${hotspot.slug}`] = {
      kind: "hotspot",
      title: hotspot.name,
      subtitle: `${hotspot.state} · ${hotspot.region}`,
      meta: `${ecosystem[hotspot.slug] ?? hotspot.type} · Best ${hotspot.bestMonths.slice(0, 4).join(", ")}`,
      category: hotspot.type,
      href: `/hotspots/${hotspot.slug}`,
      mapHref: `/map?place=${hotspot.slug}`,
      trailDetail: `${hotspot.state} · ${hotspot.habitat}`,
      nextHref: `/map?place=${hotspot.slug}`,
      nextLabel: "Return to this place on the map",
    };
  }

  for (const item of species) {
    const firstPlace = hotspotsForSpecies(item, hotspots)[0];
    index[`species:${item.slug}`] = {
      kind: "flagship-species",
      title: item.commonName,
      subtitle: item.scientificName,
      meta: `${item.category} · ${item.difficultyOfSighting} sighting`,
      category: item.category,
      href: `/species/${item.slug}`,
      mapHref: `/species/${item.slug}#range`,
      trailDetail: `${item.category} · ${item.difficultyOfSighting} sighting`,
      nextHref: firstPlace ? `/map?place=${firstPlace.slug}` : "/hotspots",
      nextLabel: firstPlace ? `Follow it to ${firstPlace.name}` : "Find a landscape to explore",
    };
  }

  for (const item of getExtendedSpecies()) {
    const firstPlace = item.confirmedAt[0];
    index[`species:${item.slug}`] = {
      kind: "extended-species",
      title: item.commonName,
      subtitle: item.scientificName,
      meta: `${item.iconicGroup} · ${item.source} record`,
      category: item.iconicGroup,
      href: `/species/${item.slug}`,
      mapHref: firstPlace ? `/hotspots/${firstPlace.slug}` : "/species",
      trailDetail: `${item.iconicGroup} · confirmed at ${item.confirmedAt.length} place${item.confirmedAt.length === 1 ? "" : "s"}`,
      nextHref: firstPlace ? `/hotspots/${firstPlace.slug}` : "/hotspots",
      nextLabel: firstPlace ? `Explore ${firstPlace.hotspotName}` : "Find a landscape to explore",
      photoUrl: item.photoUrl,
    };
  }

  cached = index;
  return index;
}
