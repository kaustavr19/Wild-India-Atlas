import type { ExtendedSpeciesImageMeta } from "./speciesImageAudit";

export type ExtendedSpeciesImageIndex = Record<string, string>;

export function buildExtendedSpeciesImageIndex(
  images: Record<string, ExtendedSpeciesImageMeta>,
): ExtendedSpeciesImageIndex {
  return Object.fromEntries(
    Object.entries(images)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([slug, image]) => [slug, image.src]),
  );
}
