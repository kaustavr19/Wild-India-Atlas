"use client";
import { useRef, useState } from "react";
import { ChevronDown, DoorOpen, Minus, Plane, Plus, RotateCcw, SlidersHorizontal, TrainFront, type LucideIcon } from "lucide-react";
import { geoMercator, geoPath } from "d3-geo";
import type { Hotspot, Region } from "@/data/types";
import { hotspots as allHotspots } from "@/data/hotspots";
import indiaStates from "@/data/india-states.json";
import { neighboringCountries } from "@/data/neighboringCountries";
import { airportPoint, railwayPoint, entryGates, type AccessPoint } from "@/data/accessPoints";
import { ecosystem, ecosystemColorClass, ecosystemColorHex } from "@/data/ecosystems";

type AccessHover = { name: string; kind: string; coordinates: { latitude: number; longitude: number } };
type LayerKey = "Mammals" | "Birds" | "Reptiles" | "Flora" | "Rare Species" | "Monsoon";
const LAYER_KEYS: LayerKey[] = ["Mammals", "Birds", "Reptiles", "Flora", "Rare Species", "Monsoon"];
function matchesLayer(h: Hotspot, key: LayerKey): boolean {
  if (key === "Rare Species") return h.experienceTags.includes("Rare Species");
  if (key === "Monsoon") return h.bestSeason.includes("Monsoon");
  return h.wildlifeTypes.includes(key);
}

// Used only for region-cluster circles now — state fill is a flat neutral tone so it
// doesn't visually compete with the ecosystem-colored pins (both palettes leaned on
// green/orange/blue and were easy to misread as the same signal).
const regionFill: Record<Region,string> = { North: "#6f9c5c", South: "#3f7f96", East: "#c39a3a", West: "#b6703c", Central: "#7c8f4c", Northeast: "#357a68", Islands: "#3f719c" };

const monthAbbr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const currentMonth = monthAbbr[new Date().getMonth()];
const bestNow = allHotspots.filter(h => h.bestMonths.includes(currentMonth));
const bestNowStates = new Set(bestNow.flatMap(h => h.state.split("/").map(x=>x.trim())));
const bestNowRegions = Array.from(new Set(bestNow.map(h => h.region)));

const VIEW_W = 760, VIEW_H = 620;
const MIN_W = VIEW_W / 16;
const projection = geoMercator().fitSize([VIEW_W, VIEW_H], indiaStates as GeoJSON.FeatureCollection);
const pathGen = geoPath(projection);
const stateLabels = (indiaStates as GeoJSON.FeatureCollection).features.map(f => ({
  name: (f.properties as { name: string }).name,
  centroid: pathGen.centroid(f),
}));

type ViewBox = { x: number; y: number; w: number; h: number };
const DEFAULT_VIEW: ViewBox = { x: 0, y: 0, w: VIEW_W, h: VIEW_H };

