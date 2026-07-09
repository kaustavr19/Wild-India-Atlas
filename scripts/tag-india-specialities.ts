// Classifies every canonical species (Flagship + Extended) for two real, separately-defined
// signals: whether it's endemic to India (per iNaturalist's establishment_means for a
// resolved India place_id) and whether it's editorially "iconic" (seeded true only for
// Flagship entries — never inferred from observation counts, see Part 2 below).
//
// Usage: npm run tag:specialities
// No API key required. Resumable: taxon-name resolution and endemic classification are each
// cached incrementally to data/india-specialities-*-cache.json — re-running skips species
// already resolved/classified, so an interrupted run doesn't restart from zero.
//
// Note on imports: this script duplicates lib/extendedSpecies.ts's merge logic with relative
// imports instead of importing that module directly. Plain `node --experimental-strip-types`
// (used by every script in this directory) can't resolve the "@/..." path aliases that
// lib/extendedSpecies.ts and its own imports use — those only resolve inside the Next.js
// bundler. This mirrors the same constraint that already shapes every other scripts/*.ts file.

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import ebirdSpeciesRaw from "../data/ebirdSpecies.json" with { type: "json" };
import inaturalistSpeciesRaw from "../data/inaturalistSpecies.json" with { type: "json" };
import { species as flagshipSpecies } from "../data/species.ts";
import type { EbirdSpeciesEntry } from "./fetch-ebird-species.ts";
import type { INaturalistSpeciesEntry } from "./fetch-inaturalist-species.ts";

const API_BASE = "https://api.inaturalist.org/v1";
const REQUEST_DELAY_MS = 1000; // iNaturalist asks API consumers to keep well under 1 req/sec
const DETAIL_BATCH_SIZE = 30; // /v1/taxa/{ids} accepts a comma-separated batch

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------------------
// Part 0: rebuild the canonical Extended species list (mirrors lib/extendedSpecies.ts).
// ---------------------------------------------------------------------------------------

const ebirdSpecies = ebirdSpeciesRaw as Record<string, EbirdSpeciesEntry[]>;
const inaturalistSpecies = inaturalistSpeciesRaw as Record<string, INaturalistSpeciesEntry[]>;

type IconicGroup = "Bird" | "Mammal" | "Reptile" | "Amphibian";
type CanonicalSpecies = {
  slug: string;
  scientificName: string;
  commonName: string;
  iconicGroup: IconicGroup;
  source: "eBird" | "iNaturalist";
  totalObservations: number; // summed obsCount/observationCount across confirming hotspots; 0 where the source record didn't report a count
};

const ICONIC_TAXON_TO_GROUP: Record<INaturalistSpeciesEntry["iconicTaxon"], IconicGroup> = {
  Mammalia: "Mammal",
  Reptilia: "Reptile",
  Amphibia: "Amphibian",
};

function genusSpeciesKey(scientificName: string): string {
  return scientificName.trim().toLowerCase().split(/\s+/).slice(0, 2).join(" ");
}

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

type Builder = { scientificName: string; commonName: string; iconicGroup: IconicGroup; source: "eBird" | "iNaturalist"; totalObservations: number };

function buildExtendedCanonical(): CanonicalSpecies[] {
  const bySciName = new Map<string, Builder>();

  for (const entries of Object.values(ebirdSpecies)) {
    for (const entry of entries) {
      const sciName = entry.sciName.trim();
      if (!sciName) continue;
      const key = sciName.toLowerCase();
      let b = bySciName.get(key);
      if (!b) { b = { scientificName: sciName, commonName: entry.comName, iconicGroup: "Bird", source: "eBird", totalObservations: 0 }; bySciName.set(key, b); }
      b.totalObservations += entry.obsCount ?? 0;
    }
  }

  for (const entries of Object.values(inaturalistSpecies)) {
    for (const entry of entries) {
      const sciName = entry.scientificName.trim();
      if (!sciName) continue;
      const key = sciName.toLowerCase();
      let b = bySciName.get(key);
      if (!b) { b = { scientificName: sciName, commonName: entry.commonName, iconicGroup: ICONIC_TAXON_TO_GROUP[entry.iconicTaxon], source: "iNaturalist", totalObservations: 0 }; bySciName.set(key, b); }
      b.totalObservations += entry.observationCount;
    }
  }

  const flagshipGenusSpecies = new Set(flagshipSpecies.map(s => genusSpeciesKey(s.scientificName)));
  const usedSlugs = new Set(flagshipSpecies.map(s => s.slug));

  const result: CanonicalSpecies[] = [];
  for (const key of Array.from(bySciName.keys()).sort()) {
    const b = bySciName.get(key)!;
    if (flagshipGenusSpecies.has(genusSpeciesKey(b.scientificName))) continue;
    let slug = toSlug(b.commonName) || toSlug(b.scientificName);
    if (usedSlugs.has(slug)) { let suffix = 2; while (usedSlugs.has(`${slug}-${suffix}`)) suffix++; slug = `${slug}-${suffix}`; }
    usedSlugs.add(slug);
    result.push({ slug, scientificName: b.scientificName, commonName: b.commonName, iconicGroup: b.iconicGroup, source: b.source, totalObservations: b.totalObservations });
  }
  return result;
}

