import Link from "next/link"; import type { Species } from "@/data/types"; import { SpeciesImage } from "./SpeciesImage";
export function SpeciesCard({ species, compact }: { species: Species; compact?: boolean }) {
  if (compact) {
    return <Link className="block min-w-0" href={"/species/" + species.slug}>
      <article className="field-card group flex items-center gap-3 overflow-hidden rounded-sm p-2 transition hover:-translate-y-0.5">
        <SpeciesImage slug={species.slug} category={species.category} className="h-14 w-14 shrink-0 rounded-sm" showCredit={false}/>
        <div className="min-w-0 flex-1"><h3 className="truncate font-bold text-forest-900">{species.commonName}</h3></div>
      </article>
    </Link>;
  }
  return <Link className="block min-w-0" href={"/species/" + species.slug}>
    <article className="field-card group overflow-hidden rounded-sm transition hover:-translate-y-0.5 hover:shadow-field">
      <div className="relative">
        <SpeciesImage slug={species.slug} category={species.category} className="h-36 w-full" showCredit={false} />
        <div className="absolute right-3 top-3 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{species.category}</div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-forest-900">{species.commonName}</h3>
        <p className="mt-1 text-sm italic text-slate-600 dark:text-slate-400">{species.scientificName}</p>
        <p className="mt-3 line-clamp-2 text-sm text-slate-700 dark:text-slate-300">{species.shortDescription}</p>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Sighting: {species.difficultyOfSighting}</p>
      </div>
    </article>
  </Link>;
}
