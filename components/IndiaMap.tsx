"use client";
import { useRef, useState } from "react";
import { Minus, Plus, RotateCcw } from "lucide-react";
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

const VIEW_W = 760, VIEW_H = 620;
const MIN_W = VIEW_W / 6;
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
    if (!dragRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dxPx = e.clientX - dragRef.current.startX;
    const dyPx = e.clientY - dragRef.current.startY;
    if (Math.abs(dxPx) + Math.abs(dyPx) > 3) dragRef.current.moved = true;
    const scaleX = view.w / rect.width, scaleY = view.h / rect.height;
    setView(v => clampView({ ...v, x: dragRef.current!.viewX - dxPx * scaleX, y: dragRef.current!.viewY - dyPx * scaleY }));
  }

  function handlePointerUp() {
    dragRef.current = dragRef.current ? { ...dragRef.current } : null;
    setTimeout(() => { dragRef.current = null; }, 0);
  }

  function handleMarkerClick(h: Hotspot) {
    if (dragRef.current?.moved) return;
    onSelect?.(h);
  }

  const zoomed = view.w < VIEW_W - 1;

  return (
    <section className={"relative overflow-hidden bg-[#274b3c] " + (isHero ? "h-full w-full" : "h-full min-h-[560px] w-full rounded-sm border border-forest-700/20")}>
      {!isHero && <div className="absolute left-6 top-6 z-10 rounded-sm border border-white/20 bg-white/20 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-white backdrop-blur-md">Interactive India atlas · {hotspots.length} visible</div>}
      {!isHero && bestNowRegions.length > 0 && (
        <div className="absolute right-6 top-6 z-10 max-w-[60%] rounded-sm border border-flare/40 bg-flare/25 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wide text-flare backdrop-blur-md">
          Best in {currentMonth}: {bestNowRegions.join(", ")}
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
        {!isHero && (
          <g pointerEvents="none">
            {stateLabels.map(s => (
              <text key={s.name} x={s.centroid[0]} y={s.centroid[1]} textAnchor="middle" fontSize={zoomed ? 6.5 : 8} fontWeight={600} fill="#fbf7ec" fillOpacity={0.75} style={{ fontFamily: "var(--font-mono), monospace" }}>
                {s.name}
              </text>
            ))}
          </g>
        )}
        {hotspots.map(h => {
          const p = projection([h.coordinates.longitude, h.coordinates.latitude]);
          if (!p) return null;
          const active = selectedSlug === h.slug;
          return (
            <g key={h.slug} transform={"translate(" + p[0] + "," + p[1] + ")"} onClick={() => handleMarkerClick(h)} onMouseEnter={() => !isHero && setHovered(h)} onMouseLeave={() => setHovered(undefined)} className={isHero ? "" : "cursor-pointer"}>
              <circle r={isHero ? 3 : active ? 9 : 6} fill={typeColorHex[h.type]} fillOpacity={isHero ? 0.5 : 1} stroke={active ? "#d98c2b" : "#ffffff"} strokeOpacity={isHero ? 0.4 : 1} strokeWidth={active ? 3 : isHero ? 1 : 2} className="transition" />
            </g>
          );
        })}
      </svg>
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
            <p className="rounded-sm bg-forest-900/0 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{hovered.type}</p>
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
      {!isHero && (
        <div className="pointer-events-none absolute bottom-4 left-4 flex max-w-[90%] flex-wrap gap-2 rounded-sm border border-white/20 bg-white/20 p-3 font-mono text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-md">
          {Object.entries(typeColorClass).map(([type,cls])=><span key={type} className="flex items-center gap-1"><i className={"h-2.5 w-2.5 rounded-full " + cls}/>{type}</span>)}
        </div>
      )}
    </section>
  );
}
