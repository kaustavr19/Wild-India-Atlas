import Link from "next/link"; import { ArrowRight, Camera, CalendarDays, Landmark, MapPin, Plane, ShieldCheck, TrainFront, X } from "lucide-react"; import type { Hotspot } from "@/data/types"; import { Tag } from "./Tag"; import { HotspotImage } from "./HotspotImage"; import { permitPortalUrl } from "@/data/officialLinks";

export function HotspotPreviewCard({ hotspot, docked, onClose }: { hotspot: Hotspot; docked?: boolean; onClose?: () => void }) {
  if (docked) {
    return (
      <article className="pointer-events-auto absolute inset-x-3 bottom-3 z-20 overflow-hidden rounded-sm border border-white/15 bg-forest-900/95 shadow-lg backdrop-blur-xl sm:inset-x-4 sm:bottom-4">
        <div className="flex gap-3 p-3 sm:gap-4 sm:p-4">
          <HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-20 w-20 shrink-0 rounded-sm sm:h-24 sm:w-24" showCredit={false} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-1 text-xs font-semibold text-flare"><MapPin size={12} />{hotspot.state} · {hotspot.region}</p>
                <h2 className="mt-0.5 truncate text-lg font-semibold text-white sm:text-xl">{hotspot.name}</h2>
              </div>
              {onClose && <button onClick={onClose} aria-label="Close" className="shrink-0 rounded-sm p-1 text-white/60 hover:bg-white/10 hover:text-white"><X size={16} /></button>}
            </div>
            <p className="mt-1 hidden text-xs text-white/70 sm:line-clamp-1 sm:block">{hotspot.summary}</p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {hotspot.mainSpecies.slice(0,2).map(s=><Tag key={s} tone="green">{s}</Tag>)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-sm bg-white/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{hotspot.type}</span>
              <span className="hidden font-mono text-[10px] uppercase tracking-wide text-white/50 sm:inline">Best: {hotspot.bestMonths.slice(0,4).join(", ")}</span>
              <span className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-white/50 sm:inline-flex"><ShieldCheck size={11} />{hotspot.difficulty}</span>
              {hotspot.experienceTags.includes("Photography") && <span className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-white/50 sm:inline-flex"><Camera size={11} />Photography-friendly</span>}
              {permitPortalUrl[hotspot.slug] ? (
                <a href={permitPortalUrl[hotspot.slug]} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()} className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-flare hover:underline md:inline-flex"><Landmark size={11} />Permits</a>
              ) : (
                <span className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-white/50 md:inline-flex"><Landmark size={11} />{hotspot.permitRequired}</span>
              )}
              {hotspot.nearestAirport && <span className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-white/50 md:inline-flex"><Plane size={11} />{hotspot.nearestAirport}</span>}
              {hotspot.nearestRailway && <span className="hidden items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-white/50 lg:inline-flex"><TrainFront size={11} />{hotspot.nearestRailway}</span>}
              <Link href={"/hotspots/" + hotspot.slug} className="ml-auto inline-flex items-center gap-1 rounded-sm bg-flare px-3 py-1.5 text-xs font-bold text-forest-900 hover:bg-white">View details <ArrowRight size={13} /></Link>
            </div>
          </div>
        </div>
      </article>
    );
  }
  return <article className="field-card group overflow-hidden rounded-sm"><div className="relative"><HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-44 w-full"/><div className="absolute inset-0 bg-gradient-to-t from-forest-900/75 via-forest-900/10 to-transparent"/><div className="absolute right-4 top-4 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{hotspot.type}</div><div className="absolute bottom-4 left-4 text-white"><p className="flex items-center gap-1 text-sm font-semibold text-flare"><MapPin size={15}/>{hotspot.state} · {hotspot.region}</p><h2 className="mt-1 text-2xl font-semibold">{hotspot.name}</h2></div></div><div className="p-5"><p className="text-sm text-slate-700 dark:text-slate-300">{hotspot.summary}</p><div className="mt-4 flex flex-wrap gap-2">{hotspot.mainSpecies.slice(0,4).map(s=><Tag key={s}>{s}</Tag>)}{hotspot.experienceTags.slice(0,2).map(s=><Tag key={s} tone="blue">{s}</Tag>)}</div><p className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><CalendarDays size={16}/>Best months: {hotspot.bestMonths.join(", ")}</p><Link href={"/hotspots/" + hotspot.slug} className="mt-4 inline-flex items-center gap-2 rounded-sm bg-forest-700 px-4 py-2 text-sm font-bold text-white hover:bg-forest-900 dark:hover:bg-forest-500">View details <ArrowRight size={16}/></Link></div></article>;
}
