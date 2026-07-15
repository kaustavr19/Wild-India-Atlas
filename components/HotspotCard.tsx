import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Hotspot } from "@/data/types";
import { ecosystem } from "@/data/ecosystems";
import { Tag } from "./Tag";
import { HotspotImage } from "./HotspotImage";
import { closureInfo } from "@/data/closures";
import { ConfidenceDot } from "./FreshnessBadge";

export function HotspotCard({ hotspot, active, onSelect, compact, tone = "default" }: {
  hotspot: Hotspot;
  active?: boolean;
  onSelect?: () => void;
  compact?: boolean;
  tone?: "default" | "atlas";
}) {
  const closure = closureInfo[hotspot.slug];
  const atlas = tone === "atlas";
  const body = compact ? (
    <article className={`${atlas ? "border-white/10 bg-white/[0.045] text-biome-ink hover:border-biome-accent/55 hover:bg-white/[0.08]" : "field-card hover:-translate-y-0.5"} group flex items-center gap-3 overflow-hidden rounded-field border p-2.5 transition ${active ? "border-biome-accent bg-white/10 shadow-[0_0_0_1px_rgb(var(--biome-accent-rgb)/0.45)]" : ""}`}>
      <HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-16 w-16 shrink-0 rounded-sm" showCredit={false} />
      <div className="min-w-0 flex-1">
        {atlas && <p className="field-label truncate text-biome-accent">{ecosystem[hotspot.slug]} · {hotspot.region}</p>}
        <h3 className={`${atlas ? "mt-1 font-display text-[17px] font-medium text-biome-ink" : "font-bold text-forest-900"} truncate`}>{hotspot.name}</h3>
        <p className={`${atlas ? "text-biome-ink/48" : "text-slate-600 dark:text-slate-400"} mt-0.5 flex items-center gap-1 text-xs`}><MapPin size={12} className="shrink-0" /><span className="truncate">{hotspot.state}</span>{closure && <ConfidenceDot confidence={closure.confidence} onDark={atlas} className="ml-1" />}</p>
      </div>
    </article>
  ) : (
    <article className={`field-card group overflow-hidden rounded-sm transition hover:-translate-y-0.5 hover:shadow-field ${active ? "ring-2 ring-amberfield" : ""}`}>
      <div className="relative"><HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-36 w-full" /><div className="absolute right-3 top-3 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-sand">{hotspot.type}</div></div>
      <div className="p-4"><h3 className="font-bold text-forest-900">{hotspot.name}</h3><p className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400"><MapPin size={14} />{hotspot.state}{closure && <ConfidenceDot confidence={closure.confidence} className="ml-1" />}</p><p className="mt-3 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">{hotspot.summary}</p><div className="mt-3 flex flex-wrap gap-2">{hotspot.mainSpecies.slice(0, 3).map((species) => <Tag key={species}>{species}</Tag>)}</div><p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Best: {hotspot.bestMonths.slice(0, 5).join(", ")}</p></div>
    </article>
  );
  return onSelect ? <button data-hotspot-slug={hotspot.slug} className="w-full min-w-0 text-left" onClick={onSelect}>{body}</button> : <Link className="block min-w-0" href={`/hotspots/${hotspot.slug}`}>{body}</Link>;
}
