"use client";

import Link from "next/link";
import { ArrowRight, BookmarkCheck, CalendarDays, CloudRain, Compass, Leaf, MapPin, Route, ShieldAlert, Sparkles, Sun, Wind } from "lucide-react";
import { useEffect, useState } from "react";
import { hotspots } from "@/data/hotspots";
import { species } from "@/data/species";
import { seasonalWisdom } from "@/data/seasonalWisdom";
import { closureInfo } from "@/data/closures";
import { ecosystem } from "@/data/ecosystems";
import type { Region } from "@/data/types";
import { HotspotImage } from "@/components/HotspotImage";
import { SpeciesCard } from "@/components/SpeciesCard";
import { JournalSaveButton } from "@/components/JournalSaveButton";
import { useJournal } from "@/components/JournalProvider";
import { MONTHS, SEASON_STORIES, isMonth, recommendationsFor, seasonForMonth, speciesForRecommendations, type ExperienceFilter, type Month, type RegionFilter } from "@/lib/seasonalPlanner";

const regions: RegionFilter[] = ["All regions", "North", "South", "East", "West", "Central", "Northeast", "Islands"];
const experiences: ExperienceFilter[] = ["All experiences", "Safari", "Birding", "Photography", "Trekking", "Offbeat"];
const seasonIcon = { Winter: Wind, Summer: Sun, Monsoon: CloudRain, "Post-monsoon": Leaf };

function validRegion(value: string | null): value is RegionFilter { return Boolean(value && regions.includes(value as RegionFilter)); }
function validExperience(value: string | null): value is ExperienceFilter { return Boolean(value && experiences.includes(value as ExperienceFilter)); }

