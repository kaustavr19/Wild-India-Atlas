// Discovery script — finds candidate eBird hotspots near each of our 42 hotspots so a human
// can confirm the right one. Never writes a "best guess" into real app data: proximity alone
// doesn't prove an eBird hotspot sits inside a park's actual boundary (a park can have zero,
// one, or several distinct eBird hotspots nearby).
//
// Usage: npm run find:ebird-hotspots
// Requires EBIRD_API_TOKEN in .env.local — see .env.local.example.

import { writeFileSync } from "node:fs";
import path from "node:path";
import { hotspots } from "../data/hotspots.ts";
import { haversineKm } from "../lib/geo.ts";

const RADIUS_KM = 25;
const API_BASE = "https://api.ebird.org/v2";
const REQUEST_DELAY_MS = 200; // gentle pacing against eBird's rate limits

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

type EbirdHotspotGeo = {
  locId: string;
  locName: string;
  countryCode: string;
  subnational1Code?: string;
  subnational2Code?: string;
  lat: number;
  lng: number;
  latestObsDt?: string;
  numSpeciesAllTime?: number;
};

async function fetchNearbyHotspots(token: string, lat: number, lng: number): Promise<EbirdHotspotGeo[]> {
  const url = `${API_BASE}/ref/hotspot/geo?lat=${lat}&lng=${lng}&dist=${RADIUS_KM}&fmt=json`;
  const res = await fetch(url, { headers: { "X-eBirdApiToken": token } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<EbirdHotspotGeo[]>;
}

// Only fields eBird's /ref/hotspot/geo endpoint actually returns — no "checklist count" field
// exists there, so we surface numSpeciesAllTime and latestObsDt instead of inventing one.
type Candidate = {
  locId: string;
  locName: string;
  distanceKm: number;
  numSpeciesAllTime?: number;
  latestObsDt?: string;
};

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const token = loadToken();
  const candidatesBySlug: Record<string, Candidate[]> = {};
  let zeroCount = 0, oneCount = 0, multipleCount = 0;
  const zeroSlugs: string[] = [];
  const oneSlugs: string[] = [];

  for (const hotspot of hotspots) {
    let results: EbirdHotspotGeo[];
    try {
      results = await fetchNearbyHotspots(token, hotspot.coordinates.latitude, hotspot.coordinates.longitude);
    } catch (err) {
      console.error(`  ! ${hotspot.slug}: request failed — ${(err as Error).message}`);
      candidatesBySlug[hotspot.slug] = [];
      zeroCount++;
      zeroSlugs.push(hotspot.slug);
      await sleep(REQUEST_DELAY_MS);
      continue;
    }

    const candidates: Candidate[] = results
      .map(r => ({
        locId: r.locId,
        locName: r.locName,
        distanceKm: Math.round(haversineKm(hotspot.coordinates, { latitude: r.lat, longitude: r.lng }) * 10) / 10,
        numSpeciesAllTime: r.numSpeciesAllTime,
        latestObsDt: r.latestObsDt,
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
      .slice(0, 5);

    candidatesBySlug[hotspot.slug] = candidates;
    if (candidates.length === 0) { zeroCount++; zeroSlugs.push(hotspot.slug); }
    else if (candidates.length === 1) { oneCount++; oneSlugs.push(hotspot.slug); }
    else multipleCount++;

    console.log(`${hotspot.slug}: ${candidates.length} candidate(s)`);
    await sleep(REQUEST_DELAY_MS);
  }

  const outPath = path.join(process.cwd(), "data", "ebird-candidates.json");
  writeFileSync(outPath, JSON.stringify(candidatesBySlug, null, 2) + "\n");

  console.log("\n=== Summary ===");
  console.log(`Parks with 0 candidates within ${RADIUS_KM}km:  ${zeroCount}${zeroSlugs.length ? " (" + zeroSlugs.join(", ") + ")" : ""}`);
  console.log(`Parks with exactly 1 candidate:      ${oneCount}${oneSlugs.length ? " (" + oneSlugs.join(", ") + ")" : ""}`);
  console.log(`Parks with multiple candidates:      ${multipleCount}`);
  console.log(`\nWrote candidates to ${outPath}`);
  console.log("Review it and fill confirmed matches into data/ebirdHotspots.ts before running `npm run fetch:ebird`.");
}

main();
