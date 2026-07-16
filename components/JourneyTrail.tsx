"use client";

import Link from "next/link";
import { ArrowRight, Compass, MapPin, PawPrint, Route, Sparkles, Trash2 } from "lucide-react";
import { hotspots } from "@/data/hotspots";
import { species } from "@/data/species";
import type { HotspotType } from "@/data/types";
import { getExtendedSpecies } from "@/lib/extendedSpecies";
import { hotspotsForSpecies } from "@/lib/speciesLinks";
import type { JourneyEntry } from "@/lib/journey";
import { HotspotImage } from "./HotspotImage";
import { SpeciesImage } from "./SpeciesImage";
import { useJourney } from "./JourneyProvider";

type ResolvedJourney = {
  entry: JourneyEntry;
  title: string;
  eyebrow: string;
  detail: string;
  href: string;
  image: React.ReactNode;
  nextHref: string;
  nextLabel: string;
};

const extendedSpecies = getExtendedSpecies();

function resolveJourney(entry: JourneyEntry): ResolvedJourney | null {
  if (entry.type === "hotspot") {
    const item = hotspots.find((candidate) => candidate.slug === entry.slug);
    if (!item) return null;
    return {
      entry,
      title: item.name,
      eyebrow: "Protected place",
      detail: `${item.state} · ${item.habitat}`,
      href: `/hotspots/${item.slug}`,
      image: <HotspotImage slug={item.slug} type={item.type as HotspotType} showCredit={false} className="h-full w-full" />,
      nextHref: `/map?place=${item.slug}`,
      nextLabel: "Return to this place on the map",
    };
  }

  const flagship = species.find((candidate) => candidate.slug === entry.slug);
  if (flagship) {
    const firstPlace = hotspotsForSpecies(flagship, hotspots)[0];
    return {
      entry,
      title: flagship.commonName,
      eyebrow: "Wildlife encounter",
      detail: `${flagship.category} · ${flagship.difficultyOfSighting} sighting`,
      href: `/species/${flagship.slug}`,
      image: <SpeciesImage slug={flagship.slug} category={flagship.category} showCredit={false} className="h-full w-full" />,
      nextHref: firstPlace ? `/map?place=${firstPlace.slug}` : "/hotspots",
      nextLabel: firstPlace ? `Follow it to ${firstPlace.name}` : "Find a landscape to explore",
    };
  }

  const extended = extendedSpecies.find((candidate) => candidate.slug === entry.slug);
  if (!extended) return null;
  const firstPlace = extended.confirmedAt[0];
  return {
    entry,
    title: extended.commonName,
    eyebrow: "Citizen-science sighting",
    detail: `${extended.iconicGroup} · confirmed at ${extended.confirmedAt.length} place${extended.confirmedAt.length === 1 ? "" : "s"}`,
    href: `/species/${extended.slug}`,
    image: extended.photoUrl
      ? <img src={extended.photoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
      : <div className="grid h-full place-items-center bg-forest-900 text-sand"><PawPrint size={28} /></div>,
    nextHref: firstPlace ? `/hotspots/${firstPlace.slug}` : "/hotspots",
    nextLabel: firstPlace ? `Explore ${firstPlace.hotspotName}` : "Find a landscape to explore",
  };
}

export function JourneyTrail() {
  const { entries, hydrated, clearJourney } = useJourney();
  const resolved = entries.map(resolveJourney).filter((item): item is ResolvedJourney => Boolean(item));
  const latest = resolved[0];

  if (!hydrated) return <section id="trail" className="mx-auto h-64 max-w-7xl scroll-mt-28 animate-pulse px-4 py-10 sm:px-6"><div className="h-full rounded-field bg-forest-900/5" /></section>;

  if (!latest) {
    return (
      <section id="trail" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-10 sm:px-6">
        <div className="texture-field-grid flex flex-col gap-6 rounded-field border border-forest-900/10 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="field-label flex items-center gap-2 text-forest-700"><Route size={14} /> Expedition trail</p><h2 className="mt-2 font-display text-3xl text-forest-900">Your path will gather as you explore.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Open a species or protected place and it will be waiting here when you return.</p></div>
          <Link href="/hotspots" className="atlas-button shrink-0">Choose a first landscape <ArrowRight size={14} /></Link>
        </div>
      </section>
    );
  }

  return (
    <section id="trail" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-10 sm:px-6">
      <div className="overflow-hidden rounded-field bg-forest-950 text-white shadow-[0_24px_70px_rgba(11,38,27,0.18)]">
        <div className="grid lg:grid-cols-[0.82fr_1.18fr]">
          <div className="relative min-h-64 overflow-hidden lg:min-h-[390px]">
            {latest.image}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <p className="field-label text-sand">Last encounter</p>
              <h2 className="mt-2 font-display text-4xl sm:text-5xl">{latest.title}</h2>
              <p className="mt-2 max-w-md text-sm text-white/65">{latest.detail}</p>
            </div>
          </div>

          <div className="flex flex-col p-6 sm:p-8 lg:p-10">
            <div className="flex items-start justify-between gap-5">
              <div><p className="field-label flex items-center gap-2 text-sand"><Route size={14} /> Your expedition trail</p><p className="mt-3 max-w-xl text-sm leading-6 text-white/60">The places and wild lives you opened most recently, kept only in this browser.</p></div>
              <button onClick={clearJourney} className="inline-flex min-h-11 shrink-0 items-center gap-2 text-xs font-semibold text-white/45 transition hover:text-sand" aria-label="Clear expedition trail"><Trash2 size={13} /> <span className="hidden sm:inline">Clear</span></button>
            </div>

            <div className="mt-7 border-y border-white/12 py-6">
              <p className="field-label flex items-center gap-2 text-white/45"><Sparkles size={13} /> Suggested next step</p>
              <Link href={latest.nextHref} className="group mt-3 flex items-center justify-between gap-5">
                <span className="font-display text-2xl leading-tight text-white transition group-hover:text-sand sm:text-3xl">{latest.nextLabel}</span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/20 transition group-hover:border-sand group-hover:bg-sand group-hover:text-forest-950"><ArrowRight size={17} /></span>
              </Link>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between"><p className="field-label text-white/45">Recent bearings · {resolved.length}</p><Link href={latest.href} className="text-xs font-bold text-sand underline underline-offset-4">Reopen latest</Link></div>
              <div className="mt-4 flex flex-wrap gap-2">
                {resolved.slice(0, 6).map((item, index) => (
                  <Link key={item.entry.id} href={item.href} aria-current={index === 0 ? "true" : undefined} className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-3.5 text-xs font-semibold transition ${index === 0 ? "border-sand bg-sand text-forest-950" : "border-white/15 text-white/68 hover:border-sand hover:text-sand"}`}>
                    {item.entry.type === "hotspot" ? <MapPin size={13} /> : <PawPrint size={13} />}{item.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto flex flex-wrap gap-3 pt-7"><Link href="/map" className="atlas-button"><Compass size={14} /> Open the atlas</Link><Link href="/seasonal-planner" className="atlas-button atlas-button-ghost">Read the season</Link></div>
          </div>
        </div>
      </div>
    </section>
  );
}
