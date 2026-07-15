"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, ArrowUpRight, Binoculars, Check, CloudRain, Compass, Database, Mountain, PawPrint, ShieldAlert, Waves } from "lucide-react";
import { useMemo } from "react";
import { BiomeSurface } from "@/components/BiomeSurface";
import { DescentSequence } from "@/components/DescentSequence";
import { HotspotImage } from "@/components/HotspotImage";
import { closureInfo } from "@/data/closures";
import { ecosystem, type Ecosystem } from "@/data/ecosystems";
import { hotspots } from "@/data/hotspots";
import { monthToSeason } from "@/data/seasonalWisdom";
import { structuralRisks } from "@/data/structuralRisks";
import type { Hotspot, Season } from "@/data/types";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";
import hotspotImages from "@/data/hotspot-images.json";

const monthAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const monthName = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const hotspotImagesBySlug = hotspotImages as Record<string, { title?: string } | undefined>;

function bestForSentence(hotspot: Hotspot, monthLabel: string) {
  const eco = ecosystem[hotspot.slug];
  const ecoText = eco ? `${eco} habitat` : hotspot.habitat;
  const article = /^[aeiou]/i.test(ecoText) ? "an" : "a";
  const species = [...hotspot.mainSpecies, ...hotspot.birdSpecies].slice(0, 2);
  const speciesText = species.length === 2 ? `${species[0]} and ${species[1]}` : species[0];
  return `${hotspot.name} is ${article} ${ecoText}${speciesText ? `, known for ${speciesText}` : ""}. ${monthLabel} is one of its best months to visit.`;
}

function photoShowsFauna(hotspot: Hotspot) {
  const title = hotspotImagesBySlug[hotspot.slug]?.title?.toLowerCase();
  if (!title) return false;
  return [...hotspot.mainSpecies, ...hotspot.birdSpecies].some((species) => title.includes(species.toLowerCase()));
}

function firstPhotographedHotspot(predicate: (hotspot: Hotspot) => boolean) {
  return hotspots.find((hotspot) => predicate(hotspot) && !!hotspotImagesBySlug[hotspot.slug]) ?? hotspots.find(predicate) ?? hotspots[0];
}

const trailDefinitions = [
  {
    number: "01",
    eyebrow: "Big-cat country",
    title: "Follow the tiger",
    description: "Move through sal forest, grassland and dry teak landscapes shaped by India’s most iconic predator.",
    href: "/map?query=Tiger",
    hotspot: firstPhotographedHotspot((h) => hotspotImagesBySlug[h.slug]?.title?.toLowerCase().includes("tiger") === true),
    count: hotspots.filter((h) => [...h.mainSpecies, ...h.knownFor].some((item) => item.toLowerCase().includes("tiger"))).length,
    icon: PawPrint,
  },
  {
    number: "02",
    eyebrow: "Seasonal passage",
    title: "Enter the monsoon",
    description: "Find landscapes transformed by cloud, bloom and flood—and know which routes close when the rain arrives.",
    href: "/map?season=Monsoon",
    hotspot: firstPhotographedHotspot((h) => h.bestSeason.includes("Monsoon")),
    count: hotspots.filter((h) => h.bestSeason.includes("Monsoon")).length,
    icon: CloudRain,
  },
  {
    number: "03",
    eyebrow: "Water & wingbeat",
    title: "Search the wetlands",
    description: "Follow river channels, reed beds and winter flyways through India’s great birding landscapes.",
    href: "/map?query=Wetland",
    hotspot: firstPhotographedHotspot((h) => ecosystem[h.slug] === "wetland"),
    count: hotspots.filter((h) => ecosystem[h.slug] === "wetland").length,
    icon: Waves,
  },
  {
    number: "04",
    eyebrow: "Above the treeline",
    title: "Climb into thin air",
    description: "Read cold deserts, flower valleys and high passes through the animals adapted to the Himalaya.",
    href: "/map?query=Himalayan",
    hotspot: firstPhotographedHotspot((h) => ecosystem[h.slug] === "alpine"),
    count: hotspots.filter((h) => ecosystem[h.slug] === "alpine").length,
    icon: Mountain,
  },
];

