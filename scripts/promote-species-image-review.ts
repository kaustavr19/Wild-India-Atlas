// Promotes an explicitly reviewed Phase 3D batch into the canonical image
// manifest. Visual rejections must be supplied by slug; this script does not
// attempt to infer species identity or image quality.
//
// Usage: npm run promote:species-images -- --batch=1 --size=50 --reject=black-winged-stilt

import { writeFile } from "node:fs/promises";
import path from "node:path";
import inventoryRaw from "../docs/phase-3d-species-image-inventory.json" with { type: "json" };
import manifestRaw from "../data/extended-species-images.json" with { type: "json" };
import type { ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";
import { isApprovedSpeciesImageLicense } from "../lib/speciesImageInventory.ts";

type InventoryItem = {
  slug: string;
  commonName: string;
  scientificName: string;
  confirmationCount: number;
  status: string;
  imageFilename?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  filePage?: string;
  author?: string;
  license?: string;
};
type InventoryReport = { items: InventoryItem[] };

const argument = (name: string) => process.argv.find((value) => value.startsWith(`--${name}=`))?.split("=", 2)[1];
const batch = Number(argument("batch") ?? "1");
const size = Number(argument("size") ?? "50");
const rejected = new Set((argument("reject") ?? "").split(",").map((slug) => slug.trim()).filter(Boolean));
const manifest = manifestRaw as Record<string, ExtendedSpeciesImageMeta>;
const candidates = (inventoryRaw as InventoryReport).items
  .filter((item) => item.status === "review-ready")
  .sort((left, right) => right.confirmationCount - left.confirmationCount || left.slug.localeCompare(right.slug));
const batchCandidates = candidates.slice((batch - 1) * size, batch * size);
const batchSlugs = new Set(batchCandidates.map((item) => item.slug));

if (!Number.isInteger(batch) || batch < 1) throw new Error("--batch must be a positive integer.");
if (!Number.isInteger(size) || size < 1 || size > 100) throw new Error("--size must be between 1 and 100.");
for (const slug of rejected) {
  if (!batchSlugs.has(slug)) throw new Error(`Rejected slug ${slug} is not in review batch ${batch}.`);
}

const accepted: string[] = [];
for (const item of batchCandidates) {
  if (rejected.has(item.slug) || manifest[item.slug]) continue;
  if (
    !item.imageFilename
    || !item.imageUrl?.startsWith("https://")
    || !item.filePage?.startsWith("https://")
    || !item.author?.trim()
    || !isApprovedSpeciesImageLicense(item.license)
    || !Number.isFinite(item.width)
    || !Number.isFinite(item.height)
    || (item.width ?? 0) <= 0
    || (item.height ?? 0) <= 0
  ) {
    throw new Error(`${item.slug} does not satisfy the reviewed image publication contract.`);
  }
  manifest[item.slug] = {
    scientificName: item.scientificName,
    source: "Wikimedia Commons",
    title: item.imageFilename.replace(/\.[^.]+$/, ""),
    src: `/images/species/extended/${item.slug}.webp`,
    sourceAsset: item.imageUrl,
    width: item.width!,
    height: item.height!,
    filePage: item.filePage,
    author: item.author,
    license: item.license!,
  };
  accepted.push(item.slug);
}

const outputPath = path.resolve(process.cwd(), "data", "extended-species-images.json");
await writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Promoted ${accepted.length} reviewed images from batch ${batch}.`);
console.log(accepted.join(","));
if (rejected.size > 0) console.log(`Kept ${[...rejected].join(",")} on the designed fallback after visual review.`);
