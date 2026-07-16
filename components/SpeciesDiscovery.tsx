"use client";

import Link from "next/link";
import { ArrowRight, Binoculars, Compass, Fish, Leaf, Map, MountainSnow, Search, SearchX, Sun, TreePine, Waves } from "lucide-react";
import { useMemo, useState } from "react";
import type { Ecosystem } from "@/data/ecosystems";
import type { SightingDifficulty } from "@/data/types";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";
import { conservationBand, defaultSpeciesDiscoveryFilters, filterSpeciesDiscovery, type ConservationBand, type SpeciesDiscoveryFilters, type SpeciesDiscoveryItem } from "@/lib/speciesDiscovery";
import { JournalSaveButton } from "@/components/JournalSaveButton";
import { SpeciesImage } from "@/components/SpeciesImage";
import { SpecialityBadges } from "@/components/SpecialityBadges";

const ecosystemOrder: Ecosystem[] = ["forest", "wetland", "desert", "alpine", "mangrove", "marine"];
const ecosystemIcon: Record<Ecosystem, typeof TreePine> = { forest: TreePine, wetland: Waves, desert: Sun, alpine: MountainSnow, mangrove: Leaf, marine: Fish };
const conservationOrder: ConservationBand[] = ["Critically Endangered", "Endangered", "Vulnerable", "Lower risk", "Other assessed", "Unknown"];
const difficultyOrder: SightingDifficulty[] = ["Easy", "Moderate", "Difficult", "Very Difficult"];
const PAGE_SIZE = 24;

