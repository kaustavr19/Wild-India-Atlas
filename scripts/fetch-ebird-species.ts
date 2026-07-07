// Fetches species presence data for each confirmed eBird hotspot mapping and writes
// data/ebirdSpecies.json. Manually-run CLI script, not a build hook.
//
// Usage: npm run fetch:ebird
// Requires EBIRD_API_TOKEN in .env.local — see .env.local.example.
// Requires confirmed entries in data/ebirdHotspots.ts (run find:ebird-hotspots + manual
// review first) — slugs without a confirmed mapping are skipped, not errored on.

import { writeFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { ebirdHotspots } from "../data/ebirdHotspots.ts";
import { hotspots } from "../data/hotspots.ts";

const API_BASE = "https://api.ebird.org/v2";
const REQUEST_DELAY_MS = 200;

function loadToken(): string {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // .env.local not present — fall through and rely on whatever is already in process.env
  }
  const token = process.env.EBIRD_API_TOKEN;
  if (!token) {
    console.error(
      "Missing EBIRD_API_TOKEN.\n\n" +
      "Get a free key from https://ebird.org/api/keygen, then create .env.local in the\n" +
      "project root (see .env.local.example):\n\n" +
      "  EBIRD_API_TOKEN=your-key-here\n"
    );
    process.exit(1);
  }
  return token;
}

async function fetchSpeciesCodes(token: string, locId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/product/spplist/${locId}`, { headers: { "X-eBirdApiToken": token } });
  if (!res.ok) throw new Error(`spplist ${res.status} ${res.statusText}`);
  return res.json() as Promise<string[]>;
}

type EbirdRecentObs = { speciesCode: string; comName: string; sciName: string; howMany?: number; obsDt: string };

async function fetchRecentObs(token: string, locId: string): Promise<EbirdRecentObs[]> {
  const res = await fetch(`${API_BASE}/data/obs/${locId}/recent?fmt=json`, { headers: { "X-eBirdApiToken": token } });
  if (!res.ok) throw new Error(`recent obs ${res.status} ${res.statusText}`);
  return res.json() as Promise<EbirdRecentObs[]>;
}

type EbirdTaxonEntry = { speciesCode: string; comName: string; sciName: string };

// eBird's taxonomy lookup, so every species code from spplist gets a real common/scientific
// name — not just the ones that happen to also appear in the recent-observations pull.
async function fetchTaxonomy(token: string, speciesCodes: string[]): Promise<Map<string, EbirdTaxonEntry>> {
  const map = new Map<string, EbirdTaxonEntry>();
  const chunkSize = 200;
  for (let i = 0; i < speciesCodes.length; i += chunkSize) {
    const chunk = speciesCodes.slice(i, i + chunkSize);
    const url = `${API_BASE}/ref/taxonomy/ebird?species=${chunk.join(",")}&fmt=json`;
    const res = await fetch(url, { headers: { "X-eBirdApiToken": token } });
    if (!res.ok) throw new Error(`taxonomy ${res.status} ${res.statusText}`);
    const rows = (await res.json()) as EbirdTaxonEntry[];
    for (const row of rows) map.set(row.speciesCode, row);
  }
  return map;
}

// Not a true statistical frequency (that requires eBird's historic bar-chart data, which
// isn't part of the documented v2 API surface) — this is the bird count from the most recent
// checklist that reported the species at this hotspot, via /data/obs/{locId}/recent. Real,
// but a much weaker signal than a frequency percentage; labeled as obsCount, not frequencyPct,
// to avoid implying more precision than the API actually gives us.
export type EbirdSpeciesEntry = {
  speciesCode: string;
  comName: string;
  sciName: string;
  obsCount?: number;
  lastPulled: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const token = loadToken();
  const validSlugs = new Set(hotspots.map(h => h.slug));
  const confirmedSlugs = Object.keys(ebirdHotspots);

  if (confirmedSlugs.length === 0) {
    console.log("No confirmed eBird hotspot mappings in data/ebirdHotspots.ts yet — nothing to fetch.");
    console.log("Run `npm run find:ebird-hotspots`, review data/ebird-candidates.json, and confirm entries first.");
    return;
  }

  const outPath = path.join(process.cwd(), "data", "ebirdSpecies.json");
  const existing: Record<string, EbirdSpeciesEntry[]> = existsSync(outPath) ? JSON.parse(readFileSync(outPath, "utf8")) : {};

  const skipped: string[] = [];
  for (const slug of confirmedSlugs) {
    if (!validSlugs.has(slug)) { skipped.push(slug); continue; }
    const mapping = ebirdHotspots[slug];
    console.log(`Fetching ${slug} (${mapping.locName} / ${mapping.locId})...`);
    try {
      const codes = await fetchSpeciesCodes(token, mapping.locId);
      const [recent, taxonomy] = await Promise.all([
        fetchRecentObs(token, mapping.locId),
        fetchTaxonomy(token, codes),
      ]);
      const recentByCode = new Map(recent.map(o => [o.speciesCode, o]));
      const lastPulled = new Date().toISOString().slice(0, 10);
      existing[slug] = codes.map(speciesCode => {
        const taxon = taxonomy.get(speciesCode);
        const obs = recentByCode.get(speciesCode);
        return {
          speciesCode,
          comName: taxon?.comName ?? obs?.comName ?? speciesCode,
          sciName: taxon?.sciName ?? obs?.sciName ?? "",
          obsCount: obs?.howMany,
          lastPulled,
        };
      });
    } catch (err) {
      console.error(`  ! ${slug}: ${(err as Error).message}`);
    }
    await sleep(REQUEST_DELAY_MS);
  }

  if (skipped.length) {
    console.log(`\nSkipped (not a real hotspot slug in data/hotspots.ts): ${skipped.join(", ")}`);
  }

  writeFileSync(outPath, JSON.stringify(existing, null, 2) + "\n");
  console.log(`\nWrote species data for ${Object.keys(existing).length} hotspot(s) to ${outPath}`);
}

main();
