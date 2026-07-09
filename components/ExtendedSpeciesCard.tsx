import Link from "next/link";
import type { ExtendedSpecies } from "@/lib/extendedSpecies";

// Deliberately does not reuse <SpeciesImage> — that component falls back to a generic
// per-category illustration when a real photo is missing, which is the right call for
// hand-curated Flagship entries but would read as a fabricated photo stand-in here. When an
// Extended entry has no real photoUrl, this renders a plain text card instead — no image at all.
export function ExtendedSpeciesCard({ species }: { species: ExtendedSpecies }) {
  return (
    <Link href={"/species/" + species.slug} className="block min-w-0">
      <article className="field-card group overflow-hidden rounded-sm transition hover:-translate-y-0.5 hover:shadow-field">
        {species.photoUrl ? (
          <div className="relative h-36 w-full overflow-hidden bg-forest-900">
            <img src={species.photoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute right-3 top-3 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{species.iconicGroup}</div>
          </div>
        ) : (
          <div className="flex h-14 items-center justify-between bg-forest-100 px-4 dark:bg-forest-900/40">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-forest-700 dark:text-forest-300">{species.iconicGroup}</span>
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">via {species.source}</span>
          </div>
        )}
        <div className="p-4">
          <h3 className="truncate font-bold text-forest-900">{species.commonName}</h3>
          <p className="mt-1 truncate text-sm italic text-slate-600 dark:text-slate-400">{species.scientificName}</p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Confirmed at {species.confirmedAt.length} hotspot{species.confirmedAt.length === 1 ? "" : "s"}</p>
        </div>
      </article>
    </Link>
  );
}
