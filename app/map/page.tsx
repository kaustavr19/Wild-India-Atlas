"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Compass, List, Map as MapIcon, MousePointer2 } from "lucide-react";
import { hotspots } from "@/data/hotspots";
import { ecosystem } from "@/data/ecosystems";
import type { Hotspot, Region, Season } from "@/data/types";
import { defaultFilters, filterHotspots, type HotspotFilters } from "@/lib/filterHotspots";
import { biomeClassName } from "@/lib/experienceDesign";
import { haversineKm } from "@/lib/geo";
import { FilterPanel } from "@/components/FilterPanel";
import { HotspotCard } from "@/components/HotspotCard";
import { HotspotPreviewCard } from "@/components/HotspotPreviewCard";
import { IndiaMap, LAYER_KEYS, type LayerKey, type MapViewState } from "@/components/IndiaMap";
import { EmptyState } from "@/components/EmptyState";

function MapExperience() {
  const params = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<HotspotFilters>(() => ({
    ...defaultFilters,
    query: params.get("query") ?? "",
    region: (params.get("region") as HotspotFilters["region"] | null) ?? "All",
    wildlifeType: (params.get("wildlifeType") as HotspotFilters["wildlifeType"] | null) ?? "All",
    experience: params.get("experience") ?? "All",
    season: (params.get("season") as Season | null) ?? "All",
    difficulty: (params.get("difficulty") as HotspotFilters["difficulty"] | null) ?? "All",
  }));
  const visible = useMemo(() => filterHotspots(hotspots, filters), [filters]);
  const [selected, setSelected] = useState<Hotspot | undefined>(() => hotspots.find((hotspot) => hotspot.slug === params.get("place")));
  const [mapState, setMapState] = useState<MapViewState>(() => {
    const layerParam = params.get("layers")?.split(",") ?? [];
    const layers = layerParam.filter((value): value is LayerKey => LAYER_KEYS.includes(value as LayerKey));
    const focus = params.get("focus") as Region | null;
    const validRegions = new Set<Region>(hotspots.map((hotspot) => hotspot.region));
    return { layers, region: focus && validRegions.has(focus) ? focus : undefined };
  });
  const [panelOpen, setPanelOpen] = useState(true);
  const [tab, setTab] = useState<"map" | "list">("map");
  const active = selected && visible.some((hotspot) => hotspot.slug === selected.slug) ? selected : undefined;
  const atmosphere = active ? biomeClassName[ecosystem[active.slug] ?? "forest"] : "biome-marine";
  const nearby = useMemo(() => active ? hotspots
    .filter((hotspot) => hotspot.slug !== active.slug)
    .map((hotspot) => ({ hotspot, distanceKm: haversineKm(active.coordinates, hotspot.coordinates) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 3) : [], [active]);

  useEffect(() => {
    if (selected && !visible.some((hotspot) => hotspot.slug === selected.slug)) setSelected(undefined);
  }, [selected, visible]);

  useEffect(() => {
    const next = new URLSearchParams();
    if (filters.query) next.set("query", filters.query);
    if (filters.region !== "All") next.set("region", filters.region);
    if (filters.wildlifeType !== "All") next.set("wildlifeType", filters.wildlifeType);
    if (filters.experience !== "All") next.set("experience", filters.experience);
    if (filters.season !== "All") next.set("season", filters.season);
    if (filters.difficulty !== "All") next.set("difficulty", filters.difficulty);
    if (active) next.set("place", active.slug);
    if (mapState.layers.length) next.set("layers", mapState.layers.join(","));
    if (mapState.region) next.set("focus", mapState.region);
    const query = next.toString();
    router.replace(query ? `/map?${query}` : "/map", { scroll: false });
  }, [active, filters, mapState, router]);

  const updateMapState = useCallback((next: MapViewState) => {
    setMapState((current) => current.region === next.region && current.layers.join(",") === next.layers.join(",") ? current : next);
  }, []);

  function select(hotspot: Hotspot) {
    setSelected(hotspot);
    setPanelOpen(true);
    setTab("map");
  }

  function resetFilters() {
    setFilters(defaultFilters);
    setSelected(undefined);
  }

  return (
    <main className={`biome-surface ${atmosphere} texture-topography relative min-h-screen overflow-x-clip overflow-y-visible px-4 pb-10 pt-24 text-biome-ink transition-colors duration-700 sm:px-6 sm:pt-28`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_8%,rgba(255,255,255,0.08),transparent_28%)]" />
      <div className="relative mx-auto max-w-[1680px]">
        <header className="grid gap-7 border-b border-white/12 pb-7 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="field-label flex items-center gap-2 text-biome-accent"><Compass size={14} /> Live field map · India</p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl font-medium leading-[0.95] text-biome-ink sm:text-6xl">Read the wild from above.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-biome-ink/62 sm:text-base">Begin with a region, descend into an ecosystem, then follow the field signals to a place worth knowing slowly.</p>
          </div>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-field border border-white/12 bg-white/12 text-center">
            <div className="bg-black/18 px-5 py-3">
              <p className="font-display text-3xl text-biome-ink">{visible.length}</p>
              <p className="field-label mt-1 text-biome-ink/45">Visible places</p>
            </div>
            <div className="bg-black/18 px-5 py-3">
              <p className="font-display text-3xl text-biome-ink">{new Set(visible.map((hotspot) => hotspot.region)).size}</p>
              <p className="field-label mt-1 text-biome-ink/45">Regions</p>
            </div>
          </div>
        </header>

        <div className="mt-5 flex gap-2 lg:hidden">
          <button aria-pressed={tab === "map"} onClick={() => setTab("map")} className={`atlas-chip flex flex-1 items-center justify-center ${tab === "map" ? "border-biome-accent bg-biome-accent text-biome-surface" : ""}`}><MapIcon size={14} />Map</button>
          <button aria-pressed={tab === "list"} onClick={() => setTab("list")} className={`atlas-chip flex flex-1 items-center justify-center ${tab === "list" ? "border-biome-accent bg-biome-accent text-biome-surface" : ""}`}><List size={14} />Field index ({visible.length})</button>
        </div>

        <div className="relative mt-5 grid min-h-0 gap-5 lg:h-[calc(100svh-17rem)] lg:min-h-[620px] lg:grid-cols-[350px_minmax(0,1fr)]">
          <aside className={`${tab === "list" ? "flex" : "hidden"} h-[72svh] min-h-[560px] max-h-[760px] flex-col overflow-hidden rounded-field border border-white/12 bg-black/18 backdrop-blur-xl lg:flex lg:h-auto lg:min-h-0 lg:max-h-none`}>
            <div className="border-b border-white/10 p-4">
              <FilterPanel variant="atlas" filters={filters} setFilters={setFilters} onReset={resetFilters} />
            </div>
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="field-label text-biome-accent">Field index</p>
                <p className="mt-1 text-sm text-biome-ink/55">Select a place to reveal its route.</p>
              </div>
              <MousePointer2 size={16} className="text-biome-accent" />
            </div>
            <section className="grid min-h-0 content-start gap-2 overflow-y-auto p-3 atlas-scrollbar">
              {visible.length ? visible.map((hotspot) => (
                <HotspotCard key={hotspot.slug} hotspot={hotspot} compact tone="atlas" active={active?.slug === hotspot.slug} onSelect={() => select(hotspot)} />
              )) : (
                <EmptyState title="No field signals" body="Try a broader season, region, or wildlife type." />
              )}
            </section>
          </aside>

          <div data-testid="map-canvas" className={`${tab === "map" ? "block" : "hidden"} relative min-h-0 min-w-0 lg:block`}>
            <IndiaMap hotspots={visible} selectedSlug={active?.slug} onSelect={select} initialLayers={mapState.layers} initialRegion={mapState.region} onStateChange={updateMapState} />
          </div>

          {active && panelOpen && <HotspotPreviewCard hotspot={active} nearby={nearby} onSelect={select} docked onClose={() => setPanelOpen(false)} />}
        </div>
      </div>
    </main>
  );
}

export default function MapPage() {
  return <Suspense><MapExperience /></Suspense>;
}
