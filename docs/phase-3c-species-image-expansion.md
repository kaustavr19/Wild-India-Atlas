# Phase 3C species image expansion

Recorded on 22 July 2026 after the Phase 3A audit and Phase 3B pilot were merged.

## Production change

Phase 3C adds two reviewed batches totalling 48 locally cached, fully attributed Wikimedia Commons images. Both batches are selected deterministically from the highest atlas-place coverage among extended eBird species that did not yet have a reviewed image.

The display resolver introduced in Phase 3B is unchanged: reviewed local image, legacy iNaturalist URL, then the illustrated species fallback. No database, CMS, runtime image lookup, route change, observation claim, or browser-storage migration is introduced.

## Reviewed batch

The expansion covers widespread atlas species including Indian Pond-Heron, White-throated Kingfisher, Common Kingfisher, Common Hoopoe, Black Kite, Eastern Cattle-Egret, Rose-ringed Parakeet, Common Tailorbird, Purple Sunbird, Indian White-eye, Red-wattled Lapwing, Asian Koel, Coppersmith Barbet, Indian Peafowl, Pied Kingfisher, Little Egret, Greater Coucal, and Black-rumped Flameback.

Every accepted entry was checked for:

- an exact canonical scientific-name match;
- an approved CC BY or CC BY-SA licence;
- a stable Wikimedia Commons file page, author, and source asset;
- a usable species-focused crop;
- a complete local WebP file below 500 KB.

Shikra was deliberately left on the designed fallback because the atlas uses `Tachyspiza badia` and Wikidata did not return a primary image for that exact current taxon name. The sourcing workflow reports this as a manual-review candidate rather than silently matching an older name.

## Coverage after Phase 3C

- Total displayed species: **1,359**.
- Fully attributable licensed images: **81** (**5.96%**), up from 33.
- Licensed extended-species images: **60**, up from 12.
- Legacy URL-only iNaturalist photos: **389**.
- Species using the designed fallback: **889**, down from 937.
- Real-photo display coverage: **34.58%**, up from 31.05%.
- Visual coverage, including deliberate fallbacks: **100%**.
- New Phase 3C assets: **4,220,204 bytes** (about 4.02 MiB), with every file below 500 KB.
- Complete reviewed extended-image cache: **6,138,456 bytes** (about 5.85 MiB).

## Scaling improvements

The source lookup now retries transient rate limits, respects bounded backoff, paces requests, and reports per-species taxonomy gaps without discarding successful candidates. The cache command accepts a targeted `--slugs` batch, skips completed files by default, supports `--force`, continues past individual failures, and reports any incomplete files at the end.

Wikimedia standard thumbnail widths are used for the assets that require cached derivatives. This reduces transfer and repository weight while following Wikimedia's current direct-thumbnail requirements.

## Release gate

Phase 3C is accepted only when the deterministic image audit, unit coverage contract, production build, and desktop/mobile browser checks all pass. Browser coverage now exercises an Indian Peafowl card and profile hero from the second Phase 3C batch plus the Shikra fallback case.
