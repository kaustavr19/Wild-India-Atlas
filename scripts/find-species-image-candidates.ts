// Ranks canonical extended species that still need a licensed image manifest entry.
// This is a read-only editorial aid: it never selects or writes an image automatically.
//
// Usage: npm run find:species-images -- --limit=20

import extendedImagesRaw from "../data/extended-species-images.json" with { type: "json" };
import ebirdSpeciesRaw from "../data/ebirdSpecies.json" with { type: "json" };
import inaturalistSpeciesRaw from "../data/inaturalistSpecies.json" with { type: "json" };
import { species as flagshipSpecies } from "../data/species.ts";
import { buildSpeciesImageCandidates, type ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";

const extendedImages = extendedImagesRaw as Record<string, ExtendedSpeciesImageMeta>;
const ebirdSpecies = ebirdSpeciesRaw as Record<string, Array<{ sciName: string; comName: string; photoUrl?: string }>>;
const inaturalistSpecies = inaturalistSpeciesRaw as Record<string, Array<{ scientificName: string; commonName: string; photoUrl?: string }>>;
const limitArg = process.argv.find((argument) => argument.startsWith("--limit="));
const requestedLimit = Number(limitArg?.split("=")[1] ?? 20);
const limit = Number.isInteger(requestedLimit) && requestedLimit > 0 ? requestedLimit : 20;

const candidates = buildSpeciesImageCandidates(flagshipSpecies, ebirdSpecies, inaturalistSpecies)
  .filter((candidate) => !extendedImages[candidate.slug] && !candidate.photoUrl)
  .sort((left, right) => right.confirmationCount - left.confirmationCount || left.commonName.localeCompare(right.commonName))
  .slice(0, limit);

console.log(`Top ${candidates.length} extended species without an image, ranked by atlas-place coverage:`);
for (const candidate of candidates) {
  console.log(`${candidate.slug}\t${candidate.confirmationCount} places\t${candidate.commonName}\t${candidate.scientificName}\t${candidate.source}`);
}
