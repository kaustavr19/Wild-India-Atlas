import type { Ecosystem } from "@/data/ecosystems";
import type { SightingDifficulty } from "@/data/types";

export type ConservationBand = "Critically Endangered" | "Endangered" | "Vulnerable" | "Lower risk" | "Other assessed" | "Unknown";

export type SpeciesDiscoveryItem = {
  slug: string;
  commonName: string;
  scientificName: string;
  group: string;
  tier: "Flagship" | "Extended";
  photoUrl?: string;
  endemic: boolean;
  iconic: boolean;
  shortDescription?: string;
  habitat?: string;
  conservationStatus?: string;
  difficultyOfSighting?: SightingDifficulty;
  biome?: Ecosystem;
  landscape?: string;
  fieldSignal?: string;
  confirmedAtCount?: number;
  source?: "eBird" | "iNaturalist";
};

export type SpeciesDiscoveryFilters = {
  query: string;
  group: string;
  biome: Ecosystem | "all";
  conservation: ConservationBand | "all";
  difficulty: SightingDifficulty | "all";
  iconicOnly: boolean;
  endemicOnly: boolean;
};

export const defaultSpeciesDiscoveryFilters: SpeciesDiscoveryFilters = {
  query: "",
  group: "all",
  biome: "all",
  conservation: "all",
  difficulty: "all",
  iconicOnly: false,
  endemicOnly: false,
};

export function conservationBand(status?: string): ConservationBand {
  const value = status?.toLowerCase().split(/[—–-]/, 1)[0].trim() ?? "";
  if (!value) return "Unknown";
  if (value.includes("critically endangered")) return "Critically Endangered";
  if (value.includes("endangered")) return "Endangered";
  if (value.includes("vulnerable")) return "Vulnerable";
  if (value.includes("least concern") || value.includes("near threatened")) return "Lower risk";
  return "Other assessed";
}

export function filterSpeciesDiscovery(items: SpeciesDiscoveryItem[], filters: SpeciesDiscoveryFilters): SpeciesDiscoveryItem[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter((item) => {
    if (filters.group !== "all" && item.group !== filters.group) return false;
    if (filters.biome !== "all" && item.biome !== filters.biome) return false;
    if (filters.conservation !== "all" && conservationBand(item.conservationStatus) !== filters.conservation) return false;
    if (filters.difficulty !== "all" && item.difficultyOfSighting !== filters.difficulty) return false;
    if (filters.iconicOnly && !item.iconic) return false;
    if (filters.endemicOnly && !item.endemic) return false;
    if (query && !item.commonName.toLowerCase().includes(query) && !item.scientificName.toLowerCase().includes(query)) return false;
    return true;
  });
}
