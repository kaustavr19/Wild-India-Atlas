import type { Hotspot, Species } from "@/data/types";

// Name variants that appear in hotspots.ts but don't string-match a species'
// commonName exactly (e.g. hotspots just say "Leopard", species.ts says "Indian Leopard").
const SPECIES_ALIASES: Record<string, string[]> = {
  "Indian Leopard": ["Leopard"],
  "Nilgiri Tahr": ["Nilgiri Tahr (occasional, fringe range)"],
};

function namesFor(species: Species): string[] {
  return [species.commonName, ...(SPECIES_ALIASES[species.commonName] ?? [])];
}

export function hotspotsForSpecies(species: Species, hotspots: Hotspot[]): Hotspot[] {
  const names = namesFor(species);
  return hotspots.filter(h => {
    const pool = [...h.mainSpecies, ...h.birdSpecies, ...h.knownFor];
    return names.some(name => pool.includes(name));
  });
}

export function bestMonthsForSpecies(species: Species, hotspots: Hotspot[]): string[] {
  const matches = hotspotsForSpecies(species, hotspots);
  const monthOrder = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const months = new Set(matches.flatMap(h => h.bestMonths));
  return monthOrder.filter(m => months.has(m));
}

// Reverse lookup for hotspot pages: given a species-name string as it appears in a
// hotspot's mainSpecies/birdSpecies (e.g. "Leopard"), find the matching species slug.
export function speciesSlugForName(name: string, allSpecies: Species[]): string | undefined {
  return allSpecies.find(s => namesFor(s).includes(name))?.slug;
}
