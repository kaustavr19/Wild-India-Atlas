"use client";
import { useMemo, useState } from "react";
import { MergedSpeciesCard, type MergedSpeciesListItem } from "./MergedSpeciesCard";
import { SearchBar } from "./SearchBar";
import { EmptyState } from "./EmptyState";

const PAGE_SIZE = 30;
const GROUP_PRIORITY = ["Bird", "Mammal", "Reptile", "Amphibian"];

function chipClass(active: boolean): string {
  return "rounded-sm border px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wide transition " + (active ? "border-forest-700 bg-forest-700 text-white" : "border-forest-700/20 text-forest-700 hover:bg-forest-50 dark:border-white/15 dark:text-forest-300 dark:hover:bg-white/10");
}

// A single merged, filterable, searchable list across both the Flagship and Extended tiers —
// replaces the old two-section (Flagship grid + separate Extended section) layout. Group chips
// are computed from whatever group values actually appear in the data (not hardcoded to just
// Bird/Mammal/Reptile/Amphibian), so a Flagship-only category like "Marine" still gets a real
// filter chip instead of being force-fit into the wrong bucket or silently dropped.
export function MergedSpeciesList({ items }: { items: MergedSpeciesListItem[] }) {
  const groups = useMemo(() => {
    const distinct = Array.from(new Set(items.map(i => i.group)));
    return distinct.sort((a, b) => {
      const ai = GROUP_PRIORITY.indexOf(a), bi = GROUP_PRIORITY.indexOf(b);
      if (ai !== -1 && bi !== -1) return ai - bi;
      if (ai !== -1) return -1;
      if (bi !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [items]);

  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("All");
  const [endemicOnly, setEndemicOnly] = useState(false);
  const [iconicOnly, setIconicOnly] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(i => {
      if (group !== "All" && i.group !== group) return false;
      if (endemicOnly && !i.endemic) return false;
      if (iconicOnly && !i.iconic) return false;
      if (q && !i.commonName.toLowerCase().includes(q) && !i.scientificName.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, group, endemicOnly, iconicOnly]);

  const visible = filtered.slice(0, visibleCount);

  function resetPage() { setVisibleCount(PAGE_SIZE); }

  return (
    <section className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="sm:max-w-sm sm:flex-1"><SearchBar value={query} onChange={(v) => { setQuery(v); resetPage(); }} placeholder="Search by common or scientific name" /></div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setGroup("All"); resetPage(); }} className={chipClass(group === "All")}>All</button>
          {groups.map(g => <button key={g} type="button" onClick={() => { setGroup(g); resetPage(); }} className={chipClass(group === g)}>{g}</button>)}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => { setIconicOnly(v => !v); resetPage(); }} className={chipClass(iconicOnly)}>Iconic</button>
          <button type="button" onClick={() => { setEndemicOnly(v => !v); resetPage(); }} className={chipClass(endemicOnly)}>Endemic</button>
        </div>
      </div>

      <p className="mt-4 font-mono text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">{filtered.length} of {items.length} species</p>

      {filtered.length ? (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map(i => <MergedSpeciesCard key={i.slug} item={i} />)}
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
        <div className="mt-4"><EmptyState title="No species match" body="Try a different search term or filter." /></div>
      )}
    </section>
  );
}
