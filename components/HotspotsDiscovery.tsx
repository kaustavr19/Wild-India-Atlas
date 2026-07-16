"use client";

import Link from "next/link";
import { ArrowRight, Binoculars, Compass, Fish, Leaf, Map, MapPin, MountainSnow, SearchX, Sun, TreePine, Waves } from "lucide-react";
import { useMemo, useState } from "react";
import { hotspots } from "@/data/hotspots";
import { closureInfo } from "@/data/closures";
import { ecosystem, type Ecosystem } from "@/data/ecosystems";
import type { Hotspot } from "@/data/types";
import { filterHotspots, defaultFilters } from "@/lib/filterHotspots";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";
import { FilterPanel } from "@/components/FilterPanel";
import { HotspotImage } from "@/components/HotspotImage";
import { JournalSaveButton } from "@/components/JournalSaveButton";
import { ConfidenceDot } from "@/components/FreshnessBadge";

const ecosystemOrder: Ecosystem[] = ["forest", "wetland", "desert", "alpine", "mangrove", "marine"];
const ecosystemIcon: Record<Ecosystem, typeof TreePine> = { forest: TreePine, wetland: Waves, desert: Sun, alpine: MountainSnow, mangrove: Leaf, marine: Fish };
const PAGE_SIZE = 12;

