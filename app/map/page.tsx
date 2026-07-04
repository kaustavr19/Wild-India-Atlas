"use client";
import { Suspense, useMemo, useState } from "react"; import { useSearchParams } from "next/navigation"; import { Map as MapIcon, List } from "lucide-react"; import { hotspots } from "@/data/hotspots"; import type { Hotspot, Season } from "@/data/types"; import { defaultFilters, filterHotspots, type HotspotFilters } from "@/lib/filterHotspots"; import { FilterPanel } from "@/components/FilterPanel"; import { HotspotCard } from "@/components/HotspotCard"; import { HotspotPreviewCard } from "@/components/HotspotPreviewCard"; import { IndiaMap } from "@/components/IndiaMap"; import { EmptyState } from "@/components/EmptyState";
function MapExperience(){
  const params=useSearchParams();
  const [filters,setFilters]=useState<HotspotFilters>({...defaultFilters, query: params.get('query') ?? '', season: (params.get('season') as Season | null) ?? 'All'});
  const visible=useMemo(()=>filterHotspots(hotspots,filters),[filters]);
  const [selected,setSelected]=useState<Hotspot | undefined>(undefined);
  const [panelOpen,setPanelOpen]=useState(true);
  const [tab,setTab]=useState<"map"|"list">("map");
  const active=selected && visible.some(h=>h.slug===selected.slug) ? selected : undefined;
  function select(h: Hotspot){ setSelected(h); setPanelOpen(true); }
  return <main className="mx-auto flex max-w-[1680px] flex-col px-4 pb-4 pt-24 sm:px-6 sm:pt-28 lg:h-screen lg:pb-6">
    <div className="shrink-0">
      <FilterPanel horizontal filters={filters} setFilters={setFilters} onReset={()=>setFilters(defaultFilters)} />

      <div className="mt-4 flex gap-2 lg:hidden">
        <button onClick={()=>setTab("map")} className={"flex flex-1 items-center justify-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide transition " + (tab==="map" ? "border-forest-700 bg-forest-700 text-white" : "border-forest-700/20 text-forest-700 dark:border-white/15 dark:text-forest-300")}><MapIcon size={14}/>Map</button>
        <button onClick={()=>setTab("list")} className={"flex flex-1 items-center justify-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wide transition " + (tab==="list" ? "border-forest-700 bg-forest-700 text-white" : "border-forest-700/20 text-forest-700 dark:border-white/15 dark:text-forest-300")}><List size={14}/>List ({visible.length})</button>
      </div>
    </div>

    <div className="mt-4 grid min-h-0 flex-1 gap-6 lg:grid-cols-[380px_1fr]">
      <section className={(tab==="list" ? "grid" : "hidden") + " min-w-0 content-start gap-2 lg:grid lg:h-full lg:overflow-y-auto lg:border-r lg:border-forest-700/15 lg:pr-6 dark:lg:border-white/10"}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-forest-900">Wildlife map</h1>
          <span className="hidden font-mono text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400 lg:inline">{visible.length} places</span>
        </div>
        {visible.length ? visible.map(h=><HotspotCard key={h.slug} hotspot={h} compact active={active?.slug===h.slug} onSelect={()=>select(h)}/>) : <EmptyState title="No hotspots match" body="Try a broader season, region, or wildlife type." />}
      </section>
      <div className={(tab==="map" ? "block" : "hidden") + " relative min-w-0 lg:block lg:h-full"}>
        <IndiaMap hotspots={visible} selectedSlug={active?.slug} onSelect={select}/>
        {active && panelOpen && <HotspotPreviewCard hotspot={active} docked onClose={()=>setPanelOpen(false)}/>}
      </div>
    </div>
  </main>;
}
export default function MapPage(){ return <Suspense><MapExperience /></Suspense>; }
