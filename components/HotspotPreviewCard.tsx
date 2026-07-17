import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Navigation, X } from "lucide-react";
import type { Hotspot } from "@/data/types";
import { ecosystem } from "@/data/ecosystems";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";
import { Tag } from "./Tag";
import { HotspotImage } from "./HotspotImage";
import { closureInfo } from "@/data/closures";
import { ConfidenceDot } from "./FreshnessBadge";
import { JournalSaveButton } from "./JournalSaveButton";

export function HotspotPreviewCard({ hotspot, docked, onClose, nearby = [], onSelect }: {
  hotspot: Hotspot;
  docked?: boolean;
  onClose?: () => void;
  nearby?: Array<{ hotspot: Hotspot; distanceKm: number }>;
  onSelect?: (hotspot: Hotspot) => void;
}) {
  const closure = closureInfo[hotspot.slug];
  const biome = ecosystem[hotspot.slug] ?? "forest";
  const theme = biomeThemes.find((item) => item.key === biome);

  if (docked) {
    return (
      <article aria-live="polite" className={`biome-surface ${biomeClassName[biome]} pointer-events-auto relative z-20 w-full scroll-m-3 overflow-visible rounded-field border border-white/18 shadow-lift lg:absolute lg:bottom-5 lg:left-[390px] lg:max-h-[calc(100%-2.5rem)] lg:w-[min(540px,calc(100%-410px))] lg:scroll-m-5 lg:overflow-y-auto lg:overscroll-contain`}>
        <div className="grid sm:grid-cols-[160px_1fr]">
          <HotspotImage slug={hotspot.slug} type={hotspot.type} className="hidden h-full min-h-[220px] sm:block" />
          <div className="relative p-3 sm:p-5">
            {onClose && <button onClick={onClose} aria-label="Close selected place" className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full border border-white/15 text-biome-ink/55 transition hover:border-biome-accent hover:text-biome-accent sm:right-3 sm:top-3 sm:h-8 sm:w-8"><X size={15} /></button>}
            <p className="field-label max-w-[calc(100%-2rem)] text-biome-accent">{theme?.label ?? biome} · {hotspot.region}</p>
            <h2 className="mt-1 pr-10 font-display text-xl font-medium leading-tight text-biome-ink sm:mt-2 sm:pr-8 sm:text-3xl">{hotspot.name}</h2>
            <p className="mt-2 flex items-center gap-1 text-xs text-biome-ink/52"><MapPin size={12} />{hotspot.state}{closure && <ConfidenceDot confidence={closure.confidence} onDark className="ml-1" />}</p>
            <p className="mt-4 hidden line-clamp-2 text-sm leading-6 text-biome-ink/68 sm:block">{hotspot.summary}</p>
            <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">{hotspot.mainSpecies.slice(0, 3).map((species) => <Tag key={species} tone="green">{species}</Tag>)}</div>
            {nearby.length > 0 && (
              <div className="mt-2 border-t border-white/12 pt-2 sm:mt-4 sm:pt-3">
                <p className="field-label flex items-center gap-1.5 text-biome-accent"><Navigation size={11} /> Continue nearby</p>
                <div className="atlas-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
                  {nearby.map(({ hotspot: next, distanceKm }) => (
                    <button key={next.slug} data-nearby-slug={next.slug} onClick={() => onSelect?.(next)} aria-label={`Travel to ${next.name}, ${Math.round(distanceKm)} kilometres away`} className="min-h-11 shrink-0 rounded-full border border-white/14 bg-white/[0.06] px-3 py-2 text-left text-xs font-semibold text-biome-ink/72 transition hover:border-biome-accent hover:text-biome-accent">
                      {next.name.replace(/ National Park| Tiger Reserve| Wildlife Sanctuary| Bird Sanctuary/g, "")} <span className="ml-1 font-mono text-[9px] text-biome-ink/38">{Math.round(distanceKm)} km</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-2 flex items-center gap-3 border-t border-white/12 pt-2 sm:mt-4 sm:pt-4">
              <span className="field-label hidden min-w-0 items-center gap-1.5 truncate text-biome-ink/48 sm:flex"><CalendarDays size={12} />Best {hotspot.bestMonths.slice(0, 4).join(" · ")}</span>
              <JournalSaveButton type="hotspot" slug={hotspot.slug} tone="dark" compact />
              <Link href={`/hotspots/${hotspot.slug}`} className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-biome-accent px-4 py-2 text-xs font-bold text-biome-surface transition hover:bg-white">Open field guide <ArrowRight size={13} /></Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="field-card group overflow-hidden rounded-sm">
      <div className="relative"><HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-44 w-full" /><div className="absolute inset-0 bg-gradient-to-t from-forest-900/75 via-forest-900/10 to-transparent" /><div className="absolute right-4 top-4 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-sand">{hotspot.type}</div><div className="absolute bottom-4 left-4 text-white"><p className="flex items-center gap-1 text-sm font-semibold text-sand"><MapPin size={15} />{hotspot.state} · {hotspot.region}{closure && <ConfidenceDot confidence={closure.confidence} onDark className="ml-0.5" />}</p><h2 className="mt-1 text-2xl font-semibold">{hotspot.name}</h2></div></div>
      <div className="p-5"><p className="text-sm text-slate-700 dark:text-slate-300">{hotspot.summary}</p><div className="mt-4 flex flex-wrap gap-2">{hotspot.mainSpecies.slice(0, 4).map((species) => <Tag key={species}>{species}</Tag>)}{hotspot.experienceTags.slice(0, 2).map((experience) => <Tag key={experience} tone="blue">{experience}</Tag>)}</div><p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><CalendarDays size={16} />Best months: {hotspot.bestMonths.join(", ")}</p><Link href={`/hotspots/${hotspot.slug}`} className="mt-4 inline-flex items-center gap-2 rounded-sm bg-forest-700 px-4 py-2 text-sm font-bold text-white hover:bg-forest-900 dark:hover:bg-forest-500">View details <ArrowRight size={16} /></Link></div>
    </article>
  );
}
