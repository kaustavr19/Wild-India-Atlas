"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Hotspot, Season } from "@/data/types";
import { projection, pathGen, VIEW_W, VIEW_H } from "@/components/IndiaMap";
import indiaStates from "@/data/india-states.json";
import { neighboringCountries } from "@/data/neighboringCountries";
import { HotspotImage } from "@/components/HotspotImage";
import { SearchBar } from "@/components/SearchBar";

const SEEN_KEY = "wia-descent-seen";
const CONTAINER_VH = 320;
const CHIPS = ["Tiger", "Birds", "Rhino", "Snow Leopard", "Mangroves", "Wetlands", "Western Ghats"];

function clamp01(n: number) { return Math.min(1, Math.max(0, n)); }
function phase(p: number, start: number, end: number) { return clamp01((p - start) / (end - start)); }
function easeInOutCubic(t: number) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
function easeOutBack(t: number) { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function markSeen() {
  try { localStorage.setItem(SEEN_KEY, "1"); } catch {}
}

type DescentProps = { featured: Hotspot; totalParks: number; regionCount: number; currentSeason: Season };

// Plays the tall scroll-linked sequence once per browser, only on a true first visit with
// motion allowed. Every other case (already seen, or prefers-reduced-motion) renders the
// same fully-landed hero immediately, with no added scroll height and no animation. The
// default (both server and pre-effect client render) is the landed hero, not nothing — so
// the common repeat-visit case never flashes empty content. Only a genuine first-time
// visitor briefly sees the landed hero for one frame before this upgrades into the tall
// animated version; useLayoutEffect (rather than useEffect) keeps that window as small as
// the browser allows, though a cold SSR load can't avoid it entirely since localStorage
// only resolves client-side.
export function DescentSequence(props: DescentProps) {
  const [playAnimated, setPlayAnimated] = useState(false);

  useLayoutEffect(() => {
    let seen = true;
    try { seen = localStorage.getItem(SEEN_KEY) === "1"; } catch { seen = true; }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!seen && !reduced) {
      setPlayAnimated(true);
    } else {
      markSeen();
    }
  }, []);

  if (playAnimated) return <ScrollDescent {...props} />;
  return <LandedDescent {...props} />;
}

// The site's hero copy — eyebrow, headline, tagline, stat line, and CTAs — moved here
// verbatim from the old app/page.tsx hero <section>, which this phase removes. The
// "This month's pick" badge line that used to sit here was removed in Phase 3: it was
// redundant once the section below properly names and explains the featured park.
// Shared between the animated landed state and the static (repeat-visit /
// reduced-motion) state so the copy only lives in one place.
function HeroCopy({ totalParks, regionCount, currentSeason }: { totalParks: number; regionCount: number; currentSeason: Season }) {
  return (
    <>
      <p className="flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-[0.25em] text-sand"><span className="h-px w-8 bg-sand" />Field guide · Travel planner · Atlas</p>
      <h1 className="mt-6 text-6xl font-semibold leading-[0.98] tracking-tight sm:text-7xl">Explore India&apos;s<br /><em className="text-sand not-italic">Wild Side</em></h1>
      <p className="mt-6 max-w-lg text-lg leading-8 text-ivory/90">Plan wildlife, birding, and nature trips across India by species, season, region, and experience.</p>
      <p className="mt-4 font-mono text-xs uppercase tracking-[0.15em] text-ivory/60">{totalParks} parks — {regionCount} regions — live seasonal map</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/map" className="inline-flex items-center gap-2 rounded-sm bg-amberfield px-5 py-3 font-bold text-forest-900 transition hover:bg-white">Open Wildlife Map <ArrowRight size={18} /></Link>
        <Link href={"/map?season=" + encodeURIComponent(currentSeason)} className="inline-flex items-center gap-2 rounded-sm border border-white/30 px-5 py-3 font-bold text-white transition hover:border-white hover:bg-white/10">Where to go this month</Link>
      </div>
    </>
  );
}

// The hero's search bar + tag chips — this is the "converts from cinematic to functional"
// beat: identical markup to the old hero, just its own component so both the animated
// pop-in and the static landed state can render it without duplicating the JSX.
function HeroFunctional() {
  const [query, setQuery] = useState("");
  return (
    <>
      <div className="mt-8 max-w-xl"><SearchBar value={query} onChange={setQuery} placeholder="Search by species, park, state, season..." /></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map(c => <Link href={"/map?query=" + encodeURIComponent(c)} key={c} className="rounded-sm border border-white/25 px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-white/80 transition hover:border-sand hover:text-sand">{c}</Link>)}
      </div>
    </>
  );
}

// Fully-landed hero, no scroll-jacking: used for repeat visits (already seen) and
// prefers-reduced-motion, and as the default first paint before a true first-visit
// upgrades into ScrollDescent. Same outer sizing as the old static hero section
// (min-h-[720px]/[820px]) since it now holds the same amount of content.
function LandedDescent({ featured, totalParks, regionCount, currentSeason }: DescentProps) {
  return (
    <section className="relative isolate flex min-h-[720px] items-center overflow-hidden px-4 pb-16 pt-28 text-white sm:px-6 sm:pt-16 lg:min-h-[820px]">
      <HotspotImage slug={featured.slug} type={featured.type} className="absolute inset-0 -z-20 h-full w-full" showCredit={false} />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(20,47,37,.96)_10%,rgba(20,47,37,.75)_45%,rgba(20,47,37,.35)_75%,rgba(20,47,37,.15)_100%),linear-gradient(0deg,rgba(20,47,37,.55),transparent_40%)]" />
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-2xl">
          <HeroCopy totalParks={totalParks} regionCount={regionCount} currentSeason={currentSeason} />
          <HeroFunctional />
        </div>
      </div>
    </section>
  );
}

