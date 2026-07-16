import type { Metadata } from "next"; import { notFound } from "next/navigation"; import Link from "next/link"; import { Binoculars, Camera, Footprints, Lock, LockOpen, PawPrint, Sailboat, Sparkles, Users } from "lucide-react"; import { hotspots, getHotspotBySlug } from "@/data/hotspots"; import { closureInfo } from "@/data/closures"; import { FreshnessBadge } from "@/components/FreshnessBadge"; import { formatVerifiedDate } from "@/lib/formatDate"; import { QuickFactsCard } from "@/components/QuickFactsCard"; import { Tag } from "@/components/Tag"; import { PlanLinksCard } from "@/components/PlanLinksCard"; import { EthicalTravelNote } from "@/components/EthicalTravelNote"; import { HotspotCard } from "@/components/HotspotCard"; import { HotspotImage } from "@/components/HotspotImage"; import { ecosystem, ecosystemColorClass } from "@/data/ecosystems"; import { hasBoating } from "@/data/boatingSpots"; import { seasonalWisdom } from "@/data/seasonalWisdom"; import { buildItinerary } from "@/lib/itinerary"; import { haversineKm } from "@/lib/geo"; import { speciesSlugForName } from "@/lib/speciesLinks"; import { species, getSpeciesBySlug } from "@/data/species"; import { SpeciesCard } from "@/components/SpeciesCard"; import ebirdSpeciesRaw from "@/data/ebirdSpecies.json"; import type { EbirdSpeciesEntry } from "@/scripts/fetch-ebird-species"; import { EbirdChecklist } from "@/components/EbirdChecklist"; import { structuralRisks } from "@/data/structuralRisks"; import { StructuralRiskNotice } from "@/components/StructuralRiskNotice";
const ebirdSpecies = ebirdSpeciesRaw as Record<string, EbirdSpeciesEntry[]>;
import { JournalSaveButton } from "@/components/JournalSaveButton";
import { JourneyTracker } from "@/components/JourneyTracker";

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const experienceIcons: Record<string, typeof Camera> = { Photography: Camera, Safari: PawPrint, Birding: Binoculars, Trekking: Footprints, "Family-friendly": Users, Offbeat: Sparkles };

export function generateStaticParams(){ return hotspots.map(h=>({slug:h.slug})); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const hotspot = getHotspotBySlug(slug);
  if (!hotspot) return {};
  const title = hotspot.name + " Travel Guide — " + hotspot.state + " | Wild India Atlas";
  const description = hotspot.summary + " Best months: " + hotspot.bestMonths.join(", ") + ". " + hotspot.type + " in " + hotspot.state + ".";
  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
  };
}

// Best months can wrap the year boundary (e.g. Nov-Mar), so find the arc by locating
// the largest gap between consecutive months on the 12-month wheel and starting right after it.
function bestMonthsRange(bestMonths: string[]): string {
  const indices = Array.from(new Set(bestMonths.map(m => monthNames.indexOf(m)).filter(i => i >= 0))).sort((a,b)=>a-b);
  if (!indices.length) return "";
  if (indices.length === 1) return monthNames[indices[0]];
  let maxGap = -1, startPos = 0;
  for (let i = 0; i < indices.length; i++) {
    const gap = (indices[(i + 1) % indices.length] - indices[i] + 12) % 12;
    if (gap > maxGap) { maxGap = gap; startPos = (i + 1) % indices.length; }
  }
  const endPos = (startPos - 1 + indices.length) % indices.length;
  return monthNames[indices[startPos]] + "–" + monthNames[indices[endPos]];
}

