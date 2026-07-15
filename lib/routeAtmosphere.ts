import type { Ecosystem } from "@/data/ecosystems";
import { biomeClassName } from "@/lib/experienceDesign";

export type RouteAtmosphere = {
  biome: Ecosystem;
  className: string;
  label: string;
  coordinate: string;
};

const atmospheres: Record<string, Omit<RouteAtmosphere, "className">> = {
  home: { biome: "forest", label: "Field station · India", coordinate: "22.9734° N · 78.6569° E" },
  map: { biome: "marine", label: "Live atlas · 42 places", coordinate: "India · 3,287,263 km²" },
  hotspots: { biome: "desert", label: "Destination index", coordinate: "7 regions · 42 field sites" },
  species: { biome: "wetland", label: "Species observation guide", coordinate: "Citizen science · Field records" },
  sources: { biome: "alpine", label: "Evidence & field methods", coordinate: "Sources · Confidence · Freshness" },
  fieldKit: { biome: "forest", label: "Experience system", coordinate: "Private field reference" },
};

export function routeAtmosphere(pathname: string): RouteAtmosphere {
  const key = pathname.startsWith("/map")
    ? "map"
    : pathname.startsWith("/hotspots")
      ? "hotspots"
      : pathname.startsWith("/species")
        ? "species"
        : pathname.startsWith("/data-sources")
          ? "sources"
          : pathname.startsWith("/field-kit")
            ? "fieldKit"
            : "home";
  const atmosphere = atmospheres[key];
  return { ...atmosphere, className: biomeClassName[atmosphere.biome] };
}