// Tall container + sticky full-viewport stage: scrolling through the container drives
// progress 0-1, which drives the map zoom/pan, the photo crossfade, the fused hero-copy
// reveal, and — as the final beat — the search bar/chips popping in once progress nears
// the end of the zoom range (phase 0.85-1). That's a scroll-progress trigger rather than
// a scroll-idle/dwell timer: everything else in the sequence is already scroll-linked, so
// this keeps the whole mechanic on one consistent model instead of mixing in a timer.
// Once the container's height is exhausted the sticky stage unpins naturally, landing on
// the same fully-popped-in state LandedDescent renders directly, and normal scrolling
// carries on into the next section (the same featured park's continuation section).
function ScrollDescent({ featured, totalParks, regionCount, currentSeason }: DescentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => { markSeen(); }, []);

  useEffect(() => {
    function update() {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      setProgress(total > 0 ? clamp01(scrolled / total) : 0);
    }
    function onScroll() {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => { update(); rafRef.current = null; });
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const zoomT = easeInOutCubic(phase(progress, 0, 0.5));
  const darkenT = phase(progress, 0.15, 0.55);
  const photoT = phase(progress, 0.4, 0.78);
  const textT = easeInOutCubic(phase(progress, 0.68, 0.96));
  const cueT = phase(progress, 0, 0.12);
  const functionalRaw = phase(progress, 0.85, 1);
  const functionalOpacity = phase(progress, 0.85, 0.94);
  const functionalScale = lerp(0.9, 1, clamp01(easeOutBack(functionalRaw)));

  const point = projection([featured.coordinates.longitude, featured.coordinates.latitude]);
  const zoomW = VIEW_W * 0.14;
  const zoomH = (zoomW / VIEW_W) * VIEW_H;
  const targetView = point
    ? {
        x: Math.min(Math.max(point[0] - zoomW / 2, 0), VIEW_W - zoomW),
        y: Math.min(Math.max(point[1] - zoomH / 2, 0), VIEW_H - zoomH),
        w: zoomW,
        h: zoomH,
      }
    : { x: 0, y: 0, w: VIEW_W, h: VIEW_H };

  const view = {
    x: lerp(0, targetView.x, zoomT),
    y: lerp(0, targetView.y, zoomT),
    w: lerp(VIEW_W, targetView.w, zoomT),
    h: lerp(VIEW_H, targetView.h, zoomT),
  };

  return (
    <div ref={containerRef} style={{ height: CONTAINER_VH + "vh" }} className="relative">
      <div className="sticky top-0 isolate h-screen w-full bg-[#1c3a4a]">
        {/* Media layers clip to the stage edge-to-edge; kept in their own overflow-hidden
            wrapper so the text layer below is free to overflow gracefully on very short
            viewports instead of being invisibly clipped. */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="canopy-texture pointer-events-none absolute inset-0" />
          <svg
            viewBox={view.x + " " + view.y + " " + view.w + " " + view.h}
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 h-full w-full"
          >
            <g pointerEvents="none">
              {neighboringCountries.features.map((f, i) => (
                <path key={i} d={pathGen(f) ?? undefined} fill="#3d4f42" fillOpacity={0.35} stroke="#1c3a4a" strokeWidth={1} />
              ))}
            </g>
            <g>
              {(indiaStates as GeoJSON.FeatureCollection).features.map((f, i) => (
                <path key={i} d={pathGen(f) ?? undefined} fill="#4a5c47" fillOpacity={0.6} stroke="#fbf7ec" strokeOpacity={0.3} strokeWidth={1.2} />
              ))}
            </g>
            {point && (
              <g transform={"translate(" + point[0] + "," + point[1] + ")"}>
                <circle r={9} fill="none" stroke="#d98c2b" strokeOpacity={0.5} strokeWidth={1.5} className="animate-ping" />
                <circle r={4} fill="#d98c2b" stroke="#ffffff" strokeWidth={1.5} />
              </g>
            )}
          </svg>

          <div className="absolute inset-0 bg-forest-900" style={{ opacity: darkenT * 0.55 }} />

          <div className="absolute inset-0" style={{ opacity: photoT }}>
            <HotspotImage slug={featured.slug} type={featured.type} className="absolute inset-0 h-full w-full" showCredit={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/65 to-forest-900/20" />
          </div>
        </div>

        <div
          className="relative flex h-full items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-16"
          style={{ opacity: textT, transform: "translateY(" + (1 - textT) * 28 + "px)" }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-2xl text-white">
              <HeroCopy totalParks={totalParks} regionCount={regionCount} currentSeason={currentSeason} />
              <div style={{ opacity: functionalOpacity, transform: "scale(" + functionalScale + ")", transformOrigin: "left top" }}>
                <HeroFunctional />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center" style={{ opacity: 1 - cueT }}>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/60">Scroll to begin ↓</p>
        </div>
      </div>
    </div>
  );
}
