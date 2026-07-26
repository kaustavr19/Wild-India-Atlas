# Phase 3F — inventory review batch 01

Recorded on 26 July 2026 from the ranked Phase 3D review-ready inventory.

## Review and publication result

- Candidates visually reviewed: **50**.
- Accepted and locally cached: **49**.
- Rejected after visual review: **1**.
- Extended reviewed-image manifest: **109**, up from 60.
- Fully attributable catalogue images: **130**, including 21 flagship species.
- Species still using the designed fallback: **840**, down from 889.
- Fully attributable catalogue coverage: **9.57%**, up from 5.96%.
- Real-photo display coverage, including legacy URL-only records: **38.19%**, up from 34.58%.

The batch was selected deterministically by atlas confirmation count and then slug. It includes Medium Egret, Verditer Flycatcher, Asian Openbill, Indian Roller, Plum-headed Parakeet, Orange-headed Thrush, Oriental Darter, Osprey, Brown Fish-Owl, Indian Robin, Purple Heron, River Tern, and 37 other widespread records.

## Rejection

`black-winged-stilt` remains on the designed fallback. Its exact-taxonomy Commons primary image depicts an egg specimen rather than the bird, so it is not suitable as the atlas species image. The record was not silently replaced through a fuzzy or alternate-name search.

## Asset and payload result

- New optimized WebP assets: **4,136,112 bytes** (about 3.94 MiB).
- Complete reviewed extended-image cache: **10,274,568 bytes** (about 9.80 MiB).
- Largest reviewed asset remains **445,846 bytes**, below the 500 KB per-image limit.
- Compact listing index: **7,923 bytes** for 109 images.
- Full attribution manifest: **66,507 bytes**.

Phase 3E keeps full attribution data out of client components. Species listings receive only the compact path index, while a profile receives its single complete credit record from the server.

## Repeatable workflow

The batch adds separate, deterministic commands for preparing contact sheets and promoting an explicitly reviewed result:

```text
npm run review:species-images -- --batch=1 --size=50
npm run promote:species-images -- --batch=1 --size=50 --reject=black-winged-stilt
npm run build:species-image-index
```

Review downloads are temporary and resumable. Promotion requires explicit rejected slugs and validates the exact Phase 3D metadata contract before changing the canonical manifest.