export function SeasonalPlanner() {
  const [month, setMonth] = useState<Month>("Nov");
  const [region, setRegion] = useState<RegionFilter>("All regions");
  const [experience, setExperience] = useState<ExperienceFilter>("All experiences");
  const [ready, setReady] = useState(false);
  const [trailNotice, setTrailNotice] = useState("");
  const { isSaved, saveMany, hydrated } = useJournal();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const queryMonth = query.get("month");
    const queryRegion = query.get("region");
    const queryExperience = query.get("experience");
    setMonth(isMonth(queryMonth) ? queryMonth : MONTHS[new Date().getMonth()]);
    if (validRegion(queryRegion)) setRegion(queryRegion);
    if (validExperience(queryExperience)) setExperience(queryExperience);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const query = new URLSearchParams();
    query.set("month", month);
    if (region !== "All regions") query.set("region", region);
    if (experience !== "All experiences") query.set("experience", experience);
    window.history.replaceState(null, "", `/seasonal-planner?${query.toString()}`);
  }, [experience, month, ready, region]);

  const season = seasonForMonth(month);
  const story = SEASON_STORIES[season];
  const Icon = seasonIcon[season];
  const matches = recommendationsFor(hotspots, month, region, experience);
  const featured = matches.slice(0, 6);
  const trail = matches.slice(0, 3);
  const wildlife = speciesForRecommendations(matches, species);
  const trailSaved = hydrated && trail.length > 0 && trail.every((item) => isSaved("hotspot", item.slug));

  function saveTrail() {
    if (!trail.length || trailSaved) return;
    saveMany(trail.map((item) => ({ type: "hotspot" as const, slug: item.slug })));
    setTrailNotice(`${month} trail saved to your field journal.`);
  }

  return (
    <main className={`biome-${story.biome} min-h-screen bg-paper text-ink`}>
      <section className="biome-surface texture-grain texture-topography relative min-h-[78svh] overflow-hidden border-b border-white/10 px-4 pb-14 pt-32 sm:px-6 sm:pb-20">
        <div className="pointer-events-none absolute -right-16 top-24 hidden h-[32rem] w-[32rem] rounded-full border border-biome-accent/20 lg:block" />
        <div className="pointer-events-none absolute -right-4 top-36 hidden h-[24rem] w-[24rem] rounded-full border border-biome-accent/15 lg:block" />
        <div className="relative z-[2] mx-auto flex min-h-[58svh] max-w-7xl flex-col justify-between">
          <div className="grid items-end gap-10 lg:grid-cols-[1fr_360px]">
            <div className="motion-reveal">
              <p className="field-label flex items-center gap-2 text-biome-accent"><CalendarDays size={15} /> Seasonal field planner</p>
              <p className="field-label mt-8 text-biome-ink/45">{month} · {season}</p>
              <h1 className="display-hero mt-4 max-w-[10ch] text-biome-ink">{story.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-biome-ink/68 sm:text-xl sm:leading-9">{story.signal}</p>
            </div>
            <aside className="shell-chrome rounded-field p-6">
              <Icon size={24} className="text-biome-accent" />
              <p className="field-label mt-5 text-biome-accent">Field signal</p>
              <p className="mt-3 font-display text-2xl leading-snug text-biome-ink">{story.fieldNote}</p>
              <p className="mt-5 border-t border-white/10 pt-4 text-xs leading-6 text-biome-ink/48">Seasonal signals guide discovery, not bookings. Access and weather can change quickly—confirm locally before travelling.</p>
            </aside>
          </div>

          <div className="mt-12">
            <p className="field-label text-biome-ink/45">Choose your field month</p>
            <div className="atlas-scrollbar mt-3 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Choose a month">
              {MONTHS.map((item, index) => <button key={item} type="button" aria-pressed={month === item} onClick={() => setMonth(item)} className={`min-h-14 min-w-16 shrink-0 rounded-field border px-3 text-left transition ${month === item ? "border-biome-accent bg-biome-accent text-biome-surface" : "border-white/15 bg-white/[0.04] text-biome-ink/65 hover:border-biome-accent/60 hover:text-biome-accent"}`}><span className="block font-mono text-[9px] opacity-60">{String(index + 1).padStart(2, "0")}</span><span className="mt-1 block font-display text-lg">{item}</span></button>)}
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-[65px] z-30 border-b border-forest-900/10 bg-paper/92 px-4 py-4 backdrop-blur-xl sm:px-6" aria-label="Planner filters">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-end">
          <label className="min-w-0 flex-1"><span className="field-label text-slate-500">Region</span><select aria-label="Filter by region" value={region} onChange={(event) => setRegion(event.target.value as RegionFilter)} className="mt-1 min-h-11 w-full rounded-field border border-forest-900/15 bg-paper px-3 text-sm text-ink">{regions.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label className="min-w-0 flex-1"><span className="field-label text-slate-500">Experience</span><select aria-label="Filter by experience" value={experience} onChange={(event) => setExperience(event.target.value as ExperienceFilter)} className="mt-1 min-h-11 w-full rounded-field border border-forest-900/15 bg-paper px-3 text-sm text-ink">{experiences.map((item) => <option key={item}>{item}</option>)}</select></label>
          <Link href={`/map?season=${encodeURIComponent(season)}`} className="atlas-button !bg-forest-900 !border-forest-900 !text-white"><Compass size={15} /> See {month} on the atlas</Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24" aria-labelledby="seasonal-results-title">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="field-label text-forest-700">{season} · {matches.length} matching places</p><h2 id="seasonal-results-title" className="display-section mt-3 text-forest-900">Where the month comes alive.</h2></div>
          <p className="max-w-md text-sm leading-7 text-slate-600" aria-live="polite">Showing {region.toLowerCase()} · {experience.toLowerCase()} · best during {month}</p>
        </div>

        {featured.length ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((hotspot) => <article key={hotspot.slug} className="field-card field-card-lift overflow-hidden rounded-field"><div className="relative"><HotspotImage slug={hotspot.slug} type={hotspot.type} className="h-56 w-full" /><span className="absolute left-4 top-4 rounded-full bg-forest-900/88 px-3 py-1 font-mono text-[9px] font-semibold uppercase tracking-wider text-sand">{ecosystem[hotspot.slug]} · {hotspot.region}</span></div><div className="p-5"><p className="flex items-center gap-1.5 text-xs text-slate-500"><MapPin size={13} />{hotspot.state}</p><h3 className="mt-2 font-display text-3xl text-forest-900">{hotspot.name}</h3><p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{hotspot.summary}</p><div className="mt-5 flex flex-wrap items-center gap-2"><Link href={`/hotspots/${hotspot.slug}`} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-forest-900 px-4 text-xs font-bold text-white">Open guide <ArrowRight size={13} /></Link><JournalSaveButton type="hotspot" slug={hotspot.slug} compact /></div></div></article>)}
          </div>
        ) : (
          <div className="texture-field-grid mt-10 rounded-field border border-forest-900/10 px-6 py-20 text-center"><CloudRain className="mx-auto text-forest-700" /><h3 className="mt-5 font-display text-3xl text-forest-900">This trail is quiet.</h3><p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-slate-600">No atlas places match every selected signal. Widen the region or experience to reveal a route.</p><button type="button" onClick={() => { setRegion("All regions"); setExperience("All experiences"); }} className="mt-6 min-h-11 rounded-full border border-forest-900/20 px-5 text-xs font-bold text-forest-800">Reset filters</button></div>
        )}
      </section>

      {trail.length > 0 && <section className={`biome-${story.biome} biome-surface texture-topography content-auto border-y border-white/10 px-4 py-20 sm:px-6 sm:py-28`} aria-labelledby="trail-title"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]"><div><p className="field-label flex items-center gap-2 text-biome-accent"><Route size={14} /> {trail.length}-stop field trail</p><h2 id="trail-title" className="display-section mt-4 text-biome-ink">Carry the season with you.</h2><p className="mt-6 max-w-md text-base leading-7 text-biome-ink/60">A starting route drawn from your filters. Save {trail.length === 1 ? "this place" : `all ${trail.length} places`} to the journal, then shape the journey around access, distance and time.</p><button type="button" disabled={!hydrated || trailSaved} onClick={saveTrail} className="atlas-button mt-7 disabled:cursor-default disabled:opacity-60">{trailSaved ? <BookmarkCheck size={15} /> : <Sparkles size={15} />}{trailSaved ? "Trail saved" : "Save this trail"}</button><p className="mt-3 min-h-5 text-xs text-biome-accent" aria-live="polite">{trailNotice}</p></div><ol className="grid gap-3">{trail.map((hotspot, index) => <li key={hotspot.slug} className="shell-chrome grid grid-cols-[54px_1fr_auto] items-center gap-4 rounded-field p-4"><span className="font-display text-3xl text-biome-accent">{String(index + 1).padStart(2, "0")}</span><span className="min-w-0"><span className="block truncate font-display text-xl text-biome-ink">{hotspot.name}</span><span className="field-label mt-1 block truncate text-biome-ink/40">{hotspot.region} · {hotspot.idealDuration}</span></span><Link href={`/map?place=${hotspot.slug}`} aria-label={`Find ${hotspot.name} on the map`} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-biome-accent"><ArrowRight size={15} /></Link></li>)}</ol></div></section>}

      <section className="content-auto mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 sm:py-28 lg:grid-cols-[1fr_0.82fr]">
        <div><p className="field-label text-forest-700">Season intelligence</p><h2 className="display-section mt-4 text-forest-900">Read the conditions, not just the calendar.</h2><div className="mt-8 grid gap-4"><Signal icon={Sparkles} label="Best for" text={seasonalWisdom[season].bestFor} /><Signal icon={ShieldAlert} label="Check before you go" text={seasonalWisdom[season].avoid} /><Signal icon={CloudRain} label="Travel caution" text={seasonalWisdom[season].travelCaution} /></div></div>
        <aside className="field-card rounded-field p-6"><p className="field-label text-clay">Access notes on this trail</p><div className="mt-5 divide-y divide-forest-900/10">{featured.slice(0, 4).map((hotspot) => <div key={hotspot.slug} className="py-4 first:pt-0"><p className="font-display text-xl text-forest-900">{hotspot.name}</p><p className="mt-2 text-xs leading-6 text-slate-600">{closureInfo[hotspot.slug]?.note ?? "No researched seasonal closure note is available; confirm access locally."}</p></div>)}</div></aside>
      </section>

      {wildlife.length > 0 && <section className="content-auto border-t border-forest-900/10 px-4 py-20 sm:px-6 sm:py-24"><div className="mx-auto max-w-7xl"><p className="field-label text-forest-700">Wildlife to know</p><h2 className="display-section mt-4 text-forest-900">Learn the lives behind the route.</h2><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{wildlife.map((item) => <SpeciesCard key={item.slug} species={item} />)}</div></div></section>}
    </main>
  );
}

function Signal({ icon: Icon, label, text }: { icon: typeof Sparkles; label: string; text: string }) { return <article className="border-l border-forest-700/30 pl-5"><p className="field-label flex items-center gap-2 text-forest-700"><Icon size={13} />{label}</p><p className="mt-2 text-sm leading-7 text-slate-600">{text}</p></article>; }
