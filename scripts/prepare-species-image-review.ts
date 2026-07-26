// Downloads a deterministic, non-production review batch from the Phase 3D
// inventory and creates labelled contact sheets for visual identification.
// It does not change the production manifest or public image cache.
//
// Usage: npm run review:species-images [-- --batch=1 --size=50 --output=C:\temp\wia-review]

import { access, mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import inventoryRaw from "../docs/phase-3d-species-image-inventory.json" with { type: "json" };
import manifestRaw from "../data/extended-species-images.json" with { type: "json" };

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
const outputDirectory = path.resolve(argument("output") ?? path.join(os.tmpdir(), "wild-india-atlas", `species-image-review-${batch}`));
const USER_AGENT = "WildIndiaAtlas/1.0 (licensed image visual review; https://github.com/kaustavr19/Wild-India-Atlas)";
const TILE_WIDTH = 480;
const TILE_HEIGHT = 280;
const IMAGE_HEIGHT = 226;
const COLUMNS = 2;
const ROWS = 5;
const ITEMS_PER_SHEET = COLUMNS * ROWS;

if (!Number.isInteger(batch) || batch < 1) throw new Error("--batch must be a positive integer.");
if (!Number.isInteger(size) || size < 1 || size > 100) throw new Error("--size must be between 1 and 100.");

const existingSlugs = new Set(Object.keys(manifestRaw));
const candidates = (inventoryRaw as InventoryReport).items
  .filter((item) => item.status === "review-ready")
  .sort((left, right) => right.confirmationCount - left.confirmationCount || left.slug.localeCompare(right.slug));
const selected = candidates
  .slice((batch - 1) * size, batch * size)
  .filter((item) => !existingSlugs.has(item.slug));

if (selected.length === 0) throw new Error(`No review-ready candidates remain in batch ${batch}.`);
if (selected.some((item) => !item.imageUrl?.startsWith("https://"))) throw new Error("A selected candidate has no HTTPS review image.");

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (character) => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
  })[character]!);
}

async function download(url: string): Promise<Buffer> {
  const reviewUrl = url.replace(/\/\d+px-([^/]+)$/, "/500px-$1");
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(reviewUrl, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(30_000),
      });
      if (response.ok) return Buffer.from(await response.arrayBuffer());
      lastError = `${response.status} ${response.statusText}`;
      if (response.status !== 429 && response.status < 500) break;
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1_000, 30_000)
        : attempt * 5_000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      await new Promise((resolve) => setTimeout(resolve, attempt * 5_000));
    }
  }
  throw new Error(`${lastError} for ${reviewUrl}`);
}

await mkdir(outputDirectory, { recursive: true });
const tileDirectory = path.join(outputDirectory, "tiles");
await mkdir(tileDirectory, { recursive: true });
const tiles: Buffer[] = [];
const failures: Array<{ slug: string; reason: string }> = [];

for (const [index, candidate] of selected.entries()) {
  try {
    const tilePath = path.join(tileDirectory, `${String(index + 1).padStart(2, "0")}-${candidate.slug}.png`);
    try {
      await access(tilePath);
      tiles.push(await readFile(tilePath));
      continue;
    } catch {
      // Prepare only missing review tiles so interrupted batches can resume.
    }
    const source = await download(candidate.imageUrl!);
    const preview = await sharp(source)
      .rotate()
      .resize({ width: TILE_WIDTH, height: IMAGE_HEIGHT, fit: "contain", background: "#102c24" })
      .jpeg({ quality: 84 })
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${TILE_WIDTH}" height="${TILE_HEIGHT}">
        <rect width="100%" height="100%" fill="#102c24"/>
        <text x="12" y="247" fill="#fff9df" font-family="Arial" font-size="17" font-weight="700">${index + 1}. ${escapeXml(candidate.commonName)}</text>
        <text x="12" y="270" fill="#b8cbbf" font-family="Arial" font-size="14" font-style="italic">${escapeXml(candidate.scientificName)}</text>
      </svg>
    `);
    const tile = await sharp(label).composite([{ input: preview, top: 0, left: 0 }]).png().toBuffer();
    await writeFile(tilePath, tile);
    tiles.push(tile);
  } catch (error) {
    failures.push({ slug: candidate.slug, reason: error instanceof Error ? error.message : String(error) });
  }
  await new Promise((resolve) => setTimeout(resolve, 1_500));
}

if (failures.length > 0) {
  await writeFile(path.join(outputDirectory, "failures.json"), `${JSON.stringify(failures, null, 2)}\n`);
  throw new Error(`${failures.length} review images failed to download. See failures.json.`);
}
await unlink(path.join(outputDirectory, "failures.json")).catch(() => {});

for (let start = 0; start < tiles.length; start += ITEMS_PER_SHEET) {
  const sheetTiles = tiles.slice(start, start + ITEMS_PER_SHEET);
  const composites = sheetTiles.map((input, index) => ({
    input,
    left: (index % COLUMNS) * TILE_WIDTH,
    top: Math.floor(index / COLUMNS) * TILE_HEIGHT,
  }));
  const sheetNumber = Math.floor(start / ITEMS_PER_SHEET) + 1;
  await sharp({
    create: {
      width: COLUMNS * TILE_WIDTH,
      height: ROWS * TILE_HEIGHT,
      channels: 3,
      background: "#091f19",
    },
  }).composite(composites).png().toFile(path.join(outputDirectory, `contact-sheet-${sheetNumber}.png`));
}

await writeFile(path.join(outputDirectory, "candidates.json"), `${JSON.stringify(selected, null, 2)}\n`, "utf8");
console.log(`Prepared ${selected.length} candidates and ${Math.ceil(selected.length / ITEMS_PER_SHEET)} contact sheets in ${outputDirectory}`);
