"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin, PawPrint, Search } from "lucide-react";
import type { Hotspot, Season } from "@/data/types";
import { HotspotImage } from "@/components/HotspotImage";
import { hotspots } from "@/data/hotspots";
import { species } from "@/data/species";
import { searchAtlas, type AtlasSearchItem } from "@/lib/atlasSearch";

const CHIPS = ["Tiger", "Birds", "Rhino", "Snow Leopard", "Mangroves", "Wetlands", "Western Ghats"];

type DescentProps = { featured: Hotspot; totalParks: number; regionCount: number; currentSeason: Season };

// Keep the public component boundary stable while always rendering the regular homepage
// hero. The former first-visit scroll sequence was removed because it interrupted entry
// into the site. Existing wia-descent-seen values are deliberately left untouched.
export function DescentSequence(props: DescentProps) {
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
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const searchItems = useMemo<AtlasSearchItem[]>(() => [
    ...species.map((item) => ({ id: `species:${item.slug}`, title: item.commonName, subtitle: `${item.category} · ${item.difficultyOfSighting} sighting`, keywords: `${item.scientificName} ${item.habitat} ${item.conservationStatus}`, href: `/species/${item.slug}`, kind: "Species" as const })),
    ...hotspots.map((item) => ({ id: `place:${item.slug}`, title: item.name, subtitle: `${item.state} · ${item.type}`, keywords: `${item.region} ${item.habitat} ${item.mainSpecies.join(" ")} ${item.birdSpecies.join(" ")} ${item.knownFor.join(" ")}`, href: `/hotspots/${item.slug}`, kind: "Place" as const })),
  ], []);
  const suggestions = useMemo(() => searchAtlas(searchItems, query), [query, searchItems]);

  function updateQuery(value: string) {
    setQuery(value);
    setOpen(Boolean(value.trim()));
    setActiveIndex(-1);
  }

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    navigateFromSearch();
  }

  function navigateFromSearch() {
    const value = query.trim();
    const selected = suggestions[activeIndex >= 0 ? activeIndex : 0];
    setOpen(false);
    router.push(selected?.href ?? (value ? `/map?query=${encodeURIComponent(value)}` : "/map"));
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") { setOpen(false); setActiveIndex(-1); return; }
    if (event.key === "Enter") { event.preventDefault(); navigateFromSearch(); return; }
    if (!suggestions.length || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
    event.preventDefault();
    setOpen(true);
    setActiveIndex((current) => event.key === "ArrowDown" ? (current + 1) % suggestions.length : (current <= 0 ? suggestions.length - 1 : current - 1));
  }
  return (
    <>
      <form onSubmit={submit} role="search" className="relative mt-8 max-w-2xl">
        <label htmlFor="atlas-home-search" className="sr-only">Search the wildlife atlas</label>
        <Search aria-hidden="true" className="pointer-events-none absolute left-5 top-1/2 z-10 -translate-y-1/2 text-biome-accent" size={20} strokeWidth={2.2} />
        <input
          id="atlas-home-search"
          type="search"
          value={query}
          onChange={(event) => updateQuery(event.target.value)}
          onFocus={() => setOpen(Boolean(query.trim()))}
          onBlur={() => window.setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder="Search species, park, state or habitat…"
          autoComplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open && suggestions.length > 0}
          aria-controls="atlas-home-suggestions"
          aria-activedescendant={activeIndex >= 0 ? `atlas-suggestion-${activeIndex}` : undefined}
          className="min-h-14 w-full rounded-full border border-white/30 bg-black/30 py-3 pl-14 pr-5 text-base text-white shadow-[0_16px_45px_rgba(4,18,13,.18)] outline-none backdrop-blur-xl transition placeholder:text-white/65 focus:border-biome-accent focus:ring-2 focus:ring-biome-accent/35"
        />
        {open && query.trim() && (
          <div id="atlas-home-suggestions" role="listbox" aria-label="Atlas suggestions" className="atlas-scrollbar absolute inset-x-0 bottom-[calc(100%+.65rem)] z-30 max-h-72 overflow-y-auto rounded-field border border-white/15 bg-forest-950/95 p-2 text-white shadow-[0_24px_70px_rgba(4,18,13,.4)] backdrop-blur-xl sm:bottom-auto sm:top-[calc(100%+.65rem)]">
            {suggestions.length ? suggestions.map((item, index) => (
              <Link
                id={`atlas-suggestion-${index}`}
                role="option"
                aria-selected={activeIndex === index}
                key={item.id}
                href={item.href}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => setOpen(false)}
                className={`flex min-h-14 items-center gap-3 rounded-field px-3 py-2 text-left transition ${activeIndex === index ? "bg-sand text-forest-950" : "text-white hover:bg-white/10"}`}
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border ${activeIndex === index ? "border-forest-950/15" : "border-white/15 text-sand"}`}>{item.kind === "Place" ? <MapPin size={15} /> : <PawPrint size={15} />}</span>
                <span className="min-w-0 flex-1"><span className="block truncate font-semibold">{item.title}</span><span className={`mt-0.5 block truncate text-xs ${activeIndex === index ? "text-forest-950/65" : "text-white/65"}`}>{item.subtitle}</span></span>
                <span className={`field-label ${activeIndex === index ? "text-forest-950/60" : "text-white/60"}`}>{item.kind}</span>
              </Link>
            )) : (
              <div className="px-4 py-4"><p className="text-sm font-semibold">No direct match yet</p><p className="mt-1 text-xs text-white/65">Press Enter to search the full map for “{query.trim()}”.</p></div>
            )}
          </div>
        )}
      </form>
      <div className="mt-4 flex flex-wrap gap-2">
        {CHIPS.map(c => <Link href={"/map?query=" + encodeURIComponent(c)} key={c} className="atlas-chip bg-black/10 transition hover:border-biome-accent hover:text-biome-accent">{c}</Link>)}
      </div>
    </>
  );
}

// The standard homepage hero. It keeps the existing content, search and links without
// adding first-visit-only scroll height or reading browser storage.
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