export function SpeciesDiscovery({ items }: { items: SpeciesDiscoveryItem[] }) {
  const [filters, setFilters] = useState<SpeciesDiscoveryFilters>(defaultSpeciesDiscoveryFilters);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const featured = items.find((item) => item.slug === "bengal-tiger") ?? items.find((item) => item.tier === "Flagship") ?? items[0];
  const heroBiome = featured?.biome ?? "forest";
  const flagshipCount = items.filter((item) => item.tier === "Flagship").length;
  const groups = useMemo(() => Array.from(new Set(items.map((item) => item.group))).sort(), [items]);
  const conservationOptions = useMemo(() => conservationOrder.filter((band) => items.some((item) => conservationBand(item.conservationStatus) === band)), [items]);
  const filtered = useMemo(() => filterSpeciesDiscovery(items, filters), [items, filters]);
  const visible = filtered.slice(0, visibleCount);

  function updateFilter<K extends keyof SpeciesDiscoveryFilters>(key: K, value: SpeciesDiscoveryFilters[K]) {
    setFilters((current) => ({ ...current, [key]: value }));
    setVisibleCount(PAGE_SIZE);
  }

  function selectBiome(biome: Ecosystem) { updateFilter("biome", filters.biome === biome ? "all" : biome); }
  function reset() { setFilters(defaultSpeciesDiscoveryFilters); setVisibleCount(PAGE_SIZE); }
  if (!featured) return null;

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className={`biome-surface ${biomeClassName[heroBiome]} texture-grain relative flex min-h-[88svh] items-end overflow-hidden border-b border-white/10`}>
        <SpeciesImage slug={featured.slug} category={featured.group} className="hero-ken-burns absolute inset-0 -z-20 h-full w-full" priority alt="" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(8,30,23,0.98)_0%,rgba(8,30,23,0.88)_44%,rgba(8,30,23,0.22)_78%,rgba(8,30,23,0.08)_100%),linear-gradient(0deg,rgba(8,30,23,0.92)_0%,transparent_56%)]" />
        <div className="texture-topography absolute inset-0 -z-[5] opacity-30" />
        <div className="relative z-[2] mx-auto grid w-full max-w-[90rem] items-end gap-10 px-4 pb-14 pt-32 sm:px-6 sm:pb-20 lg:grid-cols-[1fr_340px] lg:px-10">
          <div className="motion-reveal max-w-5xl">
            <p className="field-label flex items-center gap-3 text-biome-accent"><span className="h-px w-8 bg-biome-accent" /> {flagshipCount} expedition profiles · {items.length - flagshipCount} confirmed field records</p>
            <h1 className="display-hero mt-7 max-w-[10ch] text-biome-ink">Learn the signs.<br /><em className="text-biome-accent">Meet the wild.</em></h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-biome-ink/68 sm:text-xl sm:leading-9">Begin with tracks, calls, habitat and patience—then follow each species into the landscapes where its story becomes visible.</p>
            <div className="mt-8 flex flex-wrap gap-3"><a href="#habitats" className="atlas-button"><Compass size={15} /> Choose a habitat</a><Link href="/map" className="atlas-button atlas-button-ghost"><Map size={15} /> Open the living atlas</Link></div>
          </div>
          <aside className="shell-chrome rounded-field p-5">
            <p className="field-label text-biome-accent">Species field lead · {featured.landscape}</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-biome-ink">{featured.commonName}</h2>
            <p className="mt-2 text-xs italic text-biome-ink/45">{featured.scientificName}</p>
            <p className="mt-5 text-sm leading-6 text-biome-ink/66">{featured.shortDescription}</p>
            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/10 pt-4"><FieldFact label="Status" value={featured.conservationStatus?.replace(" (IUCN)", "") ?? "Not assessed here"} /><FieldFact label="Sighting" value={featured.difficultyOfSighting ?? "Field record"} /></div>
            <div className="mt-5 flex items-center justify-between"><span className="field-label text-biome-ink/42">{featured.fieldSignal}</span><Link href={`/species/${featured.slug}#expedition`} aria-label={`Open ${featured.commonName} expedition`} className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-biome-accent text-biome-surface"><ArrowRight size={16} /></Link></div>
          </aside>
        </div>
      </section>

      <section id="habitats" className="scroll-mt-28 border-b border-forest-900/10 px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <p className="field-label text-forest-700">Begin with habitat</p>
          <div className="mt-4 flex flex-col justify-between gap-5 lg:flex-row lg:items-end"><h2 className="display-section max-w-4xl text-forest-900">Six worlds. Different ways of looking.</h2><p className="max-w-md text-sm leading-7 text-slate-600 dark:text-slate-300">Habitat portals open the atlas&apos;s hand-curated expedition profiles. The wider field-record index remains available below.</p></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{ecosystemOrder.map((biome) => <HabitatPortal key={biome} biome={biome} active={filters.biome === biome} count={items.filter((item) => item.biome === biome).length} onSelect={() => selectBiome(biome)} />)}</div>
        </div>
      </section>

      <section className={`biome-surface ${filters.biome === "all" ? "biome-forest" : biomeClassName[filters.biome]} sticky top-[65px] z-30 border-b border-white/10 px-4 py-4 shadow-lift sm:px-6`} aria-label="Species observation lens">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-3 lg:grid-cols-[minmax(220px,1.35fr)_repeat(3,minmax(150px,0.65fr))_auto] lg:items-end">
            <label className="block"><span className="field-label text-biome-ink/45">Search the index</span><span className="mt-2 flex min-h-11 items-center gap-2 rounded-full border border-white/15 bg-black/10 px-4"><Search size={14} className="text-biome-accent" /><input value={filters.query} onChange={(event) => updateFilter("query", event.target.value)} placeholder="Species or scientific name" className="min-w-0 flex-1 bg-transparent text-sm text-biome-ink outline-none placeholder:text-biome-ink/35" /></span></label>
            <FilterSelect label="Wildlife group" value={filters.group} onChange={(value) => updateFilter("group", value)} options={[{ value: "all", label: "All groups" }, ...groups.map((group) => ({ value: group, label: group }))]} />
            <FilterSelect label="Conservation" value={filters.conservation} onChange={(value) => updateFilter("conservation", value as SpeciesDiscoveryFilters["conservation"])} options={[{ value: "all", label: "All statuses" }, ...conservationOptions.map((band) => ({ value: band, label: band }))]} />
            <FilterSelect label="Sighting effort" value={filters.difficulty} onChange={(value) => updateFilter("difficulty", value as SpeciesDiscoveryFilters["difficulty"])} options={[{ value: "all", label: "Any difficulty" }, ...difficultyOrder.map((difficulty) => ({ value: difficulty, label: difficulty }))]} />
            <button type="button" onClick={reset} className="min-h-11 rounded-full border border-white/15 px-4 font-mono text-[10px] font-semibold uppercase tracking-wider text-biome-ink/65 transition hover:border-biome-accent hover:text-biome-accent">Reset</button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2"><ToggleChip active={filters.iconicOnly} onClick={() => updateFilter("iconicOnly", !filters.iconicOnly)} label="Iconic" /><ToggleChip active={filters.endemicOnly} onClick={() => updateFilter("endemicOnly", !filters.endemicOnly)} label="Endemic to India" />{filters.biome !== "all" && <button type="button" onClick={() => updateFilter("biome", "all")} className="atlas-chip">Habitat · {filters.biome} ×</button>}</div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="species-results-title">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="field-label text-forest-700">Living index · {filters.biome === "all" ? "All habitats" : filters.biome}</p><h2 id="species-results-title" className="display-section mt-3 text-forest-900">Species worth learning slowly.</h2></div><p className="field-label text-slate-500" aria-live="polite">{filtered.length} species in view</p></div>
        {visible.length ? <><div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{visible.map((item) => <SpeciesFieldCard key={item.slug} item={item} />)}</div>{visibleCount < filtered.length && <div className="mt-10 flex flex-col items-center gap-3 border-t border-forest-900/10 pt-8"><p className="field-label text-slate-400">{filtered.length - visibleCount} more species remain</p><button type="button" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)} className="atlas-button !border-forest-900 !bg-forest-900 !text-white">Continue deeper <ArrowRight size={15} /></button></div>}</> : <div className="texture-field-grid mt-10 rounded-field border border-forest-900/10 px-6 py-20 text-center"><SearchX className="mx-auto text-forest-700" /><h3 className="mt-5 font-display text-4xl text-forest-900">No field signal yet.</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">No species match every selected signal. Widen the habitat or reset the observation lens.</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full border border-forest-900/20 px-5 text-xs font-bold text-forest-800 dark:text-white">Reset observation lens</button></div>}
      </section>

      <section className="biome-surface biome-wetland texture-topography border-y border-white/10 px-4 py-20 sm:px-6 sm:py-28"><div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1fr_auto]"><div><p className="field-label flex items-center gap-2 text-biome-accent"><Binoculars size={14} /> From species to place</p><h2 className="display-section mt-4 max-w-4xl text-biome-ink">Follow the encounter into the landscape.</h2><p className="mt-6 max-w-2xl text-base leading-7 text-biome-ink/60">Use the living atlas to connect species profiles with protected places, seasonal access and the field routes between them.</p></div><Link href="/map" className="atlas-button">Enter the map <ArrowRight size={15} /></Link></div></section>
    </main>
  );
}

