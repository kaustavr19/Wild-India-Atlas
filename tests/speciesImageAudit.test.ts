import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import test from "node:test";
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

test("records the current Phase 3B species image coverage", () => {
  const report = buildSpeciesImageAudit({ flagshipSpecies, flagshipImages, extendedImages, ebirdSpecies, inaturalistSpecies });

  assert.deepEqual(report.catalog, {
    flagship: 21,
    extended: 1338,
    total: 1359,
    extendedBirds: 949,
    extendedOtherAnimals: 389,
  });
  assert.deepEqual(report.coverage, {
    attributableLicensed: 33,
    legacyRemoteWithoutAttribution: 389,
    designedFallbackRequired: 937,
    displayablePercent: 31.05,
    attributablePercent: 2.43,
  });
});

test("keeps every current manifest entry valid and attached to a canonical species", () => {
  const report = buildSpeciesImageAudit({ flagshipSpecies, flagshipImages, extendedImages, ebirdSpecies, inaturalistSpecies });
  const errors = report.issues.filter((issue) => issue.severity === "error");

  assert.deepEqual(errors, []);
  assert.equal(report.manifests.flagshipEntries, flagshipSpecies.length);
  assert.equal(report.manifests.extendedEntries, 12);
  assert.ok(report.issues.some((issue) => issue.code === "legacy-photos-without-attribution"));
  let totalCachedBytes = 0;
  for (const [slug, meta] of Object.entries(extendedImages)) {
    assert.ok(meta.src.startsWith("/images/species/extended/"), `${slug} should use a locally cached display asset`);
    assert.ok(meta.sourceAsset?.startsWith("https://"), `${slug} should retain its original source asset`);
    const cachedPath = path.join(process.cwd(), "public", meta.src);
    assert.ok(existsSync(cachedPath), `${slug} cached image should exist`);
    const bytes = statSync(cachedPath).size;
    assert.ok(bytes <= 500_000, `${slug} should remain below the 500 KB per-image pilot limit`);
    totalCachedBytes += bytes;
  }
  assert.ok(totalCachedBytes <= 2_500_000, "the complete pilot should remain below 2.5 MB");
});

test("rejects incomplete licensed image overrides", () => {
  const validFlagshipImage: SpeciesImageMeta = {
    title: "Example flagship",
    src: "https://images.example/flagship.jpg",
    width: 1200,
    height: 800,
    filePage: "https://images.example/flagship",
    author: "Example photographer",
    license: "CC BY 4.0",
  };
  const incompleteOverride = {
    scientificName: "Avis exemplaris",
    source: "Wikimedia Commons",
    title: "Example bird",
    src: "http://images.example/bird.jpg",
    width: 0,
    height: 800,
    filePage: "",
    author: "",
    license: "",
  } as ExtendedSpeciesImageMeta;

  const report = buildSpeciesImageAudit({
    flagshipSpecies: [{ slug: "flagship", scientificName: "Panthera exemplaris" }],
    flagshipImages: { flagship: validFlagshipImage },
    extendedImages: { "example-bird": incompleteOverride },
    ebirdSpecies: { place: [{ sciName: "Avis exemplaris", comName: "Example Bird" }] },
    inaturalistSpecies: {},
  });
  const codes = new Set(report.issues.map((issue) => issue.code));

  assert.ok(codes.has("missing-image-metadata"));
  assert.ok(codes.has("invalid-image-url"));
  assert.ok(codes.has("invalid-image-dimensions"));
});

test("does not confuse third-party throttling with a confirmed broken image", () => {
  assert.equal(classifyRemoteImageResponse(200, "image/jpeg"), "ok");
  assert.equal(classifyRemoteImageResponse(404, "text/html"), "failure");
  assert.equal(classifyRemoteImageResponse(410, null), "failure");
  assert.equal(classifyRemoteImageResponse(200, "text/html"), "failure");
  assert.equal(classifyRemoteImageResponse(429, "text/html"), "inconclusive");
  assert.equal(classifyRemoteImageResponse(503, null), "inconclusive");
  assert.equal(classifyRemoteImageResponse(200, null), "inconclusive");
});
