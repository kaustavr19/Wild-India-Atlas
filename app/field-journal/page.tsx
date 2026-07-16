"use client";

import Link from "next/link";
import { ArrowRight, Binoculars, BookOpen, Compass, MapPin, PawPrint, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { hotspots } from "@/data/hotspots";
import { species } from "@/data/species";
import { ecosystem } from "@/data/ecosystems";
import { HotspotImage } from "@/components/HotspotImage";
import { SpeciesImage } from "@/components/SpeciesImage";
import { useJournal, type JournalEntry, type JournalEntryType } from "@/components/JournalProvider";
import type { HotspotType } from "@/data/types";
import { JourneyTrail } from "@/components/JourneyTrail";

type Filter = "all" | JournalEntryType;

export default function FieldJournalPage() {
  const { entries, hydrated, updateNote, remove, clear } = useJournal();
  const [filter, setFilter] = useState<Filter>("all");
  const [confirmClear, setConfirmClear] = useState(false);
  const speciesCount = entries.filter((entry) => entry.type === "species").length;
  const hotspotCount = entries.filter((entry) => entry.type === "hotspot").length;
  const visibleEntries = filter === "all" ? entries : entries.filter((entry) => entry.type === filter);
  const resolvedEntries = useMemo(() => visibleEntries.map((entry) => resolveEntry(entry)).filter(Boolean) as ResolvedEntry[], [visibleEntries]);

  return (
    <main className="min-h-screen bg-paper pb-24 text-ink">
      <section className="biome-surface biome-forest texture-grain texture-topography border-b border-white/10 px-4 pb-16 pt-32 text-biome-ink sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="field-label flex items-center gap-2 text-biome-accent"><BookOpen size={15} /> Personal field journal</p>
          <div className="mt-5 grid items-end gap-10 lg:grid-cols-[1fr_340px]">
            <div>
              <h1 className="display-section max-w-4xl text-biome-ink">Keep what calls you back.</h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-biome-ink/65">Save wild lives and protected places as you explore. Your journal stays in this browser—private, lightweight, and ready for the next trail.</p>
            </div>
            <div className="shell-chrome grid grid-cols-3 gap-px overflow-hidden rounded-field text-center">
              <Metric value={hydrated ? entries.length : "—"} label="Saved" />
              <Metric value={hydrated ? speciesCount : "—"} label="Species" />
              <Metric value={hydrated ? hotspotCount : "—"} label="Places" />
            </div>
          </div>
        </div>
      </section>

      <JourneyTrail />

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {!hydrated ? (
          <div className="grid gap-4 sm:grid-cols-2"><div className="h-72 animate-pulse rounded-field bg-forest-900/5" /><div className="h-72 animate-pulse rounded-field bg-forest-900/5" /></div>
        ) : entries.length === 0 ? (
          <section className="texture-field-grid rounded-field border border-forest-900/10 px-6 py-20 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-forest-900 text-sand"><BookOpen size={27} /></div>
            <h2 className="mt-6 font-display text-4xl text-forest-900">Your first field note starts outside.</h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-slate-600 dark:text-slate-300">Save a species that fascinates you or a place you want to experience. It will appear here with space for your own notes.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/species" className="atlas-button"><PawPrint size={15} /> Explore species</Link><Link href="/map" className="atlas-button !bg-forest-900 !border-forest-900 !text-white"><Compass size={15} /> Open the atlas</Link></div>
          </section>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4 border-b border-forest-900/10 pb-6 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter field journal">
                <FilterButton active={filter === "all"} onClick={() => setFilter("all")}>All · {entries.length}</FilterButton>
                <FilterButton active={filter === "species"} onClick={() => setFilter("species")}>Species · {speciesCount}</FilterButton>
                <FilterButton active={filter === "hotspot"} onClick={() => setFilter("hotspot")}>Places · {hotspotCount}</FilterButton>
              </div>
              {confirmClear ? (
                <div className="flex items-center gap-2"><span className="text-xs text-slate-500">Clear every saved item?</span><button onClick={() => { clear(); setConfirmClear(false); }} className="min-h-11 rounded-full bg-clay px-4 text-xs font-bold text-white">Yes, clear all</button><button onClick={() => setConfirmClear(false)} className="min-h-11 rounded-full border border-forest-900/15 px-4 text-xs font-bold">Cancel</button></div>
              ) : <button onClick={() => setConfirmClear(true)} className="inline-flex min-h-11 items-center gap-2 self-start rounded-full border border-forest-900/15 px-4 text-xs font-semibold text-slate-500 transition hover:border-clay hover:text-clay"><Trash2 size={14} /> Clear journal</button>}
            </div>

            {resolvedEntries.length > 0 ? (
              <div className="mt-8 grid gap-5 lg:grid-cols-2">{resolvedEntries.map((item) => <JournalCard key={item.entry.id} item={item} onNote={updateNote} onRemove={remove} />)}</div>
            ) : (
              <div className="py-20 text-center"><p className="font-display text-3xl text-forest-900">Nothing saved in this view yet.</p><button onClick={() => setFilter("all")} className="mt-5 text-sm font-bold text-forest-700 underline underline-offset-4">Show the whole journal</button></div>
            )}
          </>
        )}
      </section>
    </main>
  );
}

type ResolvedEntry = {
  entry: JournalEntry;
  title: string;
  subtitle: string;
  meta: string;
  href: string;
  mapHref: string;
  category: string;
};

function resolveEntry(entry: JournalEntry): ResolvedEntry | null {
  if (entry.type === "species") {
    const item = species.find((candidate) => candidate.slug === entry.slug);
    if (!item) return null;
    return { entry, title: item.commonName, subtitle: item.scientificName, meta: `${item.category} · ${item.difficultyOfSighting} sighting`, href: `/species/${item.slug}`, mapHref: `/species/${item.slug}#range`, category: item.category };
  }
  const item = hotspots.find((candidate) => candidate.slug === entry.slug);
  if (!item) return null;
  return { entry, title: item.name, subtitle: `${item.state} · ${item.region}`, meta: `${ecosystem[item.slug] ?? item.type} · Best ${item.bestMonths.slice(0, 4).join(", ")}`, href: `/hotspots/${item.slug}`, mapHref: `/map?place=${item.slug}`, category: item.type };
}

function JournalCard({ item, onNote, onRemove }: { item: ResolvedEntry; onNote: (id: string, note: string) => void; onRemove: (id: string) => void }) {
  const isSpecies = item.entry.type === "species";
  return (
    <article className="field-card overflow-hidden rounded-field">
      <div className="grid min-h-[190px] sm:grid-cols-[180px_1fr]">
        {isSpecies ? <SpeciesImage slug={item.entry.slug} category={item.category} showCredit={false} className="h-48 w-full sm:h-full" /> : <HotspotImage slug={item.entry.slug} type={item.category as HotspotType} showCredit={false} className="h-48 w-full sm:h-full" />}
        <div className="flex flex-col p-5">
          <p className="field-label flex items-center gap-2 text-forest-700 dark:text-sand">{isSpecies ? <Binoculars size={13} /> : <MapPin size={13} />}{isSpecies ? "Wildlife" : "Atlas place"}</p>
          <h2 className="mt-3 font-display text-3xl text-forest-900">{item.title}</h2>
          <p className="mt-1 text-sm italic text-slate-500">{item.subtitle}</p>
          <p className="field-label mt-4 text-slate-400">{item.meta}</p>
          <div className="mt-auto flex flex-wrap items-center gap-3 pt-5"><Link href={item.href} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-900 px-4 text-xs font-bold text-white">Open field guide <ArrowRight size={13} /></Link><Link href={item.mapHref} className="text-xs font-bold text-forest-700 underline underline-offset-4">{isSpecies ? "See its range" : "Find on map"}</Link></div>
        </div>
      </div>
      <div className="border-t border-forest-900/10 bg-forest-900/[0.025] p-5">
        <div className="flex items-center justify-between gap-4"><label htmlFor={`note-${item.entry.id}`} className="field-label text-slate-500">My field note</label><button onClick={() => onRemove(item.entry.id)} aria-label={`Remove ${item.title} from field journal`} className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold text-slate-400 transition hover:text-clay"><Trash2 size={13} /> Remove</button></div>
        <textarea id={`note-${item.entry.id}`} value={item.entry.note} onChange={(event) => onNote(item.entry.id, event.target.value)} maxLength={500} rows={3} placeholder="What draws you here? Add a reminder, question or observation…" className="mt-2 w-full resize-y rounded-field border border-forest-900/10 bg-paper px-4 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-slate-400 focus:border-forest-700" />
        <p className="mt-2 text-right font-mono text-[9px] text-slate-400">{item.entry.note.length}/500 · saved locally</p>
      </div>
    </article>
  );
}

function Metric({ value, label }: { value: number | string; label: string }) { return <div className="bg-white/[0.035] px-3 py-5"><p className="font-display text-3xl text-biome-ink">{value}</p><p className="field-label mt-1 text-biome-ink/42">{label}</p></div>; }
function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) { return <button type="button" aria-pressed={active} onClick={onClick} className={`min-h-11 rounded-full border px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] transition ${active ? "border-forest-900 bg-forest-900 text-white" : "border-forest-900/15 text-slate-500 hover:border-forest-700 hover:text-forest-700"}`}>{children}</button>; }