const biomePassage = biomeThemes.map((theme) => ({
  ...theme,
  hotspot: firstPhotographedHotspot((hotspot) => ecosystem[hotspot.slug] === theme.key),
  count: hotspots.filter((hotspot) => ecosystem[hotspot.slug] === theme.key).length,
  query: theme.key === "alpine" ? "Himalayan" : theme.key === "wetland" ? "Wetland" : theme.key[0].toUpperCase() + theme.key.slice(1),
}));

const verifiedCount = Object.values(closureInfo).filter((closure) => closure.confidence === "official" || closure.confidence === "inferred").length;
const structuralRiskCount = Object.keys(structuralRisks).length;

function TrailCard({ trail, index }: { trail: (typeof trailDefinitions)[number]; index: number }) {
  const Icon = trail.icon;
  const sizing = index === 0 ? "md:col-span-2 md:row-span-2 min-h-[520px]" : index === 1 ? "md:col-span-2 min-h-[300px]" : "min-h-[300px]";
  return (
    <Link href={trail.href} className={`group relative isolate flex overflow-hidden rounded-field ${sizing}`}>
      <HotspotImage slug={trail.hotspot.slug} type={trail.hotspot.type} className="absolute inset-0 -z-20 h-full w-full transition duration-1000 ease-field group-hover:scale-105" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0d1f18] via-[#142f25]/55 to-[#142f25]/10" />
      <div className="absolute inset-0 -z-10 opacity-25 texture-topography" />
      <div className="flex w-full flex-col justify-between p-5 text-white sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="field-label text-sand">{trail.number} · {trail.eyebrow}</span>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/15 backdrop-blur-sm"><Icon size={17} /></span>
        </div>
        <div>
          <h3 className={`${index === 0 ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"} max-w-xl font-medium text-white`}>{trail.title}</h3>
          <p className="mt-3 max-w-xl text-sm leading-6 text-white/72">{trail.description}</p>
          <div className="field-label mt-5 flex items-center gap-2 text-sand">{trail.count} {trail.count === 1 ? "place" : "places"} on this trail <ArrowRight size={14} className="transition group-hover:translate-x-1" /></div>
        </div>
      </div>
    </Link>
  );
}

