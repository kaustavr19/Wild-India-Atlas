import type { HotspotFilters } from "@/lib/filterHotspots";
import { SearchBar } from "./SearchBar";

const groups = {
  region: ["All", "North", "South", "East", "West", "Central", "Northeast", "Islands"],
  wildlifeType: ["All", "Mammals", "Birds", "Reptiles", "Marine", "Flora", "Butterflies"],
  experience: ["All", "Photography", "Safari", "Birding", "Trekking", "Family-friendly", "Offbeat"],
  season: ["All", "Winter", "Summer", "Monsoon", "Post-monsoon"],
  difficulty: ["All", "Easy", "Moderate", "Remote"],
} as const;

export function FilterPanel({ filters, setFilters, onReset, horizontal, variant = "default" }: {
  filters: HotspotFilters;
  setFilters: (filters: HotspotFilters) => void;
  onReset: () => void;
  horizontal?: boolean;
  variant?: "default" | "atlas";
}) {
  const atlas = variant === "atlas";
  function set(key: keyof HotspotFilters, value: string) {
    setFilters({ ...filters, [key]: value } as HotspotFilters);
  }

  return (
    <div className={atlas ? "text-biome-ink" : "field-card rounded-sm p-4"}>
      <div className="flex items-center justify-between gap-3">
        <div>
          {atlas && <p className="field-label text-biome-accent">Observation lens</p>}
          <h2 className={`${atlas ? "mt-1 font-display text-2xl font-medium text-biome-ink" : "text-lg font-bold text-forest-900"}`}>{atlas ? "What are you seeking?" : "Explore filters"}</h2>
        </div>
        <button onClick={onReset} className={`${atlas ? "text-biome-ink/50 hover:border-biome-accent hover:text-biome-accent" : "border-forest-700/20 text-forest-700 hover:bg-forest-50 dark:border-white/15 dark:text-forest-300 dark:hover:bg-white/10"} rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition`}>Reset</button>
      </div>
      <div className={horizontal ? "mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.4fr_repeat(5,1fr)] lg:items-end" : "mt-4"}>
        <div className={horizontal ? "sm:col-span-2 md:col-span-3 lg:col-span-1" : ""}>
          <SearchBar variant={atlas ? "dark" : "light"} value={filters.query} onChange={(value) => set("query", value)} placeholder="Species, park, state…" />
        </div>
        <div className={horizontal ? "contents" : "mt-4 grid grid-cols-2 gap-3"}>
          {Object.entries(groups).map(([key, values]) => (
            <label key={key} className={`${atlas ? "text-biome-ink/42" : "text-slate-600 dark:text-slate-400"} grid gap-1 font-mono text-[10px] font-semibold uppercase tracking-wide`}>
              {key.replace("wildlifeType", "wildlife type")}
              <select
                value={String(filters[key as keyof HotspotFilters])}
                onChange={(event) => set(key as keyof HotspotFilters, event.target.value)}
                className={`${atlas ? "border-white/12 bg-white/8 text-biome-ink focus:border-biome-accent" : "border-forest-700/15 bg-white text-forest-900 focus:ring-2 focus:ring-forest-500/30 dark:border-white/15 dark:bg-forest-900/40 dark:text-slate-100"} rounded-sm border px-3 py-2 font-sans text-sm font-medium normal-case outline-none transition`}
              >
                {values.map((value) => <option key={value} className="bg-forest-900 text-white">{value}</option>)}
              </select>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
