"use client";
import { useMemo, useState } from "react";
import type { ExtendedSpecies, IconicGroup } from "@/lib/extendedSpecies";
import { ExtendedSpeciesCard } from "./ExtendedSpeciesCard";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

const GROUPS: (IconicGroup | "All")[] = ["All", "Bird", "Mammal", "Reptile", "Amphibian"];
const PAGE_SIZE = 30;

// A reveal-more pattern rather than pagination or virtualization — mirrors the "Show all N
// species" toggle already used on hotspot pages (components/EbirdChecklist.tsx), just applied
// across parks instead of within one. With 900+ combined entries, rendering everything upfront
// isn't reasonable, but a simple client-side slice avoids pulling in a virtualization dependency
// this codebase doesn't otherwise use.
export function ExtendedSpeciesSection({ species }: { species: ExtendedSpecies[] }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<IconicGroup | "All">("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return species.filter(s => {
      if (group !== "All" && s.iconicGroup !== group) return false;
      if (q && !s.commonName.toLowerCase().includes(q) && !s.scientificName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [species, query, group]);

  const visible = filtered.slice(0, visibleCount);

  function updateQuery(v: string) { setQuery(v); setVisibleCount(PAGE_SIZE); }
  function updateGroup(g: IconicGroup | "All") { setGroup(g); setVisibleCount(PAGE_SIZE); }

  return (
    <section className="mt-14">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-river">Extended species</p>
      <h2 className="mt-1 text-3xl font-black text-forest-900">{species.length} more species confirmed via eBird &amp; iNaturalist</h2>
      <p className="mt-2 max-w-2xl text-sm text-slate-700 dark:text-slate-300">Real citizen-science records grouped across every hotspot — not curated profiles like the guide above, but genuine sightings with a named source and a full list of where each species was actually confirmed.</p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:max-w-sm sm:flex-1"><SearchBar value={query} onChange={updateQuery} placeholder="Search by common or scientific name" /></div>
        <div className="flex flex-wrap gap-2">
          {GROUPS.map(g => (
            <button
              key={g}
              type="button"
              onClick={() => updateGroup(g)}
              className={"rounded-sm border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition " + (group === g ? "border-forest-700 bg-forest-700 text-white" : "border-forest-700/20 text-forest-700 hover:bg-forest-50 dark:border-white/15 dark:text-forest-300 dark:hover:bg-white/10")}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{filtered.length} match{filtered.length === 1 ? "" : "es"}</p>

      {filtered.length ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map(s => <ExtendedSpeciesCard key={s.slug} species={s} />)}
          </div>
          {visibleCount < filtered.length && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount(c => c + PAGE_SIZE)}
                className="rounded-sm border border-forest-700/20 px-5 py-2.5 font-mono text-xs font-bold uppercase tracking-wide text-forest-700 transition hover:bg-forest-50 dark:border-white/15 dark:text-forest-300 dark:hover:bg-white/10"
              >
                Show more ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="mt-4"><EmptyState title="No species match" body="Try a different search term or group filter." /></div>
      )}
    </section>
  );
}
