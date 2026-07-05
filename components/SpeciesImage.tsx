"use client";
import speciesImages from "@/data/species-images.json";
import { SpeciesVisual } from "./SpeciesVisual";

type ImageMeta = { src: string; width: number; height: number; author: string; license: string; filePage: string; title: string };
const images = speciesImages as Record<string, ImageMeta>;

export function SpeciesImage({ slug, category, className, showCredit = true }: { slug: string; category: string; className?: string; showCredit?: boolean }) {
  const meta = images[slug];
  if (!meta) return <SpeciesVisual category={category} className={className} />;
  const positioned = className?.includes("absolute") ? "" : "relative ";
  return (
    <div className={positioned + "overflow-hidden bg-forest-900 " + (className ?? "")}>
      <img src={meta.src} alt="" className="h-full w-full object-cover" loading="lazy" />
      {showCredit && (
        <span
          role="link"
          tabIndex={-1}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(meta.filePage, "_blank", "noopener,noreferrer"); }}
          className="absolute bottom-1.5 right-1.5 cursor-pointer rounded bg-black/45 px-1.5 py-0.5 text-[10px] font-medium text-white/80 opacity-0 transition hover:text-white group-hover:opacity-100"
        >
          Photo: {meta.author} · {meta.license}
        </span>
      )}
    </div>
  );
}