function HabitatPortal({ biome, count, active, onSelect }: { biome: Ecosystem; count: number; active: boolean; onSelect: () => void }) {
  const theme = biomeThemes.find((item) => item.key === biome);
  const Icon = ecosystemIcon[biome];
  return <button type="button" aria-pressed={active} onClick={onSelect} className={`biome-surface ${biomeClassName[biome]} texture-topography group min-h-48 overflow-hidden rounded-field border p-5 text-left transition hover:-translate-y-1 hover:shadow-lift ${active ? "border-biome-accent ring-2 ring-biome-accent/40" : "border-white/12"}`}><div className="relative z-[1] flex h-full flex-col"><Icon size={22} className="text-biome-accent" /><span className="field-label mt-auto text-biome-ink/42">{String(count).padStart(2, "0")} expedition {count === 1 ? "profile" : "profiles"}</span><span className="mt-2 flex items-end justify-between gap-3"><span><span className="block font-display text-3xl text-biome-ink">{theme?.label ?? biome}</span><span className="mt-1 block text-xs leading-5 text-biome-ink/55">{theme?.atmosphere}</span></span><ArrowRight size={17} className="shrink-0 text-biome-accent transition group-hover:translate-x-1" /></span></div></button>;
}

function SpeciesFieldCard({ item }: { item: SpeciesDiscoveryItem }) {
  const biome = item.biome ?? "forest";
  const recordNote = item.confirmedAtCount ? `Confirmed across ${item.confirmedAtCount} atlas ${item.confirmedAtCount === 1 ? "place" : "places"} from ${item.source}.` : undefined;
  return <article className="field-card field-card-lift group flex min-h-full flex-col overflow-hidden rounded-field"><div className="relative h-60 overflow-hidden bg-forest-900">{item.tier === "Flagship" ? <SpeciesImage slug={item.slug} category={item.group} className="h-full w-full" showCredit={false} /> : item.photoUrl ? <img src={item.photoUrl} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" /> : <div className={`biome-surface ${biomeClassName[biome]} texture-topography h-full w-full`} />}<div className="absolute inset-0 bg-gradient-to-t from-forest-900/90 via-transparent to-transparent" /><span className="absolute left-4 top-4 rounded-full bg-forest-900/88 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-sand">{item.tier === "Flagship" ? item.biome : item.source} · {item.group}</span><div className="absolute bottom-4 left-4 right-4 text-white"><SpecialityBadges endemic={item.endemic} iconic={item.iconic} className="mb-2" /><h3 className="font-display text-3xl leading-tight">{item.commonName}</h3><p className="mt-1 truncate text-xs italic text-white/62">{item.scientificName}</p></div></div><div className="flex flex-1 flex-col p-5"><p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.shortDescription ?? recordNote ?? "Confirmed in the atlas field-record index."}</p><div className="mt-5 grid grid-cols-2 gap-3 border-t border-forest-900/10 pt-4"><FieldFact light label="Status" value={item.conservationStatus ? conservationBand(item.conservationStatus) : "Not listed"} /><FieldFact light label={item.tier === "Flagship" ? "Sighting" : "Atlas records"} value={item.difficultyOfSighting ?? String(item.confirmedAtCount ?? 0)} /></div><div className="mt-auto flex items-center gap-2 pt-5"><Link href={`/species/${item.slug}`} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-forest-900 px-4 text-xs font-bold text-white">Open field guide <ArrowRight size={13} /></Link><JournalSaveButton type="species" slug={item.slug} compact /></div></div></article>;
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void }) { return <label className="block"><span className="field-label text-biome-ink/45">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-11 w-full rounded-full border border-white/15 bg-black/10 px-4 text-sm text-biome-ink outline-none">{options.map((option) => <option key={option.value} value={option.value} className="bg-forest-900 text-white">{option.label}</option>)}</select></label>; }
function ToggleChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`atlas-chip transition ${active ? "border-biome-accent bg-biome-accent text-biome-surface" : ""}`}>{label}</button>; }
function FieldFact({ label, value, light = false }: { label: string; value: string; light?: boolean }) { return <div><p className={`field-label ${light ? "text-slate-400" : "text-biome-ink/38"}`}>{label}</p><p className={`mt-2 text-sm leading-5 ${light ? "text-forest-900 dark:text-slate-200" : "text-biome-ink/72"}`}>{value}</p></div>; }