export function HotspotsDiscovery() {
  const [filters, setFilters] = useState(defaultFilters);
  const [landscape, setLandscape] = useState<Ecosystem | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const featured = hotspots.find((item) => item.slug === "kaziranga-national-park") ?? hotspots[0];
  const filtered = useMemo(() => filterHotspots(hotspots, filters).filter((item) => landscape === "all" || ecosystem[item.slug] === landscape), [filters, landscape]);
  const visible = filtered.slice(0, visibleCount);
  const lead = visible[0];
  const rest = visible.slice(1);

  function updateFilters(next: typeof filters) { setFilters(next); setVisibleCount(PAGE_SIZE); }
  function selectLandscape(next: Ecosystem | "all") { setLandscape(next); setVisibleCount(PAGE_SIZE); }
  function reset() { setFilters(defaultFilters); setLandscape("all"); setVisibleCount(PAGE_SIZE); }

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="biome-surface biome-wetland texture-grain relative flex min-h-[88svh] items-end overflow-hidden border-b border-white/10">
        <HotspotImage slug={featured.slug} type={featured.type} className="hero-ken-burns absolute inset-0 -z-20 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,38,47,0.98)_0%,rgba(10,38,47,0.88)_42%,rgba(10,38,47,0.25)_76%,rgba(10,38,47,0.12)_100%),linear-gradient(0deg,rgba(10,38,47,0.92)_0%,transparent_55%)]" />
        <div className="texture-topography absolute inset-0 -z-[5] opacity-35" />
        <div className="relative z-[2] mx-auto grid w-full max-w-[90rem] items-end gap-10 px-4 pb-14 pt-32 sm:px-6 sm:pb-20 lg:grid-cols-[1fr_340px] lg:px-10">
          <div className="motion-reveal max-w-5xl">
            <p className="field-label flex items-center gap-3 text-biome-accent"><span className="h-px w-8 bg-biome-accent" /> 42 field sites · 6 living landscapes</p>
            <h1 className="display-hero mt-7 max-w-[11ch] text-biome-ink">Choose a landscape.<br /><em className="text-biome-accent">Follow what lives there.</em></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-biome-ink/68 sm:text-xl sm:leading-9">Enter India through floodplains, forest tracks, high passes and tidal edges—then read the season, species and access signals before you travel.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#landscapes" className="atlas-button"><Compass size={15} /> Choose a landscape</a><Link href="/map" className="atlas-button atlas-button-ghost"><Map size={15} /> Open the living atlas</Link></div>
          </div>
          <aside className="shell-chrome rounded-field p-5">
            <p className="field-label text-biome-accent">First descent · Northeast</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-biome-ink">{featured.name}</h2>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-biome-ink/48"><MapPin size={13} />{featured.state}</p>
            <p className="mt-5 text-sm leading-6 text-biome-ink/66">{featured.summary}</p>
            <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4"><span className="field-label text-biome-ink/42">Best · {featured.bestMonths.slice(0, 4).join(" · ")}</span><Link href={`/hotspots/${featured.slug}`} aria-label={`Open ${featured.name} field guide`} className="grid h-11 w-11 place-items-center rounded-full bg-biome-accent text-biome-surface"><ArrowRight size={16} /></Link></div>
          </aside>
        </div>
      </section>

      <section id="landscapes" className="scroll-mt-28 border-b border-forest-900/10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="field-label text-forest-700">Begin with habitat</p>
          <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="display-section max-w-4xl text-forest-900">Six ways into the wild.</h2><p className="max-w-md text-sm leading-7 text-slate-600">Every landscape changes what you can see, how you move and when the journey makes sense.</p></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ecosystemOrder.map((key) => <LandscapePortal key={key} ecosystemKey={key} active={landscape === key} count={hotspots.filter((item) => ecosystem[item.slug] === key).length} onSelect={() => selectLandscape(landscape === key ? "all" : key)} />)}
          </div>
        </div>
      </section>

      <section className={`biome-surface ${landscape === "all" ? "biome-forest" : biomeClassName[landscape]} sticky top-[65px] z-30 border-b border-white/10 px-4 py-4 shadow-lift sm:px-6`} aria-label="Destination observation lens">
        <div className="mx-auto max-w-7xl"><FilterPanel filters={filters} setFilters={updateFilters} onReset={reset} horizontal variant="atlas" /></div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="destination-results-title">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="field-label text-forest-700">Field index · {landscape === "all" ? "All landscapes" : landscape}</p><h2 id="destination-results-title" className="display-section mt-3 text-forest-900">Places worth knowing slowly.</h2></div>
          <p className="field-label text-slate-500" aria-live="polite">{filtered.length} {filtered.length === 1 ? "place" : "places"} in view</p>
        </div>

        {lead ? <>
          <div className="mt-10"><LeadDestination hotspot={lead} /></div>
          {rest.length > 0 && <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{rest.map((hotspot) => <DestinationCard key={hotspot.slug} hotspot={hotspot} />)}</div>}
          {visibleCount < filtered.length && <div className="mt-10 flex flex-col items-center gap-3 border-t border-forest-900/10 pt-8"><p className="field-label text-slate-400">{filtered.length - visibleCount} more field sites remain</p><button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="atlas-button !bg-forest-900 !border-forest-900 !text-white">Continue deeper <ArrowRight size={15} /></button></div>}
        </> : <div className="texture-field-grid mt-10 rounded-field border border-forest-900/10 px-6 py-20 text-center"><SearchX className="mx-auto text-forest-700" /><h3 className="mt-5 font-display text-4xl text-forest-900">The trail goes quiet here.</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">No places match every observation signal. Broaden the landscape or reset the field lens.</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full border border-forest-900/20 px-5 text-xs font-bold text-forest-800">Reset observation lens</button></div>}
      </section>

      <section className="biome-surface biome-marine texture-topography border-y border-white/10 px-4 py-20 sm:px-6 sm:py-28"><div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_auto]"><div><p className="field-label flex items-center gap-2 text-biome-accent"><Binoculars size={14} /> Living atlas</p><h2 className="display-section mt-4 max-w-4xl text-biome-ink">See how every landscape connects.</h2><p className="mt-6 max-w-2xl text-base leading-7 text-biome-ink/60">Move from the field index to the map to read distance, nearby reserves, access points and the ecosystems between them.</p></div><Link href="/map" className="atlas-button">Enter the map <ArrowRight size={15} /></Link></div></section>
    </main>
  );
}

