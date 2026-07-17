# Phase 0 production safety baseline

Recorded on 17 July 2026 before the data-delivery and image-pipeline work.

## Production contract

- Production URL: `https://wild-india-atlas-mu.vercel.app/`
- Public routes, slugs, canonical URLs, and sitemap entries must remain stable.
- Browser-local data must remain backward compatible:
  - `wia-field-journal-v1`
  - `wia-expedition-trail-v1`
  - `theme`
  - `wia-ambient-sound`
  - `wia-sound-volume`
- `wia-descent-seen` may become unused when the first-visit animation is removed, but it must not be cleared or repurposed.

## Measured starting point

- 42 hotspot profiles.
- 1,359 species profiles.
- 1,413 generated static pages.
- Approximately 2.7 MB of structured source data.
- Approximately 335 MB of generated `.next/server/app` output.
- First-load uncompressed JavaScript observed in the current production build:
  - Field Journal: approximately 2.04 MB.
  - Homepage: approximately 1.33 MB.
  - Map: approximately 1.30 MB.
  - Other primary routes: approximately 0.56–0.72 MB.
- The Field Journal client graph currently contains the complete eBird and iNaturalist datasets.
- The homepage and map currently share the detailed India geography payload.

These values are comparison baselines, not release limits. Later optimization work must record before-and-after values and must not increase a primary route without an explicit reason.

## Automated critical journeys

The Playwright suite protects:

1. Homepage search to a species profile.
2. Map deep links to a selected hotspot.
3. Representative hotspot and species detail routes.
4. Shareable Seasonal Planner filters.
5. Existing journal and expedition-trail hydration and persistence.
6. Theme persistence.
7. Mobile Hotspots and Species filter docks scrolling out of the way instead of covering result cards.

The suite runs in an isolated browser and never uses a visitor's real browser storage.

## Release gate

Every production-facing pull request must pass:

1. `npm run typecheck`
2. `npm test`
3. `npm run build`
4. `npm run test:e2e`
5. Preview review on desktop and mobile for the changed surface

Changes should remain independently reversible. If a critical journey fails after deployment, prefer rollback to an unreviewed production patch.