export default async function HotspotDetail({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const hotspot = getHotspotBySlug(slug);
  if(!hotspot) notFound();
  const related = hotspot.relatedHotspotSlugs.map(getHotspotBySlug).filter(Boolean);
  const boating = hasBoating.has(hotspot.slug);
  const eco = ecosystem[hotspot.slug];
  const itinerary = buildItinerary(hotspot, boating);
  const nearby = hotspots
    .filter(h => h.slug !== hotspot.slug)
    .map(h => ({ h, km: haversineKm(hotspot.coordinates, h.coordinates) }))
    .sort((a,b) => a.km - b.km)
    .slice(0, 3);
  const featuredSpeciesSlugs = Array.from(new Set(
    [...hotspot.mainSpecies, ...hotspot.birdSpecies]
      .map(name => speciesSlugForName(name, species))
      .filter((s): s is string => Boolean(s))
  ));
  const featuredSpecies = featuredSpeciesSlugs.map(getSpeciesBySlug).filter(Boolean);
  const closure = closureInfo[hotspot.slug];
  const ebirdEntries = ebirdSpecies[hotspot.slug];
  const ebirdConfirmedNames = ebirdEntries
    ? new Set(ebirdEntries.flatMap(e => [e.comName.toLowerCase(), e.sciName.toLowerCase()]))
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

  return <main>
    <JourneyTracker type="hotspot" slug={hotspot.slug} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="relative flex min-h-[440px] items-end overflow-hidden px-4 pb-10 pt-28 text-white sm:min-h-[560px] sm:px-6">
      <HotspotImage slug={hotspot.slug} type={hotspot.type} className="absolute inset-0 -z-20 h-full w-full"/>
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/75 to-forest-900/10"/>
      <div className="mx-auto w-full max-w-7xl">
        <Link href="/map" className="font-mono text-xs font-bold uppercase tracking-wide text-sand">← Back to map</Link>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {eco && <span className={"flex items-center gap-1 rounded-sm px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white " + ecosystemColorClass[eco]}>{eco}</span>}
          {hotspot.experienceTags.map(t=><span key={t} className="rounded-sm border border-white/30 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/90">{t}</span>)}
        </div>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold">{hotspot.name}</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold uppercase tracking-wide text-white/70">{hotspot.state} · {hotspot.habitat} · Best: {bestMonthsRange(hotspot.bestMonths)}</p>
        <p className="mt-3 max-w-3xl border-l-2 border-sand pl-4 text-lg leading-8 text-ivory">{hotspot.summary}</p>
        <div className="mt-6"><JournalSaveButton type="hotspot" slug={hotspot.slug} tone="dark" /></div>
      </div>
    </section>
    {structuralRisk && (
      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <StructuralRiskNotice risk={structuralRisk} />
      </section>
    )}
    <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div className="grid content-start gap-6">
        <section className="field-card rounded-sm p-6">
          <h2 className="text-2xl font-black text-forest-900">What you can see</h2>
          {ebirdEntries && ebirdEntries.length > 0 && (
            <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
              via eBird · updated {formatVerifiedDate(ebirdEntries[0].lastPulled)}
            </span>
          )}
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Block title="Mammals" items={hotspot.mainSpecies} linkSpecies ebirdNames={ebirdConfirmedNames}/>
            <Block title="Birds" items={hotspot.birdSpecies} linkSpecies ebirdNames={ebirdConfirmedNames}/>
            <Block title="Flora" items={hotspot.floraHighlights}/>
            <Block title="Seasonal highlights" items={hotspot.knownFor}/>
          </div>
        </section>
        {ebirdEntries && ebirdEntries.length > 0 && <EbirdChecklist species={ebirdEntries}/>}
        {featuredSpecies.length > 0 && (
          <section className="field-card rounded-sm p-6">
            <h2 className="text-2xl font-black text-forest-900">Species spotlight</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{featuredSpecies.map(s => <SpeciesCard key={s!.slug} species={s!} compact/>)}</div>
          </section>
        )}
        <section className="field-card rounded-sm p-6">
          <h2 className="text-2xl font-black text-forest-900">Best time to visit</h2>
          <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-12">{monthNames.map(m=><div key={m} className={"rounded-md px-2 py-3 text-center text-xs font-bold " + (hotspot.bestMonths.includes(m)?'bg-forest-700 text-white':'bg-white/70 text-slate-500 dark:bg-white/5 dark:text-slate-400')}>{m}</div>)}</div>
        </section>
        <section className="field-card rounded-sm p-6">
          <h2 className="text-2xl font-black text-forest-900">Experiences</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {hotspot.experienceTags.map(t => { const Icon = experienceIcons[t]; return <span key={t} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">{Icon && <Icon size={16} className="text-forest-700 dark:text-forest-300"/>}{t}</span>; })}
            {boating && <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300"><Sailboat size={16} className="text-forest-700 dark:text-forest-300"/>Boating</span>}
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-2">
          <Info title="Experience notes" body={hotspot.photographyNotes}/>
          <Info title="Planning basics" body={hotspot.travelNotes}/>
        </section>
        <section className="field-card rounded-sm p-6">
          <h2 className="text-2xl font-black text-forest-900">Season &amp; closures</h2>
          {closure ? (
            <div className="mt-4 flex items-start gap-3">
              {closure.closesSeasonally ? <Lock size={18} className="mt-0.5 shrink-0 text-clay"/> : <LockOpen size={18} className="mt-0.5 shrink-0 text-forest-700 dark:text-forest-300"/>}
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-wide text-slate-700 dark:text-slate-300">{closure.closesSeasonally ? "This park closes seasonally" : "Open year-round"}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{closure.note}</p>
                <FreshnessBadge closure={closure}/>
              </div>
            </div>
          ) : (
            <div className="mt-4 grid gap-3">
              {hotspot.bestSeason.map(s => <div key={s}><p className="font-mono text-xs font-bold uppercase tracking-wide text-clay">{s}</p><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{seasonalWisdom[s].avoid}</p></div>)}
            </div>
          )}
          <p className="mt-3 text-xs italic text-slate-500 dark:text-slate-400">{closure ? "Exact dates are set annually by the state forest department and can shift by a week or two" : "General seasonal guidance, not park-specific"} — confirm before booking.</p>
        </section>
        <section className="field-card rounded-sm p-6">
          <h2 className="text-2xl font-black text-forest-900">Suggested itinerary</h2>
          <div className="mt-4 grid gap-3">
            {itinerary.map(day => <div key={day.title}><p className="font-mono text-xs font-bold uppercase tracking-wide text-forest-700 dark:text-forest-300">{day.title}</p><p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{day.body}</p></div>)}
          </div>
        </section>
        <PlanLinksCard hotspot={hotspot}/>
        <EthicalTravelNote note={hotspot.ethicalNotes}/>
      </div>
      <div className="grid content-start gap-6">
        <QuickFactsCard hotspot={hotspot}/>
        <section><h2 className="mb-3 text-xl font-black text-forest-900">Related hotspots</h2><div className="grid gap-3">{related.map(h=><HotspotCard key={h!.slug} hotspot={h!}/>)}</div></section>
        <section><h2 className="mb-3 text-xl font-black text-forest-900">Nearby hotspots</h2><div className="grid gap-3">{nearby.map(({h,km})=><div key={h.slug}><HotspotCard hotspot={h}/><p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">~{Math.round(km)} km away</p></div>)}</div></section>
      </div>
    </section>
  </main>;
}
function Block({title,items,linkSpecies,ebirdNames}:{title:string;items:string[];linkSpecies?:boolean;ebirdNames?:Set<string>}){return <div><h3 className="font-bold text-forest-900">{title}</h3><div className="mt-2 flex flex-wrap gap-2">{items.map(i=>{ const slug = linkSpecies ? speciesSlugForName(i, species) : undefined; const confirmed = ebirdNames?.has(i.toLowerCase()); return slug ? <Link key={i} href={"/species/"+slug}><Tag confirmed={confirmed}>{i}</Tag></Link> : <Tag key={i} confirmed={confirmed}>{i}</Tag>; })}</div></div>}
function Info({title,body}:{title:string;body:string}){return <section className="field-card rounded-sm p-5"><h2 className="text-xl font-black text-forest-900">{title}</h2><p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{body}</p></section>}
