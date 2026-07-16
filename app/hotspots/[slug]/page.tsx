import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Bird,
  CalendarDays,
  Camera,
  Clock3,
  Compass,
  Footprints,
  Leaf,
  Lock,
  LockOpen,
  Map,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { hotspots, getHotspotBySlug } from "@/data/hotspots";
import { closureInfo } from "@/data/closures";
import { FreshnessBadge } from "@/components/FreshnessBadge";
import { QuickFactsCard } from "@/components/QuickFactsCard";
import { PlanLinksCard } from "@/components/PlanLinksCard";
import { HotspotCard } from "@/components/HotspotCard";
import { HotspotImage } from "@/components/HotspotImage";
import { ecosystem } from "@/data/ecosystems";
import { hasBoating } from "@/data/boatingSpots";
import { seasonalWisdom } from "@/data/seasonalWisdom";
import { buildItinerary } from "@/lib/itinerary";
import { haversineKm } from "@/lib/geo";
import { speciesSlugForName } from "@/lib/speciesLinks";
import { species, getSpeciesBySlug } from "@/data/species";
import { SpeciesCard } from "@/components/SpeciesCard";
import ebirdSpeciesRaw from "@/data/ebirdSpecies.json";
import type { EbirdSpeciesEntry } from "@/scripts/fetch-ebird-species";
import { EbirdChecklist } from "@/components/EbirdChecklist";
import { structuralRisks } from "@/data/structuralRisks";
import { StructuralRiskNotice } from "@/components/StructuralRiskNotice";
import { JournalSaveButton } from "@/components/JournalSaveButton";
import { JourneyTracker } from "@/components/JourneyTracker";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";