function LandscapePortal({ ecosystemKey, count, active, onSelect }: { ecosystemKey: Ecosystem; count: number; active: boolean; onSelect: () => void }) {
  const theme = biomeThemes.find((item) => item.key === ecosystemKey);
  const Icon = ecosystemIcon[ecosystemKey];
  return <button type="button" aria-pressed={active} onClick={onSelect} className={`biome-surface ${biomeClassName[ecosystemKey]} texture-topography group min-h-48 overflow-hidden rounded-field border p-5 text-left transition hover:-translate-y-1 hover:shadow-lift ${active ? "border-biome-accent ring-2 ring-biome-accent/40" : "border-white/12"}`}><div className="relative z-[1] flex h-full flex-col"><Icon size={22} className="text-biome-accent" /><span className="field-label mt-auto text-biome-ink/42">{String(count).padStart(2, "0")} field sites</span><span className="mt-2 flex items-end justify-between gap-3"><span><span className="block font-display text-3xl capitalize text-biome-ink">{theme?.label ?? ecosystemKey}</span><span className="mt-1 block text-xs leading-5 text-biome-ink/55">{theme?.atmosphere}</span></span><ArrowRight size={17} className="shrink-0 text-biome-accent transition group-hover:translate-x-1" /></span></div></button>;
}

function LeadDestination({ hotspot }: { hotspot: Hotspot }) {
  const biome = ecosystem[hotspot.slug] ?? "forest";
  return <article className={`biome-surface ${biomeClassName[biome]} grid overflow-hidden rounded-field border border-white/12 shadow-lift lg:grid-cols-[0.82fr_1.18fr]`}><HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-60 w-full lg:h-[340px]" /><div className="texture-topography flex flex-col p-5 sm:p-6"><p className="field-label text-biome-accent">Field lead · {biome} · {hotspot.region}</p><h3 className="mt-3 font-display text-4xl leading-none text-biome-ink">{hotspot.name}</h3><p className="mt-2 flex items-center gap-1.5 text-xs text-biome-ink/48"><MapPin size={13} />{hotspot.state}</p><p className="mt-4 line-clamp-2 text-sm leading-6 text-biome-ink/66">{hotspot.summary}</p><div className="mt-5 grid grid-cols-2 gap-4 border-y border-white/10 py-4"><FieldFact label="Best window" value={hotspot.bestMonths.slice(0, 4).join(" · ")} /><FieldFact label="Field signal" value={hotspot.mainSpecies.slice(0, 2).join(" · ")} /></div><div className="mt-auto flex flex-wrap items-center gap-3 pt-5"><Link href={`/hotspots/${hotspot.slug}`} className="atlas-button">Open field guide <ArrowRight size={14} /></Link><JournalSaveButton type="hotspot" slug={hotspot.slug} tone="dark" /></div></div></article>;
}

function DestinationCard({ hotspot }: { hotspot: Hotspot }) {
  const biome = ecosystem[hotspot.slug] ?? "forest";
  const closure = closureInfo[hotspot.slug];
  return <article className="field-card field-card-lift group overflow-hidden rounded-field"><div className="relative"><HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-60 w-full" /><div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-forest-900/88 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-sand">{biome} · {hotspot.region}</span><div className="absolute bottom-4 left-4 right-4 text-white"><p className="flex items-center gap-1 text-xs text-sand"><MapPin size={12} />{hotspot.state}{closure && <ConfidenceDot confidence={closure.confidence} onDark className="ml-1" />}</p><h3 className="mt-1 font-display text-3xl leading-tight">{hotspot.name}</h3></div></div><div className="p-5"><p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{hotspot.summary}</p><p className="field-label mt-4 text-slate-400">Best · {hotspot.bestMonths.slice(0, 4).join(" · ")}</p><div className="mt-5 flex flex-wrap items-center gap-2"><Link href={`/hotspots/${hotspot.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-900 px-4 text-xs font-bold text-white">Open guide <ArrowRight size={13} /></Link><JournalSaveButton type="hotspot" slug={hotspot.slug} compact /></div></div></article>;
}

function FieldFact({ label, value }: { label: string; value: string }) { return <div><p className="field-label text-biome-ink/38">{label}</p><p className="mt-2 text-sm leading-6 text-biome-ink/72">{value}</p></div>; }
