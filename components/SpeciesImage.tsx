"use client";

import speciesImages from "@/data/species-images.json";
import { SpeciesVisual } from "./SpeciesVisual";

type ImageMeta = { src: string; width: number; height: number; author: string; license: string; filePage: string; title: string };
const images = speciesImages as Record<string, ImageMeta>;

export function SpeciesImage({
  slug,
  category,
  className,
  showCredit = true,
  alt = "",
  priority = false,
}: {
  slug: string;
  category: string;
  className?: string;
  showCredit?: boolean;
  alt?: string;
  priority?: boolean;
}) {
  const meta = images[slug];
  if (!meta) return <SpeciesVisual category={category} className={className} />;
  const positioned = className?.includes("absolute") ? "" : "relative ";

  return (
    <div className={`${positioned}overflow-hidden bg-forest-900 ${className ?? ""}`}>
      <img
        src={meta.src}
        alt={alt}
        className="h-full w-full object-cover"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      {showCredit && (
        <a
          href={meta.filePage}
          target="_blank"
          rel="noreferrer"
          onClick={(event) => event.stopPropagation()}
          className="absolute bottom-2 right-2 z-10 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 font-mono text-[9px] font-medium uppercase tracking-wider text-white/70 backdrop-blur-md transition hover:bg-black/70 hover:text-white focus-visible:text-white sm:bottom-3 sm:right-3"
        >
          {meta.author} · {meta.license}
        </a>
      )}
    </div>
  );
}
