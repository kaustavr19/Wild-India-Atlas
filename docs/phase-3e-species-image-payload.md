# Phase 3E — scalable species image payload

Phase 3E separates the data needed by catalogue cards from the complete attribution record needed on a species profile.

## What changed

- `data/extended-species-images.json` remains the canonical reviewed-image manifest, including source, author, license, dimensions, source asset, and file page.
- `data/extended-species-image-index.json` is generated from that manifest and contains only `slug -> local image path` entries for catalogue cards.
- Extended profile pages select one complete attribution record on the server and pass only that record to the image component.
- Listing cards still prefer a reviewed local image, then a legacy remote image, then the designed fallback.
- Profile image credits and links remain unchanged.

Regenerate the compact index after changing the canonical manifest:

```text
npm run build:species-image-index
```

## Payload baseline

At 60 reviewed extended-species images:

| Data | Bytes on disk |
| --- | ---: |
| Full attribution manifest | 36,512 |
| Compact listing index | 4,339 |
| Reduction | 88.1% |

At the current average entry size, a complete 949-bird compact index projects below 75 KB. Tests fail if the generated index drifts from the canonical manifest, exceeds the budget, or if a client image component imports the complete attribution manifest again.

## Safety

This is a data-delivery change only. It does not change species routes, card ordering, filters, image selection order, fallback visuals, or credit content. The canonical attribution data stays in one source of truth.
