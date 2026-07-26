import assert from "node:assert/strict";
import test from "node:test";
import inventoryRaw from "../docs/phase-3d-species-image-inventory.json" with { type: "json" };
import manifestRaw from "../data/extended-species-images.json" with { type: "json" };
import type { ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";
import {
  classifySpeciesImageInventory,
  isApprovedSpeciesImageLicense,
  speciesImageInventoryStatuses,
  summarizeSpeciesImageInventory,
  type SpeciesImageInventoryStatus,
} from "../lib/speciesImageInventory.ts";

type InventoryItem = {
  slug: string;
  scientificName: string;
  confirmationCount: number;
  status: SpeciesImageInventoryStatus;
  taxonUri?: string;
  imageFilename?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  filePage?: string;
  author?: string;
  license?: string;
};

const inventory = inventoryRaw as {
  productionBaseline: {
    totalSpecies: number;
    reviewedExtendedImages: number;
    fallbackSpeciesInventoried: number;
  };
  summary: Record<SpeciesImageInventoryStatus, number> & { total: number };
  items: InventoryItem[];
};
const manifest = manifestRaw as Record<string, ExtendedSpeciesImageMeta>;

test("classifies the Phase 3D inventory contract without broad licence guessing", () => {
  assert.equal(isApprovedSpeciesImageLicense("CC BY 4.0"), true);
  assert.equal(isApprovedSpeciesImageLicense("CC BY-SA 2.0"), true);
  assert.equal(isApprovedSpeciesImageLicense("CC0"), false);
  assert.equal(isApprovedSpeciesImageLicense("Public domain"), false);
  assert.equal(isApprovedSpeciesImageLicense("GFDL"), false);

  assert.equal(classifySpeciesImageInventory({ hasExactTaxon: false, hasPrimaryImage: false }), "no-exact-taxon");
  assert.equal(classifySpeciesImageInventory({ hasExactTaxon: true, hasPrimaryImage: false }), "no-primary-image");
  assert.equal(classifySpeciesImageInventory({
    hasExactTaxon: true,
    hasPrimaryImage: true,
    license: "Public domain",
  }), "unsupported-license");
  assert.equal(classifySpeciesImageInventory({
    hasExactTaxon: true,
    hasPrimaryImage: true,
    license: "CC BY 4.0",
  }), "incomplete-metadata");
  assert.equal(classifySpeciesImageInventory({
    hasExactTaxon: true,
    hasPrimaryImage: true,
    license: "CC BY-SA 4.0",
    author: "Example photographer",
    imageUrl: "https://upload.wikimedia.org/example.jpg",
    filePage: "https://commons.wikimedia.org/wiki/File:Example.jpg",
    width: 960,
    height: 640,
  }), "review-ready");
});

test("records a complete and internally consistent Phase 3D inventory", () => {
  assert.deepEqual(inventory.productionBaseline, {
    totalSpecies: 1359,
    reviewedExtendedImages: 60,
    fallbackSpeciesInventoried: 889,
  });
  assert.deepEqual(inventory.summary, {
    total: 889,
    "review-ready": 792,
    "no-exact-taxon": 11,
    "no-primary-image": 14,
    "unsupported-license": 61,
    "incomplete-metadata": 11,
  });
  assert.equal(inventory.items.length, 889);
  assert.equal(new Set(inventory.items.map((item) => item.slug)).size, inventory.items.length);
  assert.deepEqual(summarizeSpeciesImageInventory(inventory.items), inventory.summary);
  assert.deepEqual(
    [...new Set(inventory.items.map((item) => item.status))].sort(),
    [...speciesImageInventoryStatuses].sort(),
  );
});

test("keeps every Phase 3D review-ready candidate complete", () => {
  const reviewReady = inventory.items.filter((item) => item.status === "review-ready");
  assert.equal(reviewReady.length, 792);
  for (const item of reviewReady) {
    assert.ok(item.taxonUri?.startsWith("http"), `${item.slug} should retain its exact taxon URI`);
    assert.ok(item.imageFilename, `${item.slug} should retain its Commons filename`);
    assert.ok(item.imageUrl?.startsWith("https://"), `${item.slug} should retain its candidate image URL`);
    assert.ok(item.filePage?.startsWith("https://commons.wikimedia.org/"), `${item.slug} should retain its file page`);
    assert.ok(item.author?.trim(), `${item.slug} should retain its author`);
    assert.ok(isApprovedSpeciesImageLicense(item.license), `${item.slug} should use the current approved licence contract`);
    assert.ok((item.width ?? 0) > 0 && (item.height ?? 0) > 0, `${item.slug} should retain positive dimensions`);
  }
});

test("promotes only the visually accepted Phase 3F batch", () => {
  const firstReviewBatch = inventory.items
    .filter((item) => item.status === "review-ready")
    .sort((left, right) => right.confirmationCount - left.confirmationCount || left.slug.localeCompare(right.slug))
    .slice(0, 50);

  assert.equal(firstReviewBatch.length, 50);
  for (const item of firstReviewBatch) {
    if (item.slug === "black-winged-stilt") {
      assert.equal(manifest[item.slug], undefined, "the egg-only candidate should remain on the designed fallback");
      continue;
    }
    assert.equal(manifest[item.slug]?.scientificName, item.scientificName, `${item.slug} should retain the exact taxon match`);
    assert.equal(manifest[item.slug]?.filePage, item.filePage, `${item.slug} should retain its reviewed Commons page`);
    assert.equal(manifest[item.slug]?.author, item.author, `${item.slug} should retain its reviewed author`);
    assert.equal(manifest[item.slug]?.license, item.license, `${item.slug} should retain its reviewed licence`);
  }
});
