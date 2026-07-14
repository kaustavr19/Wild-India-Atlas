"use client";
import type { HotspotType } from "@/data/types";
import hotspotImages from "@/data/hotspot-images.json";
import { HotspotVisual } from "./HotspotVisual";

type ImageMeta = { src: string; width: number; height: number; author: string; license: string; filePage: string; title: string };
const images = hotspotImages as Record<string, ImageMeta>;

export function HotspotImage({ slug, type, className, showCredit = true }: { slug: string; type: HotspotType; className?: string; showCredit?: boolean }) {
  const meta = images[slug];
  if (!meta) return <HotspotVisual type={type} className={className} />;
  const positioned = className?.includes("absolute") ? "" : "relative ";
  return (
    <div className={positioned + "overflow-hidden bg-forest-900 " + (className ?? "")}>
      <img src={meta.src} alt="" className="h-full w-full object-cover" loading="lazy" />
      {showCredit && (
        // Quiet by default (small, low-opacity chip) rather than fully invisible — the
        // credit stays genuinely visible at a glance, not just discoverable by guessing to
        // hover — and brightens to full contrast on hover *or* keyboard focus. Real
        // tabIndex/onKeyDown (not tabIndex={-1}) so it's actually reachable and operable
        // from the keyboard, not just present-but-unusable for screen reader users. Stays a
        // span with role="link" rather than a real <a>, since this is nested inside a
        // clickable <Link> tile/card in several call sites and a real anchor can't nest
        // inside another anchor.
        <span
          role="link"
          tabIndex={0}
          onClick={(e) => { e.stopPropagation(); e.preventDefault(); window.open(meta.filePage, "_blank", "noopener,noreferrer"); }}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); window.open(meta.filePage, "_blank", "noopener,noreferrer"); } }}
          className="absolute bottom-1.5 right-1.5 cursor-pointer rounded bg-black/30 px-1.5 py-0.5 text-[9px] font-medium text-white/60 opacity-70 outline-none transition hover:bg-black/60 hover:text-white hover:opacity-100 focus-visible:bg-black/60 focus-visible:text-white focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-white/70 group-hover:bg-black/60 group-hover:text-white group-hover:opacity-100"
        >
          Photo: {meta.author} · {meta.license}
        </span>
      )}
    </div>
  );
}
