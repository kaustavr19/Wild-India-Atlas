# Phase 3B species image pilot

Recorded on 22 July 2026 and released together with the Phase 3A audit foundation.

## Production change

Extended species now use one consistent image resolver:

1. a reviewed image from `data/extended-species-images.json`;
2. the existing iNaturalist photo URL when no reviewed override exists;
3. the existing category-specific `SpeciesVisual` illustration when no real photo exists.

This removes the compressed text-only/blank treatment from missing-image cards without fabricating photographs. Reviewed pilot photos are cached as compressed local WebP assets instead of being hotlinked, so Wikimedia throttling cannot break production presentation. Listing images remain lazy-loaded; the selected profile hero loads eagerly as before. Routes, slugs, observation evidence, browser storage, and data-source semantics are unchanged.

## Licensed pilot

The first manifest batch covers 12 eBird-derived species, selected by the number of atlas places where each canonical species is confirmed. The batch spans species recorded across 32–36 atlas places, including Red-vented Bulbul, Gray Wagtail, House Crow, Oriental Magpie-Robin, Common Myna, Black Drongo, and Black-winged Kite.

Candidates are resolved through Wikidata's exact taxon-name property (`P225`) and primary Wikimedia Commons image (`P18`). The sourcing command prints candidates but never writes the production manifest, preserving a manual review step. Every accepted entry includes:

- the exact canonical scientific name;
- a stable Commons source page;
- an HTTPS display asset;
- image dimensions;
- author and Creative Commons licence.

The House Crow candidate was manually replaced with a CC BY 2.0 Commons photograph rather than accepting the taxon's GFDL-only primary image.

## Coverage after the pilot

- Total displayed species: **1,359**.
- Fully attributable licensed images: **33** (**2.43%**), up from 21.
- Licensed extended-species pilot images: **12**.
- Legacy URL-only iNaturalist photos: **389**.
- Species using the designed fallback: **937**.
- Real-photo display coverage: **31.05%**.
- Visual coverage, including deliberate fallbacks: **100%**.
- Cached pilot assets: **1,918,252 bytes total** (about 1.83 MiB), with every image below 500 KB.

The pilot is intentionally small. It validates the schema, sourcing workflow, responsive presentation, licence display, and rollback path before larger batches are reviewed.

## Safety and verification

- A manifest entry cannot pass the audit without approved CC BY/CC BY-SA metadata.
- Scientific names must match the canonical species exactly.
- Orphaned slugs, malformed URLs, invalid dimensions, and missing credits fail the audit.
- Browser coverage checks a licensed card, a fallback card, the credited detail hero, desktop, and mobile.
- Third-party rate limiting remains separate from confirmed broken-image failures.
