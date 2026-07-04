import { feature } from "topojson-client";
import atlas from "world-atlas/countries-110m.json";

// Natural Earth 110m admin-0 boundaries (public domain), shipped via the
// `world-atlas` npm package. Filtered to India's immediate neighbors so the
// map has real land/border context instead of empty background.
const NEIGHBOR_NAMES = new Set(["Pakistan", "Nepal", "Bhutan", "Bangladesh", "Myanmar", "Sri Lanka", "China"]);

const world = feature(atlas as unknown as Parameters<typeof feature>[0], (atlas as unknown as { objects: { countries: Parameters<typeof feature>[1] } }).objects.countries) as unknown as GeoJSON.FeatureCollection;

export const neighboringCountries: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: world.features.filter(f => NEIGHBOR_NAMES.has((f.properties as { name: string }).name)),
};
