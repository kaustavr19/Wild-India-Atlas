// Generates the compact image-path index used by species listing cards.
// Full attribution remains in the canonical manifest and is selected server-side
// for an individual profile instead of being shipped wholesale to the browser.
//
// Usage: npm run build:species-image-index

import { writeFile } from "node:fs/promises";
import path from "node:path";
import extendedSpeciesImagesRaw from "../data/extended-species-images.json" with { type: "json" };
import type { ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";
import { buildExtendedSpeciesImageIndex } from "../lib/speciesImageIndex.ts";

const outputPath = path.resolve(process.cwd(), "data", "extended-species-image-index.json");
const images = extendedSpeciesImagesRaw as Record<string, ExtendedSpeciesImageMeta>;
const index = buildExtendedSpeciesImageIndex(images);

await writeFile(outputPath, `${JSON.stringify(index, null, 2)}\n`, "utf8");
console.log(`Wrote ${Object.keys(index).length} compact species image paths to ${outputPath}`);
