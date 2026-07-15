import type { Ecosystem } from "@/data/ecosystems";
import type { Species } from "@/data/types";

export type SpeciesExperience = {
  biome: Ecosystem;
  landscape: string;
  fieldSignal: string;
  encounterLabel: string;
};

export function speciesExperience(species: Species): SpeciesExperience {
  const habitat = species.habitat.toLowerCase();
  let biome: Ecosystem = "forest";

  if (/marine|coast|beach|nearshore|ocean/.test(habitat)) biome = "marine";
  else if (/mangrove|tidal/.test(habitat) && !/deciduous|forest/.test(habitat)) biome = "mangrove";
  else if (/himalaya|alpine|high-altitude|above the treeline|mountain/.test(habitat) && !/forest|bamboo|canopy/.test(habitat)) biome = "alpine";
  else if (/desert|arid|salt|thorn/.test(habitat)) biome = "desert";
  else if (/wetland|swamp|floodplain|river|marsh|lagoon|reed|water/.test(habitat)) biome = "wetland";

  const landscape: Record<Ecosystem, string> = {
    forest: "Under the canopy",
    wetland: "Where water meets grass",
    desert: "Across the open earth",
    alpine: "Above the last treeline",
    mangrove: "Between forest and tide",
    marine: "At the ocean's edge",
  };
  const fieldSignal: Record<string, string> = {
    Easy: "A patient morning often rewards you",
    Moderate: "Read the landscape and stay patient",
    Difficult: "Listen before you look",
    "Very Difficult": "The search is part of the encounter",
  };
  const encounterLabel: Record<string, string> = {
    Mammal: "Follow the tracks",
    Bird: "Follow the call",
    Reptile: "Watch the still places",
    Marine: "Read the tide",
  };

  return {
    biome,
    landscape: landscape[biome],
    fieldSignal: fieldSignal[species.difficultyOfSighting] ?? "Move slowly and observe",
    encounterLabel: encounterLabel[species.category] ?? "Enter its world",
  };
}
