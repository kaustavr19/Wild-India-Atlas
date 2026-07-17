# Phase 2 static data delivery

Recorded on 17 July 2026 after the Phase 1 homepage cleanup.

## Decision

Wild India Atlas remains static and does not add a database. The current catalogue changes at build time, has no visitor accounts, and does not need live writes or server-side querying.

The Field Journal previously imported the complete eBird and iNaturalist source files into its client graph through `JourneyTrail`. Those raw files total approximately 1.8 MB and were used only to resolve the small set of slugs stored in a visitor's browser.

Phase 2 replaces that client import with `/data/journal-index`, a compact lookup generated during the Next.js build:

- the endpoint is prerendered as a static asset;
- browsers request it only after a saved journal or expedition-trail entry exists;
- empty journals do not download the lookup;
- both journal and trail share one in-memory request and cache;
- the original citizen-science files remain build-time sources of truth;
- browser-local storage keys and entry schemas are unchanged.

## Measured result

- Field Journal uncompressed JavaScript: approximately 0.69 MB.
- Phase 0 Field Journal baseline: approximately 2.04 MB.
- Reduction: approximately 66%.
- Static lookup: 1,401 records.
- Static lookup size: approximately 587 KB raw and 57 KB gzip.
- Generated static routes: 1,414, including the lookup endpoint.

These measurements use the same uncompressed script-total method as the Phase 0 baseline. The lookup size is reported separately because it is fetched only when needed and is normally transferred compressed.

## Compatibility

- Existing `wia-field-journal-v1` entries continue to resolve without migration.
- Existing `wia-expedition-trail-v1` entries continue to resolve without migration.
- Extended citizen-science species now resolve in the main journal as well as the expedition trail.
- A failed lookup never clears local data; the UI asks the visitor to reload.

## When a database becomes justified

Revisit a database or managed content store when the product needs at least one of:

- user accounts or cross-device journal sync;
- live editorial publishing without a deployment;
- frequently changing observations that must be queried at request time;
- server-side search across a substantially larger catalogue;
- permissions, moderation, or collaborative contributions.

Until then, build-time source data plus static route-level delivery remains simpler, cheaper, cacheable, and easier to roll back.
