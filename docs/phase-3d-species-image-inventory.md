# Phase 3D complete species image inventory

Recorded on 26 July 2026 after the two Phase 3C reviewed-image batches.

## Scope and safety

Phase 3D is a read-only discovery pass across every canonical extended species that still uses the designed fallback. It does not add an image to the production manifest, download a production asset, change a route, alter observation evidence, or introduce a database or runtime request.

The inventory uses batched exact scientific-name lookups:

1. the current atlas scientific name must match Wikidata `P225` exactly;
2. the exact taxon must expose a Wikimedia Commons `P18` primary image;
3. Commons must expose a source page, display asset, dimensions, author, and licence;
4. the current publication contract accepts only explicit CC BY or CC BY-SA licences;
5. every accepted candidate still requires visual review before production use.

The complete machine-readable result is in `docs/phase-3d-species-image-inventory.json`.

## Inventory result

- Remaining fallback species scanned: **889**.
- Unique canonical slugs recorded: **889**.
- Review-ready CC BY/CC BY-SA candidates: **792** (**89.09%**).
- Exact taxon not found: **11**.
- Exact taxon found without a primary image: **14**.
- Outside the current licence contract: **61**.
- Complete image metadata except for an author field: **11**.

All 889 records are eBird-derived because the 389 iNaturalist-derived extended records already have a legacy display-photo URL and are tracked separately by the attribution audit.

## Licence-policy finding

The 61 currently unsupported licence records are not one homogeneous rejection group:

- **37** are labelled Public Domain;
- **19** are CC0;
- **3** use the Free Art License;
- **1** is labelled Attribution;
- **1** is labelled Copyrighted free use.

Public Domain and CC0 account for **56** of the 61 records. They are plausible safe publication candidates, but the current manifest validator and credit treatment intentionally support only CC BY and CC BY-SA. A later phase can add explicit Public Domain/CC0 schema and UI support, test it, and then reclassify those 56 without weakening the existing contract.

## Taxonomy and missing-image cases

The 11 exact-name misses are concentrated in recent taxonomic combinations, including `Thinornis`, `Pachyglossa`, `Tachyspiza`, `Botaurus`, `Lophospiza`, and `Icthyophaga`. These require a reviewed synonym mapping rather than fuzzy common-name matching.

The 14 exact taxa without a Wikidata primary image include Shikra, Gray Francolin, Cinnamon Bittern, Gray-headed Fish-Eagle, Spot-bellied Eagle-Owl, and several low-frequency Himalayan species. These need a manual Commons search or an alternative licensed source.

The 11 incomplete records already have an approved CC BY/CC BY-SA licence but no author value in the returned Commons metadata. They require file-page review before they can enter the production manifest.

## Achievable coverage ceiling

If all 792 review-ready candidates pass visual review:

- fully attributable images would rise from **81** to **873**;
- only **97** eBird-derived species would still use the designed fallback;
- attributable catalogue coverage would reach approximately **64.24%**;
- real-photo display coverage, including the 389 legacy iNaturalist URLs, would reach approximately **92.86%**.

If explicit Public Domain and CC0 support safely unlocks the additional 56 candidates, the unresolved fallback set could fall to **41** before synonym recovery, manual Commons searches, and author-metadata repair.

These are candidate ceilings, not publication guarantees. Visual identification, crop quality, source-page integrity, and licence presentation still determine whether an individual image is accepted.

## Recommended execution from this inventory

1. Add the lightweight production image-index split before hundreds of manifest entries increase the client payload.
2. Review the 792 ready candidates in ranked batches of 40–50.
3. Merge approximately 100 accepted images per independently reversible PR.
4. Add explicit Public Domain/CC0 support as a separate policy and UI change.
5. Resolve the 11 exact-name misses through documented scientific synonyms.
6. Manually search the 14 no-primary-image taxa.
7. Repair or replace the 11 authorless Commons records.
8. Keep the designed fallback for every unresolved or rejected case.

At 50 candidates per visual-review batch, the current review-ready queue represents approximately **16 batches** and at most **8 image PRs** if releases contain about 100 accepted images.
