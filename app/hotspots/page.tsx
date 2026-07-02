"use client";
import { useMemo, useState } from "react"; import { hotspots } from "@/data/hotspots"; import { HotspotCard } from "@/components/HotspotCard"; import { FilterPanel } from "@/components/FilterPanel"; import { EmptyState } from "@/components/EmptyState"; import { defaultFilters, filterHotspots } from "@/lib/filterHotspots";
export default function HotspotsPage(){
  const [filters,setFilters]=useState(defaultFilters);
  const visible=useMemo(()=>filterHotspots(hotspots,filters),[filters]);
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
    <p className="font-bold uppercase text-river">All hotspots</p>
    <h1 className="mt-2 text-4xl font-semibold text-forest-900">{hotspots.length} Indian wildlife destinations</h1>
    <p className="mt-3 max-w-2xl text-slate-700">From tiger reserves to Himalayan sanctuaries and mangrove coastlines — filter by region, wildlife, season, and experience to plan your next trip.</p>
    <div className="mt-8 grid gap-5 lg:grid-cols-[320px_1fr]">
      <FilterPanel filters={filters} setFilters={setFilters} onReset={()=>setFilters(defaultFilters)} />
      <div>
        <p className="mb-4 text-sm font-bold text-slate-500">{visible.length} {visible.length === 1 ? "place" : "places"}</p>
        {visible.length ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visible.map(h=><HotspotCard key={h.slug} hotspot={h}/>)}</div> : <EmptyState title="No hotspots match" body="Try a broader season, region, or wildlife type." />}
      </div>
    </div>
  </main>;
}
