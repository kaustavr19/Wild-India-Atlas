"use client";
import { geoMercator, geoPath } from "d3-geo";
import type { Hotspot, Region } from "@/data/types";
import { hotspots as allHotspots } from "@/data/hotspots";
import indiaStates from "@/data/india-states.json";

const typeColorClass: Record<string,string> = {"Tiger Reserve":"bg-amberfield","Bird Sanctuary":"bg-sky-500",Wetland:"bg-river","National Park":"bg-forest-700",Marine:"bg-cyan-500",Himalayan:"bg-slate-600",Grassland:"bg-yellow-600",Mangrove:"bg-emerald-800"};
const typeColorHex: Record<string,string> = {"Tiger Reserve":"#d98c2b","Bird Sanctuary":"#0ea5e9",Wetland:"#2f7da1","National Park":"#24563a",Marine:"#06b6d4",Himalayan:"#475569",Grassland:"#ca8a04",Mangrove:"#065f46"};

const regionFill: Record<Region,string> = { North: "#6f9c5c", South: "#3f7f96", East: "#c39a3a", West: "#b6703c", Central: "#7c8f4c", Northeast: "#357a68", Islands: "#3f719c" };
const stateToRegion = new Map<string, Region>();
for (const h of allHotspots) for (const s of h.state.split("/").map(x=>x.trim())) stateToRegion.set(s, h.region);

const monthAbbr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentMonth = monthAbbr[new Date().getMonth()];
const bestNow = allHotspots.filter(h => h.bestMonths.includes(currentMonth));
const bestNowStates = new Set(bestNow.flatMap(h => h.state.split("/").map(x=>x.trim())));
const bestNowRegions = Array.from(new Set(bestNow.map(h => h.region)));

const projection = geoMercator().fitSize([760, 620], indiaStates as GeoJSON.FeatureCollection);
const pathGen = geoPath(projection);

export function IndiaMap({ hotspots, selectedSlug, onSelect, variant = "full" }: { hotspots: Hotspot[]; selectedSlug?: string; onSelect?: (hotspot: Hotspot) => void; variant?: "full" | "hero" }) {
  const isHero = variant === "hero";
  return (
    <section className={"relative overflow-hidden bg-[#274b3c] " + (isHero ? "h-full w-full" : "min-h-[560px] rounded-lg border border-forest-700/20")}>
      {!isHero && <div className="absolute left-6 top-6 z-10 rounded-full bg-white/85 px-3 py-2 text-xs font-bold text-forest-900 shadow-sm">Interactive India atlas · {hotspots.length} visible</div>}
      {!isHero && bestNowRegions.length > 0 && (
        <div className="absolute right-6 top-6 z-10 max-w-[60%] rounded-lg bg-amberfield/95 px-3 py-2 text-xs font-bold text-forest-900 shadow-sm">
          Best in {currentMonth}: {bestNowRegions.join(", ")}
        </div>
      )}
      <svg viewBox="0 0 760 620" preserveAspectRatio={isHero ? "xMidYMid slice" : "xMidYMid meet"} className="h-full w-full">
        <g>
          {(indiaStates as GeoJSON.FeatureCollection).features.map((f, i) => {
            const name = (f.properties as { name: string }).name;
            const region = stateToRegion.get(name);
            const highlighted = !isHero && bestNowStates.has(name);
            return (
              <path
                key={i}
                d={pathGen(f) ?? undefined}
                fill={highlighted ? "#f0a83c" : region ? regionFill[region] : "#5b6f4e"}
                fillOpacity={isHero ? 0.55 : 1}
                stroke="#fbf7ec"
                strokeOpacity={isHero ? 0.25 : 1}
                strokeWidth={1.2}
                className={highlighted ? "animate-pulse" : ""}
              />
            );
          })}
        </g>
        {hotspots.map(h => {
          const p = projection([h.coordinates.longitude, h.coordinates.latitude]);
          if (!p) return null;
          const active = selectedSlug === h.slug;
          return (
            <g key={h.slug} transform={"translate(" + p[0] + "," + p[1] + ")"} onClick={() => onSelect?.(h)} className={isHero ? "" : "cursor-pointer"}>
              <circle r={isHero ? 3 : active ? 9 : 6} fill={typeColorHex[h.type]} fillOpacity={isHero ? 0.5 : 1} stroke={active ? "#d98c2b" : "#ffffff"} strokeOpacity={isHero ? 0.4 : 1} strokeWidth={active ? 3 : isHero ? 1 : 2} className="transition" />
              {!isHero && <title>{h.name}</title>}
            </g>
          );
        })}
      </svg>
      {!isHero && (
        <div className="pointer-events-none absolute bottom-4 left-4 flex max-w-[90%] flex-wrap gap-2 rounded-lg bg-white/85 p-3 text-xs font-semibold shadow-sm">
          {Object.entries(typeColorClass).map(([type,cls])=><span key={type} className="flex items-center gap-1"><i className={"h-2.5 w-2.5 rounded-full " + cls}/>{type}</span>)}
        </div>
      )}
    </section>
  );
}
