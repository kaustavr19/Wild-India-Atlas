// Discovery script — finds candidate iNaturalist "Place" records for each of our 42 hotspots
// so a human can confirm the right one. Mirrors the eBird discovery pattern in
// scripts/find-ebird-hotspots.ts, but for iNaturalist (mammals/reptiles/amphibians in this
// phase — birds are already covered by eBird). No API key is required for this read-only
// endpoint.
//
// Usage: npm run find:inaturalist-places
//
// A "Place" is a real polygon boundary in iNaturalist, more accurate than a radius search —
// but not every park has one, and proximity/name-similarity alone doesn't prove a returned
// place actually IS the park, so nothing here is auto-selected into real app data. That
// decision (place match, or a manual radius fallback) happens in data/inaturalistPlaces.ts
// after a human reviews data/inaturalist-candidates.json.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { hotspots } from "../data/hotspots.ts";

const API_BASE = "https://api.inaturalist.org/v1";
const REQUEST_DELAY_MS = 1000; // iNaturalist asks API consumers to keep well under 1 req/sec
const MAX_CANDIDATES = 5;

// iNaturalist's /places/autocomplete response includes a numeric `place_type` code (e.g. the
// site's own UI resolves this to a label like "Park" or "Open Space" internally), but that
// resolution isn't part of the public API response, so we don't guess a label here — the raw
// code is surfaced as-is and a reviewer can cross-check on inaturalist.org/places/{id} if needed.
type INaturalistPlaceResult = {
  id: number;
  name: string;
  display_name: string;
  place_type?: number | null;
  admin_level?: number | null;
  bbox_area?: number | null;
};

type INaturalistAutocompleteResponse = {
  total_results: number;
  results: INaturalistPlaceResult[];
};

type Candidate = {
  placeId: number;
  name: string;
  displayName: string;
  placeType: number | null;
  adminLevel: number | null;
  bboxArea: number | null;
  matchedQuery: string;
};

type DiscoveryResult =
  | { method: "place-candidates"; candidates: Candidate[] }
  | { method: "no-place-match"; triedQueries: string[] };

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// A park's official name often carries a designation suffix ("National Park", "Tiger
// Reserve", ...) that iNaturalist's place names don't always repeat, and some of our names
// bundle two place names together ("Nagarhole / Kabini") or a parenthetical abbreviation
// ("Biligiri Rangaswamy Temple (BRT) Tiger Reserve"). Building a short list of reasonable
// variants means a bad first query doesn't produce a false "no match".
const DESIGNATION_SUFFIXES = [
  "National Park", "Tiger Reserve", "Wildlife Sanctuary", "Bird Sanctuary",
  "Marine Sanctuary", "Marine Wildlife Sanctuary", "Sanctuary", "Reserve", "Rookery", "Wetlands",
];

function stripDesignationSuffix(name: string): string | undefined {
  for (const suffix of DESIGNATION_SUFFIXES) {
    if (name.endsWith(" " + suffix)) return name.slice(0, -(suffix.length + 1)).trim();
  }
  return undefined;
}

function nameVariants(name: string): string[] {
  const variants = new Set<string>();
  variants.add(name);

  const noParenthetical = name.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  if (noParenthetical !== name) variants.add(noParenthetical);

  for (const base of [name, noParenthetical]) {
    if (base.includes("/")) {
      const first = base.split("/")[0].trim();
      if (first) variants.add(first);
    }
    const stripped = stripDesignationSuffix(base);
    if (stripped) variants.add(stripped);
  }

  return Array.from(variants);
}

async function autocompletePlaces(query: string): Promise<INaturalistPlaceResult[]> {
  const url = `${API_BASE}/places/autocomplete?q=${encodeURIComponent(query)}&per_page=${MAX_CANDIDATES}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "WildIndiaAtlas/1.0 (read-only discovery script, no key required)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const body = (await res.json()) as INaturalistAutocompleteResponse;
  return body.results ?? [];
}

async function main() {
  const resultsBySlug: Record<string, DiscoveryResult> = {};
  let singleCount = 0, multipleCount = 0, noMatchCount = 0;
  const singleSlugs: string[] = [];
  const noMatchSlugs: string[] = [];

  for (const hotspot of hotspots) {
    const queries = nameVariants(hotspot.name);
    const triedQueries: string[] = [];
    let found: { query: string; results: INaturalistPlaceResult[] } | undefined;

    for (const query of queries) {
      triedQueries.push(query);
      try {
        const results = await autocompletePlaces(query);
        await sleep(REQUEST_DELAY_MS);
        if (results.length > 0) { found = { query, results }; break; }
      } catch (err) {
        console.error(`  ! ${hotspot.slug}: request failed for "${query}" — ${(err as Error).message}`);
        await sleep(REQUEST_DELAY_MS);
      }
    }

    if (!found) {
      resultsBySlug[hotspot.slug] = { method: "no-place-match", triedQueries };
      noMatchCount++;
      noMatchSlugs.push(hotspot.slug);
      console.log(`${hotspot.slug}: no place match (tried: ${triedQueries.join(" | ")})`);
      continue;
    }

    const candidates: Candidate[] = found.results.slice(0, MAX_CANDIDATES).map(r => ({
      placeId: r.id,
      name: r.name,
      displayName: r.display_name,
      placeType: r.place_type ?? null,
      adminLevel: r.admin_level ?? null,
      bboxArea: r.bbox_area ?? null,
      matchedQuery: found!.query,
    }));

    resultsBySlug[hotspot.slug] = { method: "place-candidates", candidates };
    if (candidates.length === 1) { singleCount++; singleSlugs.push(hotspot.slug); }
    else multipleCount++;

    console.log(`${hotspot.slug}: ${candidates.length} candidate(s) via "${found.query}"`);
  }

  const outPath = path.join(process.cwd(), "data", "inaturalist-candidates.json");
  writeFileSync(outPath, JSON.stringify(resultsBySlug, null, 2) + "\n");

  console.log("\n=== Summary ===");
  console.log(`Parks with exactly 1 candidate:  ${singleCount}${singleSlugs.length ? " (" + singleSlugs.join(", ") + ")" : ""}`);
  console.log(`Parks with multiple candidates:  ${multipleCount}`);
  console.log(`Parks with no place match:       ${noMatchCount}${noMatchSlugs.length ? " (" + noMatchSlugs.join(", ") + ")" : ""}`);
  console.log(`\nWrote candidates to ${outPath}`);
  console.log("Review it and fill confirmed matches into data/inaturalistPlaces.ts. For no-match parks,");
  console.log("a manual radius fallback is a per-park decision, not something this script should make.");
}

main();
