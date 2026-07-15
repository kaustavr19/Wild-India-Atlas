import type { Ecosystem } from "@/data/ecosystems";

export type BiomeTheme = {
  key: Ecosystem;
  label: string;
  region: string;
  atmosphere: string;
  cue: string;
};

export const biomeThemes: BiomeTheme[] = [
  { key: "forest", label: "Sal forest", region: "Central India", atmosphere: "Dappled shade, warm dust and deep canopy green", cue: "Leaf litter · cicadas · distant alarm call" },
  { key: "wetland", label: "Floodplain", region: "Brahmaputra & wetlands", atmosphere: "Reflective water, reed beds and open sky", cue: "Water lap · wingbeat · bar-headed geese" },
  { key: "desert", label: "Thar grassland", region: "Western India", atmosphere: "Sun-washed ochre, long horizons and dry wind", cue: "Desert wind · lark song · grass movement" },
  { key: "alpine", label: "High Himalaya", region: "Trans-Himalaya", atmosphere: "Cold stone, cloud shadow and thin blue light", cue: "Mountain wind · raven · distant river" },
  { key: "mangrove", label: "Tidal forest", region: "Sundarbans", atmosphere: "Brackish channels, tangled roots and amber haze", cue: "Tidal water · kingfisher · rustling roots" },
  { key: "marine", label: "Indian Ocean", region: "Coast & islands", atmosphere: "Salt blue, moving light and open water", cue: "Surf · tern colony · underwater hush" },
];

export const biomeClassName: Record<Ecosystem, string> = {
  forest: "biome-forest",
  wetland: "biome-wetland",
  desert: "biome-desert",
  alpine: "biome-alpine",
  mangrove: "biome-mangrove",
  marine: "biome-marine",
};