const ebirdSpecies = ebirdSpeciesRaw as Record<string, EbirdSpeciesEntry[]>;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function generateStaticParams() {
  return hotspots.map((hotspot) => ({ slug: hotspot.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hotspot = getHotspotBySlug(slug);
  if (!hotspot) return {};
  const title = `${hotspot.name} Travel Guide — ${hotspot.state} | Wild India Atlas`;
  const description = `${hotspot.summary} Best months: ${hotspot.bestMonths.join(", ")}. ${hotspot.type} in ${hotspot.state}.`;
  return { title, description, openGraph: { title, description, type: "article" } };
}

// Best months can wrap the year boundary. Find the most compact arc on a 12-month wheel.
function bestMonthsRange(bestMonths: string[]): string {
  const indices = Array.from(new Set(bestMonths.map((month) => monthNames.indexOf(month)).filter((index) => index >= 0))).sort((a, b) => a - b);
  if (!indices.length) return "";
  if (indices.length === 1) return monthNames[indices[0]];
  let maxGap = -1;
  let startPos = 0;
  for (let index = 0; index < indices.length; index += 1) {
    const gap = (indices[(index + 1) % indices.length] - indices[index] + 12) % 12;
    if (gap > maxGap) {
      maxGap = gap;
      startPos = (index + 1) % indices.length;
    }
  }
  const endPos = (startPos - 1 + indices.length) % indices.length;
  return `${monthNames[indices[startPos]]}–${monthNames[indices[endPos]]}`;
}

export default async function HotspotDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hotspot = getHotspotBySlug(slug);
  if (!hotspot) notFound();

  const eco = ecosystem[hotspot.slug] ?? "forest";
  const biome = biomeThemes.find((theme) => theme.key === eco) ?? biomeThemes[0];
  const closure = closureInfo[hotspot.slug];
  const boating = hasBoating.has(hotspot.slug);
  const itinerary = buildItinerary(hotspot, boating);
  const related = hotspot.relatedHotspotSlugs.map(getHotspotBySlug).filter(Boolean);
  const nearby = hotspots
    .filter((candidate) => candidate.slug !== hotspot.slug)
    .map((candidate) => ({ hotspot: candidate, km: haversineKm(hotspot.coordinates, candidate.coordinates) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, 3);
  const featuredSpeciesSlugs = Array.from(new Set(
    [...hotspot.mainSpecies, ...hotspot.birdSpecies]
      .map((name) => speciesSlugForName(name, species))
      .filter((speciesSlug): speciesSlug is string => Boolean(speciesSlug)),
  ));
  const featuredSpecies = featuredSpeciesSlugs.map(getSpeciesBySlug).filter(Boolean);
  const ebirdEntries = ebirdSpecies[hotspot.slug];
  const ebirdConfirmedNames = ebirdEntries
    ? new Set(ebirdEntries.flatMap((entry) => [entry.comName.toLowerCase(), entry.sciName.toLowerCase()]))
    : undefined;
  const structuralRisk = structuralRisks[hotspot.slug];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    name: hotspot.name,
    description: hotspot.summary,
    address: { "@type": "PostalAddress", addressRegion: hotspot.state, addressCountry: "IN" },
    geo: { "@type": "GeoCoordinates", latitude: hotspot.coordinates.latitude, longitude: hotspot.coordinates.longitude },
  };

  return (
    <main className={`${biomeClassName[eco]} hotspot-story overflow-clip bg-biome-surface text-biome-ink`}>
      <JourneyTracker type="hotspot" slug={hotspot.slug} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="hotspot-hero relative flex min-h-[92svh] items-end overflow-hidden px-4 pb-8 pt-28 sm:px-6 sm:pb-12">
        <HotspotImage slug={hotspot.slug} type={hotspot.type} className="absolute inset-0 h-full w-full" />
        <div className="hotspot-hero-wash absolute inset-0" />
        <div className="texture-grain absolute inset-0" />
        <div className="relative z-10 mx-auto grid w-full max-w-7xl items-end gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="motion-reveal max-w-5xl">
            <Link href="/hotspots" className="field-label inline-flex items-center gap-2 text-biome-ink/65 transition hover:text-biome-accent">
              <ArrowLeft size={14} /> Explore all landscapes
            </Link>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="atlas-chip border-biome-accent/55 text-biome-accent">{biome.label}</span>
              <span className="atlas-chip">{hotspot.type}</span>
              <span className="atlas-chip">{hotspot.region}</span>
            </div>
            <p className="field-label mt-5 text-biome-ink/62">{hotspot.state} · {hotspot.habitat}</p>
            <h1 className="display-hero mt-3 max-w-5xl text-biome-ink">{hotspot.name}</h1>
            <p className="mt-6 max-w-2xl border-l border-biome-accent/65 pl-5 font-display text-xl leading-8 text-biome-ink/88 sm:text-2xl sm:leading-9">
              {hotspot.summary}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#landscape" className="atlas-button">
                Enter the landscape <ArrowDown size={15} />
              </Link>
              <Link href={`/map?place=${hotspot.slug}`} className="atlas-button atlas-button-ghost">
                <Map size={15} /> Find on the atlas
              </Link>
              <JournalSaveButton type="hotspot" slug={hotspot.slug} tone="dark" />
            </div>
          </div>

          <aside className="shell-chrome hidden rounded-field p-5 lg:block">
            <div className="flex items-center justify-between border-b border-biome-line/15 pb-4">
              <p className="field-label text-biome-accent">Field signal</p>
              <Compass size={18} className="text-biome-ink/55" />
            </div>
            <SignalRow icon={CalendarDays} label="Best window" value={bestMonthsRange(hotspot.bestMonths)} />
            <SignalRow icon={closure?.closesSeasonally ? Lock : LockOpen} label="Access rhythm" value={closure?.closesSeasonally ? "Seasonal closure" : "Open year-round"} />
            <SignalRow icon={Footprints} label="Effort" value={hotspot.difficulty} />
            <SignalRow icon={Clock3} label="Time here" value={hotspot.idealDuration} last />
            <p className="field-note mt-5 text-biome-ink/72">{biome.cue}</p>
          </aside>
        </div>
      </section>

      <nav aria-label="Hotspot chapters" className="hotspot-chapter-nav sticky top-0 z-30 border-y border-biome-line/10 bg-biome-surface/95 backdrop-blur-xl">
        <div className="atlas-scrollbar mx-auto flex max-w-7xl gap-8 overflow-x-auto px-4 sm:px-6">
          <a href="#landscape">01 Landscape</a>
          <a href="#wildlife">02 Wildlife</a>
          <a href="#season">03 Season</a>
          <a href="#journey">04 Journey</a>
          <a href="#onward">05 Onward</a>
        </div>
      </nav>

      <section id="landscape" className="scroll-mt-24 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="field-label text-biome-accent">01 · Read the terrain</p>
            <h2 className="display-section mt-4 text-biome-ink">The landscape sets the rules.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-biome-ink/62">{biome.atmosphere}. Arrive slowly: the habitat is not a backdrop, but the reason every encounter here is possible.</p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="hotspot-glass-panel rounded-field p-6 sm:col-span-2 sm:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="field-label text-biome-accent">Habitat portrait</p>
                  <h3 className="mt-3 font-display text-3xl text-biome-ink sm:text-4xl">{hotspot.habitat}</h3>
                </div>
                <Leaf className="shrink-0 text-biome-accent/70" size={26} />
              </div>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-biome-ink/72">{hotspot.travelNotes}</p>
            </article>
            <StoryList icon={Sparkles} eyebrow="Signature life" items={hotspot.knownFor} />
            <StoryList icon={Compass} eyebrow="Ways to explore" items={[...hotspot.experienceTags, ...(boating ? ["Boating"] : [])]} />
            {structuralRisk && (
              <div className="sm:col-span-2 rounded-field bg-paper p-1 text-ink">
                <StructuralRiskNotice risk={structuralRisk} />
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="wildlife" className="scroll-mt-24 border-t border-biome-line/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <header className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="field-label text-biome-accent">02 · Wildlife encounters</p>
              <h2 className="display-section mt-4 text-biome-ink">Look for signs before sightings.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-biome-ink/62 lg:justify-self-end">Tracks, calls, disturbed grass and sudden silence often tell the story first. These are the species and seasonal signatures most closely associated with this landscape.</p>
          </header>

          {featuredSpecies.length > 0 && (
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSpecies.slice(0, 6).map((animal) => <SpeciesCard key={animal!.slug} species={animal!} compact />)}
            </div>
          )}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <FieldList title="Mammals" icon={PawPrint} items={hotspot.mainSpecies} linkSpecies ebirdNames={ebirdConfirmedNames} />
            <FieldList title="Birdlife" icon={Bird} items={hotspot.birdSpecies} linkSpecies ebirdNames={ebirdConfirmedNames} />
            <FieldList title="Flora" icon={Leaf} items={hotspot.floraHighlights} />
            <article className="hotspot-glass-panel rounded-field p-6">
              <Camera size={21} className="text-biome-accent" />
              <p className="field-label mt-5 text-biome-accent">Through the lens</p>
              <p className="mt-3 text-base leading-7 text-biome-ink/72">{hotspot.photographyNotes}</p>
            </article>
          </div>

          {ebirdEntries && ebirdEntries.length > 0 && (
            <div className="mt-8 rounded-field bg-paper p-1 text-ink">
              <EbirdChecklist species={ebirdEntries} />
            </div>
          )}
        </div>
      </section>

      <section id="season" className="texture-topography scroll-mt-24 border-t border-biome-line/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <header>
              <p className="field-label text-biome-accent">03 · Seasonal rhythm</p>
              <h2 className="display-section mt-4 text-biome-ink">Choose the right window.</h2>
            </header>
            <p className="max-w-xl text-base leading-7 text-biome-ink/62 lg:justify-self-end">The highlighted months are the atlas recommendation. Weather, access and wildlife movement can still shift, so treat the calendar as a field signal—not a guarantee.</p>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-12">
            {monthNames.map((month, index) => {
              const active = hotspot.bestMonths.includes(month);
              return (
                <div key={month} className={`hotspot-month rounded-field p-3 ${active ? "is-active" : ""}`}>
                  <p className="field-label">{String(index + 1).padStart(2, "0")}</p>
                  <p className="mt-8 font-display text-2xl">{month}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider">{active ? "Go" : "Wait"}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="hotspot-glass-panel rounded-field p-6 sm:p-8">
              <div className="flex items-start gap-4">
                {closure?.closesSeasonally ? <Lock className="mt-1 shrink-0 text-biome-accent" /> : <LockOpen className="mt-1 shrink-0 text-biome-accent" />}
                <div>
                  <p className="field-label text-biome-accent">{closure?.closesSeasonally ? "Seasonal access note" : "Year-round access note"}</p>
                  <p className="mt-3 text-lg leading-8 text-biome-ink/78">{closure?.note ?? "No park-specific closure note is currently recorded."}</p>
                  {closure && <div className="mt-3 rounded-sm bg-paper px-3 py-2 text-ink"><FreshnessBadge closure={closure} /></div>}
                </div>
              </div>
            </article>
            <article className="hotspot-glass-panel rounded-field p-6 sm:p-8">
              <p className="field-label text-biome-accent">Seasonal caution</p>
              <div className="mt-4 grid gap-4">
                {hotspot.bestSeason.map((season) => (
                  <div key={season}>
                    <p className="font-display text-xl text-biome-ink">{season}</p>
                    <p className="mt-1 text-sm leading-6 text-biome-ink/58">{seasonalWisdom[season].avoid}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="journey" className="scroll-mt-24 bg-paper px-4 py-20 text-ink sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <header className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <div>
              <p className="field-label text-clay">04 · Shape the journey</p>
              <h2 className="display-section mt-4 text-ink">A field plan, not a checklist.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-ink/62 lg:justify-self-end">Leave room for weather, permits and the unrushed pace of wildlife. This suggested sequence uses the duration and experiences already recorded for this place.</p>
          </header>

          <div className="mt-12 grid gap-8 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="relative">
              <div className="absolute bottom-8 left-[1.15rem] top-8 w-px bg-forest-700/20" />
              <div className="grid gap-4">
                {itinerary.map((day, index) => (
                  <article key={day.title} className="field-card relative ml-10 rounded-field p-6">
                    <span className="absolute -left-10 top-6 grid h-9 w-9 place-items-center rounded-full bg-forest-900 font-mono text-xs font-bold text-sand ring-8 ring-paper">{index + 1}</span>
                    <p className="field-label text-forest-700 dark:text-forest-300">{day.title}</p>
                    <p className="mt-3 text-base leading-7 text-slate-700 dark:text-slate-300">{day.body}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="grid content-start gap-4">
              <QuickFactsCard hotspot={hotspot} />
              <PlanLinksCard hotspot={hotspot} />
              <article className="rounded-field bg-forest-900 p-6 text-white">
                <div className="flex items-center gap-3 text-sand"><ShieldCheck /><p className="field-label">Travel gently</p></div>
                <p className="mt-4 text-sm leading-7 text-white/72">{hotspot.ethicalNotes || "Keep distance, avoid baiting or calls, follow park rules, and respect local guides and communities."}</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section id="onward" className="scroll-mt-24 border-t border-biome-line/10 px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="field-label text-biome-accent">05 · Continue through India</p>
              <h2 className="display-section mt-4 max-w-3xl text-biome-ink">One landscape opens into another.</h2>
            </div>
            <Link href="/hotspots" className="atlas-button atlas-button-ghost self-start">All hotspots <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="field-label mb-4 text-biome-ink/48">Related landscapes</p>
              <div className="grid gap-3">{related.map((place) => <HotspotCard key={place!.slug} hotspot={place!} compact tone="atlas" />)}</div>
            </div>
            <div>
              <p className="field-label mb-4 text-biome-ink/48">Nearest on the atlas</p>
              <div className="grid gap-3">
                {nearby.map(({ hotspot: place, km }) => (
                  <div key={place.slug} className="grid grid-cols-[1fr_auto] items-center gap-3">
                    <HotspotCard hotspot={place} compact tone="atlas" />
                    <span className="field-label text-biome-ink/42">~{Math.round(km)} km</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-biome-line/15 pt-8 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 text-biome-ink/60"><MapPin size={18} /><span className="field-label">{hotspot.coordinates.latitude.toFixed(3)}° N · {hotspot.coordinates.longitude.toFixed(3)}° E</span></div>
            <Link href={`/map?place=${hotspot.slug}`} className="atlas-button">Open map route <ArrowRight size={15} /></Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SignalRow({ icon: Icon, label, value, last = false }: { icon: typeof CalendarDays; label: string; value: string; last?: boolean }) {
  return (
    <div className={`flex gap-3 py-4 ${last ? "" : "border-b border-biome-line/10"}`}>
      <Icon size={17} className="mt-0.5 shrink-0 text-biome-accent" />
      <div><p className="field-label text-biome-ink/42">{label}</p><p className="mt-1 text-sm font-semibold text-biome-ink/84">{value}</p></div>
    </div>
  );
}

function StoryList({ icon: Icon, eyebrow, items }: { icon: typeof Sparkles; eyebrow: string; items: string[] }) {
  return (
    <article className="hotspot-glass-panel rounded-field p-6">
      <Icon size={21} className="text-biome-accent" />
      <p className="field-label mt-5 text-biome-accent">{eyebrow}</p>
      <div className="mt-4 grid gap-2">
        {items.map((item) => <p key={item} className="border-t border-biome-line/10 pt-2 text-sm leading-6 text-biome-ink/72">{item}</p>)}
      </div>
    </article>
  );
}

function FieldList({ title, icon: Icon, items, linkSpecies, ebirdNames }: { title: string; icon: typeof PawPrint; items: string[]; linkSpecies?: boolean; ebirdNames?: Set<string> }) {
  return (
    <article className="hotspot-glass-panel rounded-field p-6">
      <div className="flex items-center gap-3"><Icon size={20} className="text-biome-accent" /><h3 className="font-display text-2xl text-biome-ink">{title}</h3></div>
      <div className="mt-5 flex flex-wrap gap-2">
        {items.map((item) => {
          const speciesSlug = linkSpecies ? speciesSlugForName(item, species) : undefined;
          const confirmed = ebirdNames?.has(item.toLowerCase());
          const label = <span className="atlas-chip normal-case tracking-normal text-biome-ink/72">{confirmed && <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />}{item}</span>;
          return speciesSlug ? <Link key={item} href={`/species/${speciesSlug}`} className="transition hover:-translate-y-0.5 hover:text-biome-accent">{label}</Link> : <span key={item}>{label}</span>;
        })}
      </div>
      {ebirdNames && <p className="mt-4 text-xs text-biome-ink/42"><span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-sky-300" /> Citizen-science record available</p>}
    </article>
  );
}