function SeasonalStory({ featured, otherBets, currentMonth, currentSeason }: { featured: Hotspot; otherBets: Hotspot[]; currentMonth: number; currentSeason: Season }) {
  const closure = closureInfo[featured.slug];
  const risk = structuralRisks[featured.slug];
  const featuredBiome: Ecosystem = ecosystem[featured.slug] ?? "forest";
  return (
    <BiomeSurface biome={featuredBiome} textured className="overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16">
          <div className="relative min-h-[500px] sm:min-h-[620px]">
            <div className="absolute -left-2 top-0 font-display text-[9rem] leading-none text-biome-accent/12 sm:text-[13rem]">{String(currentMonth + 1).padStart(2, "0")}</div>
            <HotspotImage slug={featured.slug} type={featured.type} className="image-mask-organic absolute inset-x-4 bottom-0 h-[82%] shadow-lift sm:inset-x-10" />
            <div className="absolute bottom-5 left-0 rounded-field border border-white/15 bg-black/30 px-4 py-3 backdrop-blur-md sm:left-3">
              <p className="field-label text-biome-accent">Field location</p>
              <p className="mt-1 text-sm font-semibold text-white">{featured.name} · {featured.state}</p>
            </div>
          </div>

          <div>
            <p className="field-label text-biome-accent">{currentSeason} dispatch · {monthName[currentMonth]}</p>
            <h2 className="display-section mt-4 text-biome-ink">Where the wild is calling now.</h2>
            <p className="field-note mt-7 max-w-xl text-biome-ink/78">{bestForSentence(featured, monthName[currentMonth])}</p>

            <div className="mt-9 grid gap-5 border-y border-white/15 py-7 sm:grid-cols-2">
              <div>
                <p className="field-label flex items-center gap-2 text-biome-accent"><Binoculars size={14} /> Watch for</p>
                <p className="mt-3 text-sm leading-6 text-biome-ink/72">{[...featured.mainSpecies, ...featured.birdSpecies].slice(0, 3).join(" · ")}</p>
              </div>
              <div>
                <p className="field-label flex items-center gap-2 text-biome-accent"><Compass size={14} /> Field window</p>
                <p className="mt-3 text-sm leading-6 text-biome-ink/72">Best in {featured.bestMonths.slice(0, 5).join(", ")} · {featured.idealDuration}</p>
              </div>
            </div>

            {closure && (
              <div className="mt-6 flex gap-3">
                <AlertTriangle className="mt-0.5 shrink-0 text-biome-accent" size={18} />
                <div>
                  <p className="field-label text-biome-accent">Know before you go</p>
                  <p className="mt-2 text-sm leading-6 text-biome-ink/68">{closure.note}</p>
                  <p className="field-label mt-3 text-biome-ink/38">Checked {closure.lastVerified}{closure.sourceName ? ` · ${closure.sourceName}` : ""}</p>
                </div>
              </div>
            )}

            {risk && (
              <div className="mt-5 flex gap-3 rounded-field border border-biome-accent/30 bg-black/10 p-4">
                <ShieldAlert className="mt-0.5 shrink-0 text-biome-accent" size={18} />
                <p className="text-sm leading-6 text-biome-ink/72">{risk.summary}</p>
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/hotspots/${featured.slug}`} className="atlas-button">Open field guide <ArrowUpRight size={14} /></Link>
              <Link href={`/map?season=${encodeURIComponent(currentSeason)}`} className="atlas-button atlas-button-ghost">See the seasonal map</Link>
            </div>
          </div>
        </div>

        {otherBets.length > 0 && (
          <div className="mt-16 border-t border-white/15 pt-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="field-label text-biome-accent">Other field signals</p>
                <h3 className="mt-2 text-2xl text-biome-ink">More places in season</h3>
              </div>
              <Link href={`/map?season=${encodeURIComponent(currentSeason)}`} className="field-label text-biome-ink/60 transition hover:text-biome-accent">View all seasonal places →</Link>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {otherBets.map((hotspot) => (
                <Link key={hotspot.slug} href={`/hotspots/${hotspot.slug}`} className="group grid grid-cols-[88px_1fr] gap-4 rounded-field border border-white/15 bg-black/10 p-3 transition hover:border-biome-accent/60 hover:bg-black/20">
                  <HotspotImage slug={hotspot.slug} type={hotspot.type} showCredit={false} className="h-20 rounded-sm" />
                  <div className="min-w-0 self-center">
                    <p className="field-label text-biome-accent">{ecosystem[hotspot.slug]} · {hotspot.region}</p>
                    <p className="mt-1 line-clamp-2 font-display text-lg leading-tight text-biome-ink">{hotspot.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </BiomeSurface>
  );
}

export default function Home() {
  const now = useMemo(() => new Date(), []);
  const currentMonth = monthAbbr[now.getMonth()];
  const currentSeason = monthToSeason[currentMonth];
  const monthMatches = hotspots.filter((hotspot) => hotspot.bestMonths.includes(currentMonth));
  const seasonFallback = hotspots.filter((hotspot) => hotspot.bestSeason.includes(currentSeason));
  const seasonalCandidates = monthMatches.length ? monthMatches : seasonFallback.length ? seasonFallback : hotspots;
  const faunaPick = seasonalCandidates.length > 1 ? seasonalCandidates.find(photoShowsFauna) : undefined;
  const orderedMatches = faunaPick ? [faunaPick, ...seasonalCandidates.filter((hotspot) => hotspot !== faunaPick)] : seasonalCandidates;
  const best = orderedMatches.slice(0, 4);
  const featured = best[0];
  const otherBets = best.slice(1);
  const regionCount = new Set(hotspots.map((hotspot) => hotspot.region)).size;

  return (
    <main className="overflow-hidden">
      <DescentSequence featured={featured} totalParks={hotspots.length} regionCount={regionCount} currentSeason={currentSeason} />

      <section className="relative bg-paper px-4 py-20 text-ink sm:px-6 sm:py-28">
        <div className="texture-field-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.65fr] lg:items-end">
            <div>
              <p className="field-label text-river dark:text-sky-300">Choose your trail</p>
              <h2 className="display-section mt-4 max-w-4xl text-forest-900 dark:text-white">Begin with a feeling, not a filter.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 lg:justify-self-end">Every trail opens the same atlas with a different question: an animal, a season, a habitat or a change in altitude.</p>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-4 md:auto-rows-[300px] md:grid-flow-dense">
            {trailDefinitions.map((trail, index) => <TrailCard key={trail.title} trail={trail} index={index} />)}
          </div>
        </div>
      </section>

      <SeasonalStory featured={featured} otherBets={otherBets} currentMonth={now.getMonth()} currentSeason={currentSeason} />

      <section className="bg-[#0b1611] px-4 py-20 text-white sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-end">
            <div>
              <p className="field-label text-sand">Six landscapes · One atlas</p>
              <h2 className="display-section mt-4 text-white">India changes with every horizon.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-white/58 lg:justify-self-end">Move from tidal forest to cold desert, from reed bed to sal canopy. Each biome carries its own light, rhythm and way of looking.</p>
          </div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {biomePassage.map((passage, index) => (
              <Link key={passage.key} href={`/map?query=${encodeURIComponent(passage.query)}`} className={`biome-surface ${biomeClassName[passage.key]} group relative isolate min-h-[360px] overflow-hidden rounded-field p-5 ${index === 0 || index === 5 ? "lg:col-span-2" : ""}`}>
                <HotspotImage slug={passage.hotspot.slug} type={passage.hotspot.type} showCredit={false} className="absolute inset-0 -z-20 h-full w-full opacity-45 grayscale-[25%] transition duration-1000 group-hover:scale-105 group-hover:opacity-60" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-biome-surface via-biome-surface/45 to-transparent" />
                <div className="flex h-full min-h-[320px] flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <span className="field-label text-biome-accent">0{index + 1} · {passage.region}</span>
                    <span className="field-label text-biome-ink/55">{passage.count} {passage.count === 1 ? "place" : "places"}</span>
                  </div>
                  <div>
                    <h3 className="text-4xl font-medium text-biome-ink sm:text-5xl">{passage.label}</h3>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-biome-ink/68">{passage.atmosphere}</p>
                    <p className="field-label mt-5 flex items-center gap-2 text-biome-accent">Enter this landscape <ArrowRight size={13} className="transition group-hover:translate-x-1" /></p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative bg-paper px-4 py-20 text-ink sm:px-6 sm:py-28">
        <div className="texture-field-grid pointer-events-none absolute inset-0 opacity-50" />
        <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.95fr] lg:gap-20">
          <div>
            <p className="field-label text-river dark:text-sky-300">The field notebook</p>
            <h2 className="display-section mt-4 max-w-3xl text-forest-900 dark:text-white">Trust is part of the terrain.</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">Wonder gets you into the landscape. Reliable access notes, evidence and honest uncertainty help you travel through it responsibly.</p>
            <Link href="/data-sources" className="mt-8 inline-flex items-center gap-2 font-semibold text-forest-700 transition hover:text-clay dark:text-forest-300">Open our field methods <ArrowUpRight size={16} /></Link>
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
              {[
                { value: hotspots.length, label: "Field sites" },
                { value: verifiedCount, label: "Sourced notes" },
                { value: structuralRiskCount, label: "Risk flags" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-field border border-forest-700/15 bg-white/55 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="font-display text-3xl text-forest-900 dark:text-white">{stat.value}</p>
                  <p className="field-label mt-1 text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="field-card rounded-field p-6 shadow-field sm:p-8">
            <div className="flex items-center justify-between border-b border-forest-700/15 pb-5 dark:border-white/10">
              <div>
                <p className="field-label text-river dark:text-sky-300">Observation protocol</p>
                <h3 className="mt-2 text-2xl text-forest-900 dark:text-white">Verified, not guessed.</h3>
              </div>
              <Database className="text-clay" size={28} strokeWidth={1.5} />
            </div>
            <div className="mt-6 grid gap-6">
              {[
                "Closure notes distinguish official sources from inferred patterns and unconfirmed access.",
                "Species presence draws on real eBird and iNaturalist records rather than invented checklists.",
                "Jurisdiction and access complexity are surfaced as structural risks, not hidden in fine print.",
              ].map((note, index) => (
                <div key={note} className="grid grid-cols-[2rem_1fr] gap-3">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-900 text-sand"><Check size={14} /></span>
                  <div>
                    <p className="field-label text-slate-500">Method 0{index + 1}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