// scientificName -> taxonId, straight from the raw iNaturalist source data (Extended fauna
// entries already carry one; reused directly per the phase brief rather than re-resolving).
function knownTaxonIdsFromSource(): Map<string, number> {
  const map = new Map<string, number>();
  for (const entries of Object.values(inaturalistSpecies)) {
    for (const entry of entries) {
      const key = entry.scientificName.trim().toLowerCase();
      if (!map.has(key)) map.set(key, entry.taxonId);
    }
  }
  return map;
}

// ---------------------------------------------------------------------------------------
// Part 1: resolve India's place_id at runtime (never hardcoded).
// ---------------------------------------------------------------------------------------

type PlaceAutocompleteResult = { id: number; name: string; admin_level: number | null };

async function resolveIndiaPlaceId(): Promise<number> {
  const url = `${API_BASE}/places/autocomplete?q=India`;
  const res = await fetch(url, { headers: { "User-Agent": "WildIndiaAtlas/1.0 (india specialities tagging script)" } });
  if (!res.ok) throw new Error(`places/autocomplete ${res.status} ${res.statusText}`);
  const body = (await res.json()) as { results: PlaceAutocompleteResult[] };
  const match = body.results.find(r => r.admin_level === 0 && r.name === "India");
  if (!match) throw new Error("Could not resolve a country-level (admin_level 0) place named India from iNaturalist.");
  console.log(`Resolved India -> place_id ${match.id} ("${match.name}")`);
  return match.id;
}

// ---------------------------------------------------------------------------------------
// Part 2: resolve a taxonId per scientific name that doesn't already have one (Flagship +
// eBird-sourced Extended birds). Cached incrementally in taxonCachePath.
// ---------------------------------------------------------------------------------------

type TaxonSearchResult = { id: number; name: string; rank: string };
type TaxonCacheEntry = { taxonId: number } | { unresolved: true; reason: "no-exact-match" | "ambiguous-match" };

async function resolveTaxonId(scientificName: string): Promise<TaxonCacheEntry & { candidates?: { id: number; name: string; rank: string }[] }> {
  const url = `${API_BASE}/taxa?q=${encodeURIComponent(scientificName)}&is_active=true`;
  const res = await fetch(url, { headers: { "User-Agent": "WildIndiaAtlas/1.0 (india specialities tagging script)" } });
  if (!res.ok) throw new Error(`taxa search ${res.status} ${res.statusText}`);
  const body = (await res.json()) as { results: TaxonSearchResult[] };
  const exact = body.results.filter(r => r.name.toLowerCase() === scientificName.toLowerCase());
  if (exact.length === 1) return { taxonId: exact[0].id };
  const pool = exact.length === 0 ? body.results : exact;
  return { unresolved: true, reason: exact.length === 0 ? "no-exact-match" : "ambiguous-match", candidates: pool.slice(0, 5).map(r => ({ id: r.id, name: r.name, rank: r.rank })) };
}

// ---------------------------------------------------------------------------------------
// Part 3: classify endemic status via /v1/taxa/{ids}?preferred_place_id=..., batched.
// ---------------------------------------------------------------------------------------

type TaxonDetail = { id: number; listed_taxa?: { taxon_id: number; establishment_means: string | null; place: { id: number } | null }[] };

async function fetchTaxonDetailsBatch(taxonIds: number[], indiaPlaceId: number): Promise<Map<number, TaxonDetail>> {
  const map = new Map<number, TaxonDetail>();
  const url = `${API_BASE}/taxa/${taxonIds.join(",")}?preferred_place_id=${indiaPlaceId}`;
  const res = await fetch(url, { headers: { "User-Agent": "WildIndiaAtlas/1.0 (india specialities tagging script)" } });
  if (!res.ok) throw new Error(`taxa detail ${res.status} ${res.statusText}`);
  const body = (await res.json()) as { results: TaxonDetail[] };
  for (const t of body.results) map.set(t.id, t);
  return map;
}

function classifyEndemic(detail: TaxonDetail | undefined, indiaPlaceId: number): "yes" | "no" | "unknown" {
  if (!detail) return "unknown";
  const listing = detail.listed_taxa?.find(l => l.place?.id === indiaPlaceId);
  if (!listing || !listing.establishment_means) return "unknown";
  return listing.establishment_means === "endemic" ? "yes" : "no";
}

