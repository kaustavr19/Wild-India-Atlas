// Fetches observed mammal/reptile/amphibian species for each confirmed iNaturalist place
// mapping and writes data/inaturalistSpecies.json. Manually-run CLI script, not a build hook.
//
// Usage: npm run fetch:inaturalist
// No API key required for this read-only endpoint.
// Requires confirmed entries in data/inaturalistPlaces.ts (run find:inaturalist-places +
// manual review first) — slugs without a confirmed mapping are skipped, not errored on.
//
// Birds stay on eBird (data/ebirdSpecies.json); flora and other taxa are future phases.

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { inaturalistPlaces } from "../data/inaturalistPlaces.ts";
import { hotspots } from "../data/hotspots.ts";

const API_BASE = "https://api.inaturalist.org/v1";
const REQUEST_DELAY_MS = 1000; // iNaturalist asks API consumers to keep well under 1 req/sec
const PER_PAGE = 200;
const ICONIC_TAXA = ["Mammalia", "Reptilia", "Amphibia"] as const;
type IconicTaxon = (typeof ICONIC_TAXA)[number];

type INaturalistSpeciesCountResult = {
  count: number;
  taxon: {
    id: number;
    name: string;
    preferred_common_name?: string;
    iconic_taxon_name?: string;
    default_photo?: { medium_url?: string } | null;
    conservation_status?: { status_name?: string } | null;
  };
};

type INaturalistSpeciesCountsResponse = {
  total_results: number;
  page: number;
  per_page: number;
  results: INaturalistSpeciesCountResult[];
};

// Unlike eBird's obsCount (a single most-recent-checklist snapshot, deliberately downplayed
// in the UI — see components/EbirdChecklist.tsx), iNaturalist's species_counts endpoint gives
// a real cumulative observation count per species at a place. That's a genuinely stronger
// signal and is fine to present as an actual relative-frequency indicator later — the two
// counts measure different things and should never be conflated if shown near each other.
export type INaturalistSpeciesEntry = {
  taxonId: number;
  commonName: string;
  scientificName: string;
  iconicTaxon: IconicTaxon;
  observationCount: number;
  photoUrl?: string;
  conservationStatus?: string;
  lastPulled: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function iconicTaxaQuery(): string {
  return ICONIC_TAXA.map(t => `iconic_taxa[]=${t}`).join("&");
}

async function fetchSpeciesCountsPage(locationParams: string, page: number): Promise<INaturalistSpeciesCountsResponse> {
  const url = `${API_BASE}/observations/species_counts?${locationParams}&${iconicTaxaQuery()}&per_page=${PER_PAGE}&page=${page}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "WildIndiaAtlas/1.0 (read-only species fetch script, no key required)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as INaturalistSpeciesCountsResponse;
}

async function fetchAllSpeciesCounts(locationParams: string): Promise<INaturalistSpeciesCountResult[]> {
  const all: INaturalistSpeciesCountResult[] = [];
  let page = 1;
  while (true) {
    const body = await fetchSpeciesCountsPage(locationParams, page);
    all.push(...body.results);
    await sleep(REQUEST_DELAY_MS);
    if (all.length >= body.total_results || body.results.length === 0) break;
    page++;
  }
  return all;
}

function isKnownIconicTaxon(name: string | undefined): name is IconicTaxon {
  return !!name && (ICONIC_TAXA as readonly string[]).includes(name);
}

async function main() {
  const validSlugs = new Set(hotspots.map(h => h.slug));
  const confirmedSlugs = Object.keys(inaturalistPlaces);

  if (confirmedSlugs.length === 0) {
    console.log("No confirmed iNaturalist mappings in data/inaturalistPlaces.ts yet — nothing to fetch.");
    console.log("Run `npm run find:inaturalist-places`, review data/inaturalist-candidates.json, and confirm entries first.");
    return;
  }

  const outPath = path.join(process.cwd(), "data", "inaturalistSpecies.json");
  const existing: Record<string, INaturalistSpeciesEntry[]> = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : {};

  const skipped: string[] = [];
  let emptyCount = 0;
  for (const slug of confirmedSlugs) {
    if (!validSlugs.has(slug)) { skipped.push(slug); continue; }
    const mapping = inaturalistPlaces[slug];
    const locationParams = mapping.method === "place"
      ? `place_id=${mapping.placeId}`
      : `lat=${mapping.lat}&lng=${mapping.lng}&radius=${mapping.radiusKm}`;
    const label = mapping.method === "place" ? `${mapping.placeName} / place ${mapping.placeId}` : `radius ${mapping.radiusKm}km @ ${mapping.lat},${mapping.lng}`;
    console.log(`Fetching ${slug} (${label})...`);
    try {
      const results = await fetchAllSpeciesCounts(locationParams);
      const lastPulled = new Date().toISOString().slice(0, 10);
      existing[slug] = results
        .filter(r => isKnownIconicTaxon(r.taxon.iconic_taxon_name))
        .map((r): INaturalistSpeciesEntry => ({
          taxonId: r.taxon.id,
          commonName: r.taxon.preferred_common_name ?? r.taxon.name,
          scientificName: r.taxon.name,
          iconicTaxon: r.taxon.iconic_taxon_name as IconicTaxon,
          observationCount: r.count,
          ...(r.taxon.default_photo?.medium_url ? { photoUrl: r.taxon.default_photo.medium_url } : {}),
          ...(r.taxon.conservation_status?.status_name ? { conservationStatus: r.taxon.conservation_status.status_name } : {}),
          lastPulled,
        }));
      if (existing[slug].length === 0) emptyCount++;
      console.log(`  -> ${existing[slug].length} species`);
    } catch (err) {
      console.error(`  ! ${slug}: ${(err as Error).message}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  if (skipped.length) {
    console.log(`\nSkipped (not a real hotspot slug in data/hotspots.ts): ${skipped.join(", ")}`);
  }

  writeFileSync(outPath, JSON.stringify(existing, null, 2) + "\n");

  const fetchedSlugs = confirmedSlugs.filter(s => validSlugs.has(s));
  const allEntries = fetchedSlugs.flatMap(s => existing[s] ?? []);
  const byTaxon = Object.fromEntries(ICONIC_TAXA.map(t => [t, allEntries.filter(e => e.iconicTaxon === t).length]));
  console.log("\n=== Summary ===");
  console.log(`Places fetched: ${fetchedSlugs.length}`);
  console.log(`Places with zero species returned: ${emptyCount}`);
  console.log(`Total species records: ${allEntries.length}`);
  console.log(`By taxon: ${Object.entries(byTaxon).map(([k, v]) => `${k} ${v}`).join(", ")}`);
  console.log(`\nWrote species data for ${Object.keys(existing).length} hotspot(s) to ${outPath}`);
}

main();
