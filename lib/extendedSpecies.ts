import ebirdSpeciesRaw from "@/data/ebirdSpecies.json";
import inaturalistSpeciesRaw from "@/data/inaturalistSpecies.json";
import type { EbirdSpeciesEntry } from "@/scripts/fetch-ebird-species";
import type { INaturalistSpeciesEntry } from "@/scripts/fetch-inaturalist-species";
import { getHotspotBySlug } from "@/data/hotspots";
import { species as flagshipSpecies } from "@/data/species";

const ebirdSpecies = ebirdSpeciesRaw as Record<string, EbirdSpeciesEntry[]>;
const inaturalistSpecies = inaturalistSpeciesRaw as Record<string, INaturalistSpeciesEntry[]>;

export type IconicGroup = "Bird" | "Mammal" | "Reptile" | "Amphibian";

export type ExtendedSpeciesConfirmation = { slug: string; hotspotName: string };

// A second, auto-derived species tier alongside the 21 hand-curated data/species.ts
// (Flagship) entries — grouped from the real per-hotspot eBird and iNaturalist records
// rather than independently sourced, so nothing here is fabricated: every field traces back
// to an actual source record, and a field is simply absent (not defaulted) when the source
// data doesn't have it. Birds (from eBird) never carry photoUrl/conservationStatus by design
// — that's not missing data, eBird's API doesn't return either.
export type ExtendedSpecies = {
  slug: string;
  scientificName: string;
  commonName: string;
  iconicGroup: IconicGroup;
  photoUrl?: string;
  conservationStatus?: string;
  source: "eBird" | "iNaturalist";
  confirmedAt: ExtendedSpeciesConfirmation[];
  lastPulled: string;
};

const ICONIC_TAXON_TO_GROUP: Record<INaturalistSpeciesEntry["iconicTaxon"], IconicGroup> = {
  Mammalia: "Mammal",
  Reptilia: "Reptile",
  Amphibia: "Amphibian",
};

// Flagship entries use full trinomial names for subspecies ("Panthera tigris tigris") while
// eBird/iNaturalist typically report the binomial species name ("Panthera tigris") — comparing
// on genus+species (not the full string) is what actually catches these as the same species,
// so a Flagship animal doesn't also get a redundant Extended entry.
function genusSpeciesKey(scientificName: string): string {
  return scientificName.trim().toLowerCase().split(/\s+/).slice(0, 2).join(" ");
}

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

type Builder = {
  scientificName: string;
  commonName: string;
  iconicGroup: IconicGroup;
  photoUrl?: string;
  conservationStatus?: string;
  source: "eBird" | "iNaturalist";
  confirmedAtSlugs: Set<string>;
  lastPulled: string;
};

function buildCanonical(): ExtendedSpecies[] {
  const bySciName = new Map<string, Builder>();

  for (const [hotspotSlug, entries] of Object.entries(ebirdSpecies)) {
    for (const entry of entries) {
      const sciName = entry.sciName.trim();
      if (!sciName) continue;
      const key = sciName.toLowerCase();
      let b = bySciName.get(key);
      if (!b) {
        b = { scientificName: sciName, commonName: entry.comName, iconicGroup: "Bird", source: "eBird", confirmedAtSlugs: new Set(), lastPulled: entry.lastPulled };
        bySciName.set(key, b);
      }
      b.confirmedAtSlugs.add(hotspotSlug);
      if (entry.lastPulled > b.lastPulled) b.lastPulled = entry.lastPulled;
    }
  }

  for (const [hotspotSlug, entries] of Object.entries(inaturalistSpecies)) {
    for (const entry of entries) {
      const sciName = entry.scientificName.trim();
      if (!sciName) continue;
      const key = sciName.toLowerCase();
      let b = bySciName.get(key);
      if (!b) {
        b = {
          scientificName: sciName,
          commonName: entry.commonName,
          iconicGroup: ICONIC_TAXON_TO_GROUP[entry.iconicTaxon],
          photoUrl: entry.photoUrl,
          conservationStatus: entry.conservationStatus,
          source: "iNaturalist",
          confirmedAtSlugs: new Set(),
          lastPulled: entry.lastPulled,
        };
        bySciName.set(key, b);
      } else {
        if (!b.photoUrl && entry.photoUrl) b.photoUrl = entry.photoUrl;
        if (!b.conservationStatus && entry.conservationStatus) b.conservationStatus = entry.conservationStatus;
      }
      b.confirmedAtSlugs.add(hotspotSlug);
      if (entry.lastPulled > b.lastPulled) b.lastPulled = entry.lastPulled;
    }
  }

  const flagshipGenusSpecies = new Set(flagshipSpecies.map(s => genusSpeciesKey(s.scientificName)));
  const usedSlugs = new Set(flagshipSpecies.map(s => s.slug)); // reserve Flagship routes too

  const result: ExtendedSpecies[] = [];
  for (const key of Array.from(bySciName.keys()).sort()) {
    const b = bySciName.get(key)!;
    if (flagshipGenusSpecies.has(genusSpeciesKey(b.scientificName))) continue; // has its own Flagship page already

    const confirmedAt = Array.from(b.confirmedAtSlugs)
      .map((slug): ExtendedSpeciesConfirmation | undefined => {
        const hotspot = getHotspotBySlug(slug);
        return hotspot ? { slug, hotspotName: hotspot.name } : undefined;
      })
      .filter((x): x is ExtendedSpeciesConfirmation => Boolean(x))
      .sort((a, c) => a.hotspotName.localeCompare(c.hotspotName));

    let slug = toSlug(b.commonName) || toSlug(b.scientificName);
    if (usedSlugs.has(slug)) {
      let suffix = 2;
      while (usedSlugs.has(`${slug}-${suffix}`)) suffix++;
      slug = `${slug}-${suffix}`;
    }
    usedSlugs.add(slug);

    result.push({
      slug,
      scientificName: b.scientificName,
      commonName: b.commonName,
      iconicGroup: b.iconicGroup,
      photoUrl: b.photoUrl,
      conservationStatus: b.conservationStatus,
      source: b.source,
      confirmedAt,
      lastPulled: b.lastPulled,
    });
  }

  return result;
}

let cached: ExtendedSpecies[] | undefined;

export function getExtendedSpecies(): ExtendedSpecies[] {
  if (!cached) cached = buildCanonical();
  return cached;
}

export function getExtendedSpeciesBySlug(slug: string): ExtendedSpecies | undefined {
  return getExtendedSpecies().find(s => s.slug === slug);
}
