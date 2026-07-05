import type { Metadata } from "next"; import { species } from "@/data/species"; import { SpeciesCard } from "@/components/SpeciesCard";

export const metadata: Metadata = {
  title: "Wildlife Species Guide — Wild India Atlas",
  description: "Plan sightings of India's tigers, rhinos, snow leopards, and more — where to see each species, best months, sighting difficulty, and ethical viewing notes.",
};

export default function SpeciesPage(){
  return <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-river">Species guide</p>
    <h1 className="mt-2 text-4xl font-semibold text-forest-900">{species.length} species to plan around</h1>
    <p className="mt-3 max-w-2xl text-slate-700 dark:text-slate-300">From Bengal Tigers to Snow Leopards — see where each species actually lives in the atlas, when to go, and how difficult a real sighting is.</p>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {species.map(s => <SpeciesCard key={s.slug} species={s} />)}
    </div>
  </main>;
}