export function IndiaMap({ hotspots, selectedSlug, onSelect, variant = "full" }: { hotspots: Hotspot[]; selectedSlug?: string; onSelect?: (hotspot: Hotspot) => void; variant?: "full" | "hero" }) {
  const isHero = variant === "hero";
  const [hovered, setHovered] = useState<Hotspot | undefined>();
  const [hoveredAccess, setHoveredAccess] = useState<AccessHover | undefined>();
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(new Set());
  const [legendOpen, setLegendOpen] = useState(false);
  const [view, setView] = useState<ViewBox>(DEFAULT_VIEW);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; viewX: number; viewY: number; moved: boolean } | null>(null);

  function clampView(v: ViewBox): ViewBox {
    const w = Math.min(VIEW_W, Math.max(MIN_W, v.w));
    const h = (w / VIEW_W) * VIEW_H;
    const x = Math.min(Math.max(v.x, 0), VIEW_W - w);
    const y = Math.min(Math.max(v.y, 0), VIEW_H - h);
    return { x, y, w, h };
  }

  function zoomBy(factor: number, cx: number, cy: number) {
    setView(v => {
      const newW = Math.min(VIEW_W, Math.max(MIN_W, v.w / factor));
      const newH = (newW / VIEW_W) * VIEW_H;
      const relX = (cx - v.x) / v.w;
      const relY = (cy - v.y) / v.h;
      return clampView({ x: cx - relX * newW, y: cy - relY * newH, w: newW, h: newH });
    });
  }

  function toSvgPoint(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    const inv = ctm.inverse();
    const p = pt.matrixTransform(inv);
    return { x: p.x, y: p.y };
  }

  function handleWheel(e: React.WheelEvent<SVGSVGElement>) {
    if (isHero) return;
    e.preventDefault();
    const p = toSvgPoint(e.clientX, e.clientY);
    if (!p) return;
    zoomBy(e.deltaY < 0 ? 1.2 : 1 / 1.2, p.x, p.y);
  }

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    if (isHero) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, viewX: view.x, viewY: view.y, moved: false };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dxPx = e.clientX - drag.startX;
    const dyPx = e.clientY - drag.startY;
    if (Math.abs(dxPx) + Math.abs(dyPx) > 3) drag.moved = true;
    const scaleX = view.w / rect.width, scaleY = view.h / rect.height;
    setView(v => clampView({ ...v, x: drag.viewX - dxPx * scaleX, y: drag.viewY - dyPx * scaleY }));
  }

  function handlePointerUp() {
    dragRef.current = dragRef.current ? { ...dragRef.current } : null;
    setTimeout(() => { dragRef.current = null; }, 0);
  }

  function handleMarkerClick(h: Hotspot) {
    if (dragRef.current?.moved) return;
    onSelect?.(h);
  }

  function toggleLayer(key: LayerKey) {
    setActiveLayers(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }

  const visibleOnMap = activeLayers.size === 0 ? hotspots : hotspots.filter(h => Array.from(activeLayers).some(key => matchesLayer(h, key)));

  const zoomed = view.w < VIEW_W - 1;

  type Cluster = { region: Region; count: number; cx: number; cy: number; hotspots: Hotspot[] };
  const clusters: Cluster[] = (!isHero && !zoomed) ? (() => {
    const byRegion = new Map<Region, Hotspot[]>();
    for (const h of visibleOnMap) {
      const arr = byRegion.get(h.region) ?? [];
      arr.push(h);
      byRegion.set(h.region, arr);
    }
    const result: Cluster[] = [];
    for (const [region, hs] of byRegion) {
      const pts = hs.map(h => projection([h.coordinates.longitude, h.coordinates.latitude])).filter((p): p is [number, number] => !!p);
      if (!pts.length) continue;
      const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
      const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
      result.push({ region, count: hs.length, cx, cy, hotspots: hs });
    }
    return result;
  })() : [];

  function handleClusterClick(cluster: Cluster) {
    const pts = cluster.hotspots.map(h => projection([h.coordinates.longitude, h.coordinates.latitude])).filter((p): p is [number, number] => !!p);
    if (!pts.length) return;
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    const pad = 50;
    const minX = Math.min(...xs) - pad, maxX = Math.max(...xs) + pad;
    const minY = Math.min(...ys) - pad, maxY = Math.max(...ys) + pad;
    const w = maxX - minX, h = maxY - minY;
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    setView(clampView({ x: cx - w / 2, y: cy - h / 2, w, h }));
  }
  // Marker sizes are defined in SVG user units, which stay fixed while the viewBox
  // shrinks as you zoom in — without this, markers grow to cover a larger and larger
  // geographic area on screen the more you zoom, looking imprecise. Scaling them down
  // in step with the viewBox keeps them a small, precise, constant on-screen size.
  const zoomScale = isHero ? 1 : Math.max(0.2, view.w / VIEW_W);
  const activeHotspot = !isHero ? hotspots.find(h => h.slug === selectedSlug) : undefined;
  const activeAirport = activeHotspot ? airportPoint[activeHotspot.slug] : undefined;
  const activeRailway = activeHotspot ? railwayPoint[activeHotspot.slug] : undefined;
  const activeGates = activeHotspot ? entryGates[activeHotspot.slug] : undefined;

  function accessMarker(point: AccessPoint, kind: string, Icon: LucideIcon, color: string, key?: string | number) {
    const p = projection([point.coordinates.longitude, point.coordinates.latitude]);
    if (!p) return null;
    const size = 11 * zoomScale;
    return (
      <g key={key ?? kind} transform={"translate(" + p[0] + "," + p[1] + ")"} onMouseEnter={() => setHoveredAccess({ name: point.name, kind, coordinates: point.coordinates })} onMouseLeave={() => setHoveredAccess(undefined)}>
        <circle r={size / 2 + 0.75} fill={color} stroke="#ffffff" strokeWidth={1 * zoomScale} />
        <foreignObject x={-size / 2} y={-size / 2} width={size} height={size} style={{ overflow: "visible", pointerEvents: "none" }}>
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon color="#ffffff" size={size * 0.62} strokeWidth={2.5} />
          </div>
        </foreignObject>
      </g>
    );
  }

  return (
    <section className={"relative overflow-hidden bg-[#1c3a4a] " + (isHero ? "h-full w-full" : "h-full min-h-[560px] w-full rounded-sm border border-forest-700/20")}>
      {/* Ocean atmosphere — same restrained dot pattern as the hero/fallback illustrations
          (.canopy-texture in globals.css). Sits behind the SVG, so the opaque land/state
          polygons drawn on top cover it completely; only the uncovered ocean shows the
          texture. Landmass fills are intentionally left flat — see the regionFill comment
          above for why they can't compete visually with the ecosystem-pin colors. */}
      <div className="canopy-texture pointer-events-none absolute inset-0" />
      {!isHero && (
        <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-col gap-2 sm:inset-x-6 sm:top-6">
          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="pointer-events-auto max-w-full truncate rounded-sm border border-white/20 bg-white/20 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md">Interactive India atlas · {visibleOnMap.length} visible</div>
            {bestNowRegions.length > 0 && (
              <div className="pointer-events-auto max-w-full rounded-sm border border-sand/40 bg-sand/25 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-sand backdrop-blur-md sm:max-w-[60%]">
                Best in {currentMonth}: {bestNowRegions.join(", ")}
              </div>
            )}
          </div>
          <div className="pointer-events-auto">
            <button onClick={() => setLegendOpen(o => !o)} className="flex items-center gap-1.5 rounded-sm border border-white/20 bg-white/20 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md hover:bg-white/30">
              <SlidersHorizontal size={13} />
              Layers &amp; legend
              {activeLayers.size > 0 && <span className="grid h-4 w-4 place-items-center rounded-full bg-amberfield text-[10px] text-forest-900">{activeLayers.size}</span>}
              <ChevronDown size={13} className={"transition-transform " + (legendOpen ? "rotate-180" : "")} />
            </button>
            {legendOpen && (
              <div className="mt-2 flex max-w-full flex-col gap-3 rounded-sm border border-white/20 bg-forest-900/95 p-3 backdrop-blur-md">
                <div>
                  <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white/50">Layers</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LAYER_KEYS.map(key => {
                      const on = activeLayers.has(key);
                      return (
                        <button key={key} onClick={() => toggleLayer(key)} className={"rounded-full border px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide transition " + (on ? "border-amberfield bg-amberfield text-forest-900" : "border-white/25 bg-white/10 text-white/80 hover:border-white/50")}>
                          {key}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white/50">Ecosystem</p>
                  <div className="flex flex-wrap gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-white">
                    {Object.entries(ecosystemColorClass).map(([eco,cls])=><span key={eco} className="flex items-center gap-1"><i className={"h-2.5 w-2.5 rounded-full " + cls}/>{eco}</span>)}
                  </div>
                </div>
                {(activeAirport || activeRailway || (activeGates && activeGates.length > 0)) && (
                  <div>
                    <p className="mb-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-white/50">Access points</p>
                    <div className="flex flex-wrap gap-2 font-mono text-[11px] font-semibold uppercase tracking-wide text-white">
                      {activeAirport && <span className="flex items-center gap-1.5"><i className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{background:"#a855f7"}}><Plane color="#ffffff" size={10} strokeWidth={2.5}/></i>Airport</span>}
                      {activeRailway && <span className="flex items-center gap-1.5"><i className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{background:"#eab308"}}><TrainFront color="#ffffff" size={10} strokeWidth={2.5}/></i>Railway</span>}
                      {activeGates && activeGates.length > 0 && <span className="flex items-center gap-1.5"><i className="grid h-4 w-4 shrink-0 place-items-center rounded-full" style={{background:"#f43f5e"}}><DoorOpen color="#ffffff" size={10} strokeWidth={2.5}/></i>Entry gate</span>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      <svg
        ref={svgRef}
        viewBox={isHero ? "0 0 " + VIEW_W + " " + VIEW_H : view.x + " " + view.y + " " + view.w + " " + view.h}
        preserveAspectRatio={isHero ? "xMidYMid slice" : "xMidYMid meet"}
        className={"h-full w-full " + (isHero ? "" : "touch-none " + (dragRef.current ? "cursor-grabbing" : "cursor-grab"))}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <g pointerEvents="none">
          {neighboringCountries.features.map((f, i) => (
            <path
              key={i}
              d={pathGen(f) ?? undefined}
              fill="#3d4f42"
              fillOpacity={isHero ? 0.35 : 0.55}
              stroke="#1c3a4a"
              strokeWidth={1}
            />
          ))}
        </g>
        <g>
          {(indiaStates as GeoJSON.FeatureCollection).features.map((f, i) => {
            const name = (f.properties as { name: string }).name;
            const highlighted = !isHero && bestNowStates.has(name);
            return (
              <path
                key={i}
                d={pathGen(f) ?? undefined}
                fill={highlighted ? "#f0a83c" : "#4a5c47"}
                fillOpacity={isHero ? 0.55 : 1}
                stroke="#fbf7ec"
                strokeOpacity={isHero ? 0.25 : 1}
                strokeWidth={1.2}
                className={highlighted ? "animate-pulse" : ""}
              />
            );
          })}
        </g>
        {!isHero && zoomed && (
          <g pointerEvents="none">
            {stateLabels.map(s => (
              <text key={s.name} x={s.centroid[0]} y={s.centroid[1]} textAnchor="middle" fontSize={6.5} fontWeight={600} fill="#fbf7ec" fillOpacity={0.75} style={{ fontFamily: "var(--font-mono), monospace" }}>
                {s.name}
              </text>
            ))}
          </g>
        )}
        {(isHero || zoomed) ? visibleOnMap.map(h => {
          const p = projection([h.coordinates.longitude, h.coordinates.latitude]);
          if (!p) return null;
          const active = selectedSlug === h.slug;
          return (
            <g key={h.slug} transform={"translate(" + p[0] + "," + p[1] + ")"} onClick={() => handleMarkerClick(h)} onMouseEnter={() => !isHero && setHovered(h)} onMouseLeave={() => setHovered(undefined)} className={isHero ? "" : "cursor-pointer"}>
              <circle r={isHero ? 3 : (active ? 7 : 5) * zoomScale} fill={ecosystemColorHex[ecosystem[h.slug]]} fillOpacity={isHero ? 0.5 : 1} stroke={active ? "#d98c2b" : "#ffffff"} strokeOpacity={isHero ? 0.4 : 1} strokeWidth={(active ? 2.5 : isHero ? 1 : 1.5) * zoomScale} className="transition" />
            </g>
          );
        }) : clusters.map(c => {
          const r = 10 + Math.min(c.count, 10) * 1.4;
          return (
            <g key={c.region} transform={"translate(" + c.cx + "," + c.cy + ")"} onClick={() => handleClusterClick(c)} className="cursor-pointer">
              <circle r={r} fill={regionFill[c.region]} fillOpacity={0.92} stroke="#ffffff" strokeWidth={1.5} />
              <text textAnchor="middle" dy={4} fontSize={12} fontWeight={700} fill="#ffffff" style={{ fontFamily: "var(--font-mono), monospace" }}>{c.count}</text>
              <text textAnchor="middle" y={r + 11} fontSize={7.5} fontWeight={600} fill="#fbf7ec" style={{ fontFamily: "var(--font-mono), monospace" }}>{c.region}</text>
            </g>
          );
        })}
        {activeAirport && accessMarker(activeAirport, "Airport", Plane, "#a855f7")}
        {activeRailway && accessMarker(activeRailway, "Railway station", TrainFront, "#eab308")}
        {activeGates?.map((gate, i) => accessMarker(gate, "Entry gate", DoorOpen, "#f43f5e", i))}
      </svg>
      {!isHero && hoveredAccess && (() => {
        const p = projection([hoveredAccess.coordinates.longitude, hoveredAccess.coordinates.latitude]);
        if (!p) return null;
        const left = ((p[0] - view.x) / view.w) * 100, top = ((p[1] - view.y) / view.h) * 100;
        if (left < 0 || left > 100 || top < 0 || top > 100) return null;
        const flipLeft = left > 70;
        return (
          <div
            className="pointer-events-none absolute z-20 -translate-y-full rounded-sm border border-white/20 bg-forest-900/95 px-3 py-2 shadow-lg backdrop-blur-md"
            style={{ left: left + "%", top: (top - 3) + "%", transform: "translate(" + (flipLeft ? "-100%" : "-8px") + ", -100%)" }}
          >
            <p className="rounded-sm bg-forest-900/0 font-mono text-[10px] font-semibold uppercase tracking-wider text-sand">{hoveredAccess.kind}</p>
            <p className="mt-0.5 whitespace-nowrap text-sm font-bold text-white">{hoveredAccess.name}</p>
          </div>
        );
      })()}
      {!isHero && hovered && (() => {
        const p = projection([hovered.coordinates.longitude, hovered.coordinates.latitude]);
        if (!p) return null;
        const left = ((p[0] - view.x) / view.w) * 100, top = ((p[1] - view.y) / view.h) * 100;
        if (left < 0 || left > 100 || top < 0 || top > 100) return null;
        const flipLeft = left > 70;
        return (
          <div
            className="pointer-events-none absolute z-20 -translate-y-full rounded-sm border border-white/20 bg-forest-900/95 px-3 py-2 shadow-lg backdrop-blur-md"
            style={{ left: left + "%", top: (top - 3) + "%", transform: "translate(" + (flipLeft ? "-100%" : "-8px") + ", -100%)" }}
          >
            <p className="rounded-sm bg-forest-900/0 font-mono text-[10px] font-semibold uppercase tracking-wider text-sand">{hovered.type}</p>
            <p className="mt-0.5 whitespace-nowrap text-sm font-bold text-white">{hovered.name}</p>
            <p className="text-xs text-white/60">{hovered.state}</p>
          </div>
        );
      })()}
      {!isHero && (
        <div className="absolute right-4 top-1/2 z-10 grid -translate-y-1/2 gap-1">
          <button aria-label="Zoom in" onClick={() => zoomBy(1.4, view.x + view.w / 2, view.y + view.h / 2)} className="grid h-8 w-8 place-items-center rounded-sm border border-white/20 bg-white/20 text-white backdrop-blur-md hover:bg-white/30"><Plus size={16} /></button>
          <button aria-label="Zoom out" onClick={() => zoomBy(1 / 1.4, view.x + view.w / 2, view.y + view.h / 2)} className="grid h-8 w-8 place-items-center rounded-sm border border-white/20 bg-white/20 text-white backdrop-blur-md hover:bg-white/30"><Minus size={16} /></button>
          {zoomed && <button aria-label="Reset zoom" onClick={() => setView(DEFAULT_VIEW)} className="grid h-8 w-8 place-items-center rounded-sm border border-white/20 bg-white/20 text-white backdrop-blur-md hover:bg-white/30"><RotateCcw size={14} /></button>}
        </div>
      )}
    </section>
  );
}
