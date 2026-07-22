// Audits the species catalogue's image coverage without changing production data or UI.
//
// Usage:
//   npm run audit:species-images
//   npm run audit:species-images -- --json
//   npm run audit:species-images -- --check-remote

import flagshipImagesRaw from "../data/species-images.json" with { type: "json" };
import extendedImagesRaw from "../data/extended-species-images.json" with { type: "json" };
import ebirdSpeciesRaw from "../data/ebirdSpecies.json" with { type: "json" };
import inaturalistSpeciesRaw from "../data/inaturalistSpecies.json" with { type: "json" };
import { species as flagshipSpecies } from "../data/species.ts";
import {
  buildSpeciesImageAudit,
  classifyRemoteImageResponse,
  type ExtendedSpeciesImageMeta,
  type SpeciesImageMeta,
} from "../lib/speciesImageAudit.ts";

const flagshipImages = flagshipImagesRaw as Record<string, SpeciesImageMeta>;
const extendedImages = extendedImagesRaw as Record<string, ExtendedSpeciesImageMeta>;
const ebirdSpecies = ebirdSpeciesRaw as Record<string, Array<{ sciName: string; comName: string; photoUrl?: string }>>;
const inaturalistSpecies = inaturalistSpeciesRaw as Record<string, Array<{ scientificName: string; commonName: string; photoUrl?: string }>>;
const wantsJson = process.argv.includes("--json");
const checkRemote = process.argv.includes("--check-remote");

const report = buildSpeciesImageAudit({ flagshipSpecies, flagshipImages, extendedImages, ebirdSpecies, inaturalistSpecies });

type RemoteImageCheck = {
  checked: number;
  failures: Array<{ url: string; reason: string }>;
  inconclusive: Array<{ url: string; reason: string }>;
};

async function remoteImageCheck(): Promise<RemoteImageCheck> {
  const urls = new Set<string>();
  for (const meta of Object.values(flagshipImages)) urls.add(meta.src);
  for (const meta of Object.values(extendedImages)) urls.add(meta.sourceAsset ?? meta.src);
  for (const entries of Object.values(inaturalistSpecies)) {
    for (const entry of entries) if (entry.photoUrl) urls.add(entry.photoUrl);
  }

  const queue = Array.from(urls);
  const failures: Array<{ url: string; reason: string }> = [];
  const inconclusive: Array<{ url: string; reason: string }> = [];
  let cursor = 0;

  async function worker() {
    while (cursor < queue.length) {
      const url = queue[cursor++];
      try {
        const requestHeaders = { "User-Agent": "WildIndiaAtlas/1.0 (read-only image health audit; contact via repository)" };
        let response = await fetch(url, { method: "HEAD", headers: requestHeaders, redirect: "follow", signal: AbortSignal.timeout(10_000) });
        if (response.status === 405 || response.status === 403) {
          response = await fetch(url, { headers: { ...requestHeaders, Range: "bytes=0-0" }, redirect: "follow", signal: AbortSignal.timeout(10_000) });
        }
        const contentType = response.headers.get("content-type");
        const classification = classifyRemoteImageResponse(response.status, contentType);
        const reason = response.ok ? `Content type ${contentType ?? "unknown"}` : `HTTP ${response.status}`;
        if (classification === "failure") failures.push({ url, reason });
        else if (classification === "inconclusive") inconclusive.push({ url, reason });
        await response.body?.cancel();
      } catch (error) {
        inconclusive.push({ url, reason: error instanceof Error ? error.message : String(error) });
      }
    }
  }

  await Promise.all(Array.from({ length: 8 }, () => worker()));
  return { checked: queue.length, failures, inconclusive };
}

function printSummary(remote?: RemoteImageCheck) {
  console.log("Species image audit");
  console.log(`Catalogue: ${report.catalog.total} (${report.catalog.flagship} flagship, ${report.catalog.extended} extended)`);
  console.log(`Extended sources: ${report.catalog.extendedBirds} eBird, ${report.catalog.extendedOtherAnimals} iNaturalist`);
  console.log(`Attributable licensed images: ${report.coverage.attributableLicensed} (${report.coverage.attributablePercent}%)`);
  console.log(`Legacy remote photos without attribution metadata: ${report.coverage.legacyRemoteWithoutAttribution}`);
  console.log(`Designed fallback required: ${report.coverage.designedFallbackRequired}`);
  console.log(`Displayable image coverage: ${report.coverage.displayablePercent}%`);
  console.log(`Manifest entries: ${report.manifests.flagshipEntries} flagship, ${report.manifests.extendedEntries} extended`);
  console.log(`Issues: ${report.issues.filter((issue) => issue.severity === "error").length} errors, ${report.issues.filter((issue) => issue.severity === "warning").length} warnings`);
  for (const issue of report.issues) console.log(`  ${issue.severity.toUpperCase()} ${issue.code} [${issue.subject}]: ${issue.message}`);
  if (remote) {
    console.log(`Remote image check: ${remote.checked} URLs, ${remote.failures.length} confirmed failures, ${remote.inconclusive.length} inconclusive`);
    for (const failure of remote.failures) console.log(`  FAIL ${failure.url}: ${failure.reason}`);
    for (const item of remote.inconclusive) console.log(`  RETRY ${item.url}: ${item.reason}`);
  }
}

const remote = checkRemote ? await remoteImageCheck() : undefined;
if (wantsJson) console.log(JSON.stringify({ ...report, ...(remote ? { remote } : {}) }, null, 2));
else printSummary(remote);

if (report.issues.some((issue) => issue.severity === "error") || (remote?.failures.length ?? 0) > 0) process.exitCode = 1;
