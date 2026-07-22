// Downloads reviewed extended-species manifest assets and writes compressed local WebP files.
// It never changes the manifest; update `src` to the printed local path only after review.
//
// Usage: npm run cache:species-images

import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import imagesRaw from "../data/extended-species-images.json" with { type: "json" };
import type { ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";

const images = imagesRaw as Record<string, ExtendedSpeciesImageMeta>;
const outputDirectory = path.join(process.cwd(), "public", "images", "species", "extended");
const USER_AGENT = "WildIndiaAtlas/1.0 (licensed image cache; contact via repository)";

async function download(url: string): Promise<Buffer> {
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30_000) });
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      lastError = `HTTP ${response.status}`;
      if (response.status !== 429 && response.status < 500) break;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 3_000));
  }
  throw new Error(`${lastError} for ${url}`);
}

await mkdir(outputDirectory, { recursive: true });
for (const [slug, meta] of Object.entries(images)) {
  const sourceUrl = meta.sourceAsset ?? meta.src;
  if (!sourceUrl.startsWith("https://")) throw new Error(`${slug} has no HTTPS source asset to cache.`);
  const input = await download(sourceUrl);
  const outputPath = path.join(outputDirectory, `${slug}.webp`);
  const result = await sharp(input)
    .rotate()
    .resize({ width: 1280, height: 960, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 4 })
    .toFile(outputPath);
  console.log(`${slug}\t/images/species/extended/${slug}.webp\t${result.width}x${result.height}\t${result.size} bytes\t${sourceUrl}`);
  await new Promise((resolve) => setTimeout(resolve, 500));
}
