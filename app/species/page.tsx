import type { Metadata } from "next";
import { SpeciesDiscovery } from "@/components/SpeciesDiscovery";
import { indiaSpecialities } from "@/data/indiaSpecialities";
import { species as flagshipSpecies } from "@/data/species";
import { getExtendedSpecies } from "@/lib/extendedSpecies";
import { speciesExperience } from "@/lib/speciesExperience";
import type { SpeciesDiscoveryItem } from "@/lib/speciesDiscovery";

export const metadata: Metadata = {
  title: "Wildlife Species Guide — Wild India Atlas",
  description: "Explore India's wildlife through habitat, conservation status, sighting difficulty, and confirmed citizen-science field records.",
};

export default function SpeciesPage() {
  const items: SpeciesDiscoveryItem[] = [
    ...flagshipSpecies.map((species): SpeciesDiscoveryItem => {
      const experience = speciesExperience(species);
      return {
        slug: species.slug,
        commonName: species.commonName,
        scientificName: species.scientificName,
        group: species.category,
        tier: "Flagship",
        endemic: indiaSpecialities[species.scientificName]?.endemic === "yes",
        iconic: indiaSpecialities[species.scientificName]?.iconic ?? true,
        shortDescription: species.shortDescription,
        habitat: species.habitat,
        conservationStatus: species.conservationStatus,
        difficultyOfSighting: species.difficultyOfSighting,
        biome: experience.biome,
        landscape: experience.landscape,
        fieldSignal: experience.fieldSignal,
      };
    }),
    ...getExtendedSpecies().map((species): SpeciesDiscoveryItem => ({
      slug: species.slug,
      commonName: species.commonName,
      scientificName: species.scientificName,
      group: species.iconicGroup,
      tier: "Extended",
      photoUrl: species.photoUrl,
      endemic: indiaSpecialities[species.scientificName]?.endemic === "yes",
      iconic: indiaSpecialities[species.scientificName]?.iconic ?? false,
      conservationStatus: species.conservationStatus,
      confirmedAtCount: species.confirmedAt.length,
      source: species.source,
    })),
  ];

  return <SpeciesDiscovery items={items} />;
}