// ---------------------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------------------

type EndemicProgressEntry = { endemic: "yes" | "no" | "unknown"; lastChecked: string };

function loadJson<T>(p: string, fallback: T): T {
  return existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as T) : fallback;
}

async function main() {
  const taxonCachePath = path.join(process.cwd(), "data", "india-specialities-taxon-cache.json");
  const endemicCachePath = path.join(process.cwd(), "data", "india-specialities-endemic-cache.json");
  const reviewPath = path.join(process.cwd(), "data", "india-specialities-taxon-review.json");
  const candidatesPath = path.join(process.cwd(), "data", "iconic-candidates.json");
  const outPath = path.join(process.cwd(), "data", "indiaSpecialities.ts");

  const indiaPlaceId = await resolveIndiaPlaceId();
  await sleep(REQUEST_DELAY_MS);

  const flagshipSciNames = new Set(flagshipSpecies.map(s => s.scientificName));
  const extended = buildExtendedCanonical();

  type SpeciesRow = { scientificName: string; iconic: boolean; iconicGroup?: IconicGroup; source?: "eBird" | "iNaturalist"; slug?: string; commonName?: string; totalObservations?: number };
  const allSpecies = new Map<string, SpeciesRow>();
  for (const s of flagshipSpecies) allSpecies.set(s.scientificName, { scientificName: s.scientificName, iconic: true });
  for (const s of extended) {
    if (!allSpecies.has(s.scientificName)) {
      allSpecies.set(s.scientificName, { scientificName: s.scientificName, iconic: false, iconicGroup: s.iconicGroup, source: s.source, slug: s.slug, commonName: s.commonName, totalObservations: s.totalObservations });
    }
  }
  console.log(`Total canonical species to classify: ${allSpecies.size} (${flagshipSciNames.size} Flagship, ${extended.length} Extended)`);

  // --- Part 2: resolve taxonIds ---
  const knownTaxonIds = knownTaxonIdsFromSource();
  const taxonCache: Record<string, TaxonCacheEntry> = loadJson(taxonCachePath, {});
  const review: { scientificName: string; reason: string; candidates: { id: number; name: string; rank: string }[] }[] = loadJson(reviewPath, []);
  const reviewedNames = new Set(review.map(r => r.scientificName));

  const needsResolution = Array.from(allSpecies.keys()).filter(name => {
    if (knownTaxonIds.has(name.toLowerCase())) return false; // already have one
    return !(name in taxonCache); // not already cached (resolved or unresolved)
  });
  console.log(`Resolving taxonId for ${needsResolution.length} species without a known one (from ${allSpecies.size - needsResolution.length - knownTaxonIds.size} already cached / known)...`);

  let resolvedCount = 0, unresolvedCount = 0;
  for (const name of needsResolution) {
    try {
      const result = await resolveTaxonId(name);
      if ("taxonId" in result) {
        taxonCache[name] = { taxonId: result.taxonId };
        resolvedCount++;
      } else {
        taxonCache[name] = { unresolved: true, reason: result.reason };
        unresolvedCount++;
        if (!reviewedNames.has(name)) {
          review.push({ scientificName: name, reason: result.reason, candidates: result.candidates ?? [] });
          reviewedNames.add(name);
        }
      }
    } catch (err) {
      console.error(`  ! taxa search failed for "${name}": ${(err as Error).message}`);
    }
    writeFileSync(taxonCachePath, JSON.stringify(taxonCache, null, 2) + "\n");
    writeFileSync(reviewPath, JSON.stringify(review, null, 2) + "\n");
    await sleep(REQUEST_DELAY_MS);
  }
  console.log(`Taxon resolution: ${resolvedCount} resolved, ${unresolvedCount} unresolved this run.`);

  // Final scientificName -> taxonId map (known-from-source wins, then resolved cache)
  const taxonIdBySciName = new Map<string, number>();
  for (const name of allSpecies.keys()) {
    const known = knownTaxonIds.get(name.toLowerCase());
    if (known !== undefined) { taxonIdBySciName.set(name, known); continue; }
    const cached = taxonCache[name];
    if (cached && "taxonId" in cached) taxonIdBySciName.set(name, cached.taxonId);
  }

  // --- Part 3: classify endemic status, batched, resumable ---
  const endemicCache: Record<string, EndemicProgressEntry> = loadJson(endemicCachePath, {});
  const toClassify = Array.from(taxonIdBySciName.keys()).filter(name => !(name in endemicCache));
  console.log(`Classifying endemic status for ${toClassify.length} species with a resolved taxonId (${Object.keys(endemicCache).length} already cached)...`);

  for (let i = 0; i < toClassify.length; i += DETAIL_BATCH_SIZE) {
    const batchNames = toClassify.slice(i, i + DETAIL_BATCH_SIZE);
    const batchIds = batchNames.map(name => taxonIdBySciName.get(name)!);
    try {
      const details = await fetchTaxonDetailsBatch(batchIds, indiaPlaceId);
      const lastChecked = new Date().toISOString().slice(0, 10);
      for (const name of batchNames) {
        const id = taxonIdBySciName.get(name)!;
        endemicCache[name] = { endemic: classifyEndemic(details.get(id), indiaPlaceId), lastChecked };
      }
      console.log(`  batch ${Math.floor(i / DETAIL_BATCH_SIZE) + 1}/${Math.ceil(toClassify.length / DETAIL_BATCH_SIZE)}: ${batchNames.length} species classified`);
    } catch (err) {
      console.error(`  ! batch detail fetch failed: ${(err as Error).message}`);
    }
    writeFileSync(endemicCachePath, JSON.stringify(endemicCache, null, 2) + "\n");
    await sleep(REQUEST_DELAY_MS);
  }

  // Species with no resolvable taxonId at all are "unknown" by definition — no API call needed.
  const lastChecked = new Date().toISOString().slice(0, 10);
  for (const name of allSpecies.keys()) {
    if (!(name in endemicCache)) endemicCache[name] = { endemic: "unknown", lastChecked };
  }
  writeFileSync(endemicCachePath, JSON.stringify(endemicCache, null, 2) + "\n");

  // --- Write data/indiaSpecialities.ts ---
  const lines: string[] = [];
  lines.push(`export type IndiaSpeciality = { endemic: "yes" | "no" | "unknown"; iconic: boolean; lastChecked: string };`);
  lines.push("");
  lines.push(`// Endemic status resolved from iNaturalist's establishment_means for a runtime-resolved`);
  lines.push(`// India place_id — see scripts/tag-india-specialities.ts. "unknown" means no India listing`);
  lines.push(`// was found at all (never fabricated as "no"). Iconic is seeded true only for species with`);
  lines.push(`// an existing Flagship entry (data/species.ts) — that curation already is the editorial`);
  lines.push(`// "iconic" judgment; see data/iconic-candidates.json for Extended species worth a human look.`);
  lines.push(`export const indiaSpecialities: Record<string, IndiaSpeciality> = {`);
  for (const name of Array.from(allSpecies.keys()).sort()) {
    const row = allSpecies.get(name)!;
    const endemic = endemicCache[name]?.endemic ?? "unknown";
    const checked = endemicCache[name]?.lastChecked ?? lastChecked;
    lines.push(`  ${JSON.stringify(name)}: { endemic: ${JSON.stringify(endemic)}, iconic: ${row.iconic}, lastChecked: ${JSON.stringify(checked)} },`);
  }
  lines.push(`};`);
  lines.push("");
  writeFileSync(outPath, lines.join("\n"));

  // --- Iconic candidates: top 15 per group among non-Flagship Extended species, by total observations ---
  const byGroup: Record<IconicGroup, { slug: string; commonName: string; scientificName: string; totalObservations: number }[]> = { Bird: [], Mammal: [], Reptile: [], Amphibian: [] };
  for (const s of extended) {
    byGroup[s.iconicGroup].push({ slug: s.slug, commonName: s.commonName, scientificName: s.scientificName, totalObservations: s.totalObservations });
  }
  const candidates: Record<IconicGroup, { slug: string; commonName: string; scientificName: string; totalObservations: number }[]> = { Bird: [], Mammal: [], Reptile: [], Amphibian: [] };
  for (const group of Object.keys(byGroup) as IconicGroup[]) {
    candidates[group] = byGroup[group].sort((a, b) => b.totalObservations - a.totalObservations).slice(0, 15);
  }
  writeFileSync(candidatesPath, JSON.stringify(candidates, null, 2) + "\n");

  // --- Summary ---
  const endemicCounts = { yes: 0, no: 0, unknown: 0 };
  for (const name of allSpecies.keys()) endemicCounts[endemicCache[name]?.endemic ?? "unknown"]++;
  console.log("\n=== Summary ===");
  console.log(`Endemic: yes=${endemicCounts.yes} no=${endemicCounts.no} unknown=${endemicCounts.unknown}`);
  console.log(`Ambiguous/no-match taxon reviews flagged: ${review.length}`);
  console.log(`Iconic candidates per group: ${(Object.keys(candidates) as IconicGroup[]).map(g => `${g} ${candidates[g].length}`).join(", ")}`);
  console.log(`\nWrote ${outPath}, ${candidatesPath}, ${reviewPath}`);
}

main();
