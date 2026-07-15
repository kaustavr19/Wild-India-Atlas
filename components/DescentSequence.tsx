"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Hotspot, Season } from "@/data/types";
import { projection, pathGen, VIEW_W, VIEW_H } from "@/components/IndiaMap";
import indiaStates from "@/data/india-states.json";
import { neighboringCountries } from "@/data/neighboringCountries";
import { HotspotImage } from "@/components/HotspotImage";
import { SearchBar } from "@/components/SearchBar";

const SEEN_KEY = "wia-descent-seen";
const CONTAINER_VH = 260;
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
      <div className="flex flex-wrap items-center gap-3">
        <p className="field-label flex items-center gap-3 text-biome-accent"><span className="h-px w-8 bg-biome-accent" />Field guide · Travel planner · Atlas</p>
        <span className="atlas-chip bg-black/10">Now · {currentSeason}</span>
      </div>
      <h1 className="display-hero mt-8 text-biome-ink">Explore India&apos;s<br /><em className="text-biome-accent">wild side.</em></h1>
      <p className="mt-8 max-w-xl text-lg leading-8 text-biome-ink/78">A living atlas for finding wildlife, reading seasons and choosing a responsible way into India&apos;s protected places.</p>
      <p className="field-label mt-5 text-biome-ink/48">{totalParks} field sites · {regionCount} regions · one seasonal map</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/map" className="atlas-button">Open the wildlife map <ArrowRight size={16} /></Link>
        <Link href={"/map?season=" + encodeURIComponent(currentSeason)} className="atlas-button atlas-button-ghost">Follow this season</Link>
      </div>
    </>
  );
}

// The hero's search bar + tag chips — this is the "converts from cinematic to functional"
// beat: identical markup to the old hero, just its own component so both the animated
// pop-in and the static landed state can render it without duplicating the JSX.
function HeroFunctional() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/map?query=${encodeURIComponent(value)}` : "/map");
  }
  return (
    <>
      <form onSubmit={submit} className="mt-8 grid max-w-2xl gap-2 sm:grid-cols-[1fr_auto]">
        <SearchBar value={query} onChange={setQuery} placeholder="Search species, park, state or habitat…" variant="dark" />
        <button type="submit" className="atlas-button">Search atlas <ArrowRight size={14} /></button>
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map(c => <Link href={"/map?query=" + encodeURIComponent(c)} key={c} className="atlas-chip bg-black/10 transition hover:border-biome-accent hover:text-biome-accent">{c}</Link>)}
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
    <section className="biome-forest group relative isolate flex min-h-[760px] items-center overflow-hidden px-4 pb-16 pt-28 text-biome-ink sm:px-6 sm:pt-20 lg:min-h-[860px]">
      <HotspotImage slug={featured.slug} type={featured.type} className="hero-ken-burns absolute inset-0 -z-20 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,30,21,.98)_6%,rgba(20,47,37,.88)_44%,rgba(20,47,37,.38)_76%,rgba(20,47,37,.12)_100%),linear-gradient(0deg,rgba(10,28,20,.7),transparent_45%)]" />
      <div className="texture-topography pointer-events-none absolute inset-0 -z-10 opacity-20" />
      <p className="field-label absolute bottom-8 right-6 hidden origin-bottom-right -rotate-90 text-biome-ink/38 lg:block">Field station · 22.9734° N · 78.6569° E</p>
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
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
      <div className="biome-forest sticky top-0 isolate h-screen w-full bg-[#153b48]">
        {/* Media layers clip to the stage edge-to-edge; kept in their own overflow-hidden
            wrapper so the text layer below is free to overflow gracefully on very short
            viewports instead of being invisibly clipped. */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="canopy-texture pointer-events-none absolute inset-0" />
          <div className="texture-topography pointer-events-none absolute inset-0 opacity-25" />
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

          <div className="group absolute inset-0" style={{ opacity: photoT }}>
            <HotspotImage slug={featured.slug} type={featured.type} className="hero-ken-burns absolute inset-0 h-full w-full" />
            {/* Same 100deg left-to-right vignette as the landed hero (darkest behind the
                left-aligned text column, lightest toward the right where photo detail
                should read through) rather than a generic bottom-heavy fade, so the
                animated and landed hero states use one consistent, actually-editorial
                vignette instead of two different ad-hoc ones. */}
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgba(10,30,21,.98)_6%,rgba(20,47,37,.88)_44%,rgba(20,47,37,.38)_76%,rgba(20,47,37,.12)_100%),linear-gradient(0deg,rgba(10,28,20,.7),transparent_45%)]" />
          </div>
        </div>

        <div
          className="relative flex h-full items-center px-4 pb-16 pt-28 sm:px-6 sm:pt-16"
          style={{ opacity: textT, transform: "translateY(" + (1 - textT) * 28 + "px)" }}
        >
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-3xl text-biome-ink">
              <HeroCopy totalParks={totalParks} regionCount={regionCount} currentSeason={currentSeason} />
              <div style={{ opacity: functionalOpacity, transform: "scale(" + functionalScale + ")", transformOrigin: "left top" }}>
                <HeroFunctional />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center" style={{ opacity: 1 - cueT }}>
          <p className="field-label flex items-center gap-3 text-biome-ink/55"><span className="h-px w-8 bg-biome-accent/60" />Scroll to enter the atlas ↓</p>
        </div>
      </div>
    </div>
  );
}
