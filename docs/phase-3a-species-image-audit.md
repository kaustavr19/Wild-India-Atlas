# Phase 3A species image audit

Recorded on 22 July 2026 after the static-data delivery work and map containment fixes.

## Scope and production safety

Phase 3A adds audit tooling and an empty, validated manifest for future extended-species images. It does not change the species listing, profile rendering, public routes, browser storage, build-time source data, or current image requests.

The image system remains static. A database or CMS is not needed for this work: licensed image metadata can be reviewed in source control, validated during CI, cached at the edge, and rolled back with the application.

## Measured baseline

The audit rebuilds the same canonical catalogue rules used by the application, including scientific-name de-duplication and removal of species already represented by a flagship profile.

- Total displayed species: **1,359**.
- Flagship species: **21**.
- Extended species: **1,338**.
  - eBird-derived: **949**.
  - iNaturalist-derived: **389**.
- Images with complete author, licence, source-page, URL, and dimensions metadata: **21** (**1.55%**).
- Existing remote iNaturalist photos without complete attribution metadata: **389**.
- Species requiring the designed fallback because no photo URL exists: **949**.
- Current raw displayable-photo coverage: **30.17%**.
- Initial live scan: **418 unique URLs**, **0 confirmed failures**, and **16 inconclusive responses** (15 Wikimedia rate-limit responses and one iNaturalist timeout).

“Displayable” does not mean publication-ready. The 389 legacy iNaturalist photos are intentionally counted separately because their current records contain only a URL, not the author, licence, or source page needed for a durable image manifest.

## Audit contract

Run the deterministic local audit with:

```text
npm run audit:species-images
```

The audit fails when it finds:

- a flagship species without a curated image;
- an orphan image key that no longer matches a canonical species;
- a missing title, author, licence, source page, or image URL;
- a non-HTTPS or malformed URL;
- non-positive image dimensions;
- an extended image whose scientific name does not match the canonical species.

An optional network check verifies the current HTTP response and image content type for every unique remote asset:

```text
npm run audit:species-images -- --check-remote
```

The network check reports confirmed failures separately from inconclusive responses. A `404`, `410`, or definite non-image response fails the command; rate limiting, server errors, missing content types, and timeouts are marked for retry instead of being misreported as broken assets. The network check is deliberately not part of the normal build because third-party availability should not make a production deployment nondeterministic.

## Phase 3B acceptance contract

Phase 3B was implemented on the same review branch using this contract; see `docs/phase-3b-species-image-pilot.md` for the measured result:

1. Use the existing category-specific `SpeciesVisual` treatment for extended species without a real image instead of the compressed text-only header.
2. Populate `data/extended-species-images.json` with a reviewed pilot batch of licensed images.
3. Prefer stable source pages and explicit author/licence metadata; do not add a URL-only image.
4. Treat image lookup as taxonomic presentation data, not evidence that the animal was observed at a hotspot.
5. Keep images lazy-loaded and compare listing payload/build output against this baseline before merging.
