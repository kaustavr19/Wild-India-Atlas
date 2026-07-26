import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import extendedSpeciesImageIndexRaw from "../data/extended-species-image-index.json" with { type: "json" };
import extendedSpeciesImagesRaw from "../data/extended-species-images.json" with { type: "json" };
import type { ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";
import { buildExtendedSpeciesImageIndex } from "../lib/speciesImageIndex.ts";

const root = process.cwd();
const images = extendedSpeciesImagesRaw as Record<string, ExtendedSpeciesImageMeta>;
const index = extendedSpeciesImageIndexRaw as Record<string, string>;

test("keeps the compact listing index synchronized with the attribution manifest", () => {
  assert.deepEqual(index, buildExtendedSpeciesImageIndex(images));
  assert.equal(Object.keys(index).length, Object.keys(images).length);

  for (const [slug, src] of Object.entries(index)) {
    assert.equal(typeof src, "string", `${slug} should contain only its display path`);
    assert.ok(src.startsWith("/images/species/extended/"), `${slug} should use the reviewed local cache`);
  }
});

test("keeps listing image data within the Phase 3E payload budget", () => {
  const compactBytes = Buffer.byteLength(JSON.stringify(index));
  const fullBytes = Buffer.byteLength(JSON.stringify(images));
  const projectedCompleteIndexBytes = Math.ceil((compactBytes / Object.keys(index).length) * 949);
  const averageEntryBytes = compactBytes / Object.keys(index).length;

  assert.ok(averageEntryBytes <= 75, `compact index averages ${averageEntryBytes.toFixed(2)} bytes per image`);
  assert.ok(compactBytes <= fullBytes * 0.15, "listing index should remain at least 85% smaller than full attribution data");
  assert.ok(projectedCompleteIndexBytes <= 75_000, `projected 949-image index is ${projectedCompleteIndexBytes} bytes`);
});

test("keeps full attribution data out of client components", () => {
  const clientImageSource = readFileSync(path.join(root, "components", "ExtendedSpeciesImage.tsx"), "utf8");
  const profilePageSource = readFileSync(path.join(root, "app", "species", "[slug]", "page.tsx"), "utf8");

  assert.ok(clientImageSource.includes("extended-species-image-index.json"));
  assert.ok(!clientImageSource.includes('extended-species-images.json'));
  assert.ok(profilePageSource.includes("extended-species-images.json"));
  assert.ok(profilePageSource.includes("licensedImage={extendedSpeciesImages[slug]}"));
});
