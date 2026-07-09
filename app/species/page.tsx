import type { Metadata } from "next"; import { species as flagshipSpecies } from "@/data/species"; import { getExtendedSpecies } from "@/lib/extendedSpecies"; import { indiaSpecialities } from "@/data/indiaSpecialities"; import { MergedSpeciesList } from "@/components/MergedSpeciesList"; import type { MergedSpeciesListItem } from "@/components/MergedSpeciesCard";

export const metadata: Metadata = {
  title: "Wildlife Species Guide — Wild India Atlas",
  description: "Plan sightings of India's tigers, rhinos, snow leopards, and more — where to see each species, best months, sighting difficulty, and ethical viewing notes.",
};

export default function SpeciesPage(){
  const items: MergedSpeciesListItem[] = [
    ...flagshipSpecies.map((s): MergedSpeciesListItem => ({
      slug: s.slug,
      commonName: s.commonName,
      scientificName: s.scientificName,
      group: s.category,
      tier: "Flagship",
      endemic: indiaSpecialities[s.scientificName]?.endemic === "yes",
      iconic: indiaSpecialities[s.scientificName]?.iconic ?? true,
    })),
    ...getExtendedSpecies().map((s): MergedSpeciesListItem => ({
      slug: s.slug,
      commonName: s.commonName,
      scientificName: s.scientificName,
      group: s.iconicGroup,
      tier: "Extended",
      photoUrl: s.photoUrl,
      endemic: indiaSpecialities[s.scientificName]?.endemic === "yes",
      iconic: indiaSpecialities[s.scientificName]?.iconic ?? false,
    })),
  ];

  return <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 sm:pt-28">
    <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-river">Species guide</p>
    <h1 className="mt-2 text-4xl font-semibold text-forest-900">{items.length} species to plan around</h1>
    <p className="mt-3 max-w-2xl text-slate-700 dark:text-slate-300">From hand-curated Flagship profiles to real citizen-science records confirmed via eBird and iNaturalist — search, filter by group, or narrow to species that are endemic to India or editorially iconic.</p>
    <MergedSpeciesList items={items} />
  </main>;
}
