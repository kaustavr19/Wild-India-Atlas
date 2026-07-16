import assert from "node:assert/strict";
import test from "node:test";
import { species } from "../data/species.ts";
import { speciesExperience } from "../lib/speciesExperience.ts";
import { conservationBand, defaultSpeciesDiscoveryFilters, filterSpeciesDiscovery, type SpeciesDiscoveryItem } from "../lib/speciesDiscovery.ts";

test("keeps all six habitat portals populated by curated profiles", () => {
  const biomes = new Set(species.map((item) => speciesExperience(item).biome));
  assert.deepEqual(Array.from(biomes).sort(), ["alpine", "desert", "forest", "mangrove", "marine", "wetland"]);
});

test("recognizes conservation bands without confusing critical and endangered", () => {
  assert.equal(conservationBand("Critically Endangered (IUCN)"), "Critically Endangered");
  assert.equal(conservationBand("Endangered (IUCN)"), "Endangered");
  assert.equal(conservationBand("Near Threatened (IUCN)"), "Lower risk");
  assert.equal(conservationBand("Vulnerable (IUCN) — recovered from Critically Endangered"), "Vulnerable");
});

test("filters the discovery index by habitat and search together", () => {
  const items: SpeciesDiscoveryItem[] = species.map((item) => ({
    slug: item.slug,
    commonName: item.commonName,
    scientificName: item.scientificName,
    group: item.category,
    tier: "Flagship",
    endemic: false,
    iconic: true,
    biome: speciesExperience(item).biome,
  }));
  const result = filterSpeciesDiscovery(items, { ...defaultSpeciesDiscoveryFilters, query: "tiger", biome: "mangrove" });
  assert.deepEqual(result.map((item) => item.slug), ["bengal-tiger"]);
});
