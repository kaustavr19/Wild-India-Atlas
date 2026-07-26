"use client";

import extendedSpeciesImageIndex from "@/data/extended-species-image-index.json";
import type { ExtendedSpeciesImageMeta } from "@/lib/speciesImageAudit";
import { SpeciesVisual } from "./SpeciesVisual";

const imageIndex = extendedSpeciesImageIndex as Record<string, string>;

export function ExtendedSpeciesImage({
  slug,
  category,
  fallbackPhotoUrl,
  licensedImage,
  className,
  imageClassName,
  showCredit = true,
  alt = "",
  priority = false,
}: {
  slug: string;
  category: string;
  fallbackPhotoUrl?: string;
  licensedImage?: ExtendedSpeciesImageMeta;
  className?: string;
  imageClassName?: string;
  showCredit?: boolean;
  alt?: string;
  priority?: boolean;
}) {
  const src = licensedImage?.src ?? imageIndex[slug];
  const positioned = className?.includes("absolute") ? "" : "relative ";

  if (src) {
    return (
      <div data-species-image-kind="licensed" data-species-image-source={licensedImage?.source} className={`${positioned}overflow-hidden bg-forest-900 ${className ?? ""}`}>
        <img src={src} alt={alt} className={`${imageClassName ?? ""} h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]`} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
        {showCredit && licensedImage && (
          <a href={licensedImage.filePage} target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()} className="absolute bottom-2 right-2 z-10 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider text-white/75 backdrop-blur-md transition hover:bg-black/75 hover:text-white focus-visible:text-white sm:bottom-3 sm:right-3">
            {licensedImage.author} · {licensedImage.license}
          </a>
        )}
      </div>
    );
  }

  if (fallbackPhotoUrl) {
    return (
      <div data-species-image-kind="legacy" className={`${positioned}overflow-hidden bg-forest-900 ${className ?? ""}`}>
        <img src={fallbackPhotoUrl} alt={alt} className={`${imageClassName ?? ""} h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]`} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} />
      </div>
    );
  }

  return (
    <div data-species-image-kind="fallback" className={`${positioned}overflow-hidden ${className ?? ""}`}>
      <SpeciesVisual category={category} className={`${imageClassName ?? ""} absolute inset-0 h-full w-full`} />
    </div>
  );
}
