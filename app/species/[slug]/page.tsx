import type { Metadata } from "next"; import { notFound } from "next/navigation"; import Link from "next/link"; import { Camera, Compass, ShieldAlert } from "lucide-react"; import { species, getSpeciesBySlug } from "@/data/species"; import { hotspots } from "@/data/hotspots"; import { hotspotsForSpecies, bestMonthsForSpecies } from "@/lib/speciesLinks"; import { HotspotCard } from "@/components/HotspotCard"; import { SpeciesCard } from "@/components/SpeciesCard"; import { SpeciesImage } from "@/components/SpeciesImage"; import { EmptyState } from "@/components/EmptyState";

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export function generateStaticParams(){ return species.map(s=>({slug:s.slug})); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const sp = getSpeciesBySlug(slug);
  if (!sp) return {};
  const title = sp.commonName + " — Where to See It in India | Wild India Atlas";
  const description = sp.shortDescription + " Sighting difficulty: " + sp.difficultyOfSighting + ". " + sp.habitat + ".";
  return { title, description, openGraph: { title, description, type: "article" } };
}

export default async function SpeciesDetail({ params }: { params: Promise<{ slug: string }> }){
  const { slug } = await params;
  const sp = getSpeciesBySlug(slug);
  if(!sp) notFound();
  const matchedHotspots = hotspotsForSpecies(sp, hotspots);
  const bestMonths = bestMonthsForSpecies(sp, hotspots);
  const similar = sp.similarSpeciesSlugs.map(getSpeciesBySlug).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: sp.commonName + " — Where to See It in India",
    description: sp.shortDescription,
    about: sp.commonName,
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    <section className="relative flex min-h-[360px] items-end overflow-hidden px-4 pb-10 pt-28 text-white sm:px-6">
      <SpeciesImage slug={sp.slug} category={sp.category} className="absolute inset-0 -z-20 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/75 to-forest-900/10"/>
      <div className="mx-auto w-full max-w-7xl">
        <Link href="/species" className="font-mono text-xs font-bold uppercase tracking-wide text-flare">← Back to species guide</Link>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-sm bg-forest-700 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">{sp.category}</span>
          <span className="rounded-sm border border-white/30 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/90">Sighting: {sp.difficultyOfSighting}</span>
        </div>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold">{sp.commonName}</h1>
        <p className="mt-2 max-w-3xl text-lg italic text-white/70">{sp.scientificName}</p>
        <p className="mt-3 max-w-3xl border-l-2 border-flare pl-4 text-lg leading-8 text-ivory">{sp.shortDescription}</p>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
      <div className="grid content-start gap-6">
        <section className="field-card rounded-sm p-6">
          <h2 className="text-2xl font-black text-forest-900">Where can I see this?</h2>
          {matchedHotspots.length ? (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">{matchedHotspots.map(h => <HotspotCard key={h.slug} hotspot={h} />)}</div>
          ) : (
            <div className="mt-5"><EmptyState title="Not yet featured at an atlas hotspot" body="This species isn't a highlight of any of the 24 hotspots currently in the atlas — coverage for its real range is on the roadmap." /></div>
          )}
        </section>
        {bestMonths.length > 0 && (
          <section className="field-card rounded-sm p-6">
            <h2 className="text-2xl font-black text-forest-900">Best time to see it</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Derived from the best months of the hotspots above.</p>
            <div className="mt-5 grid grid-cols-6 gap-2 sm:grid-cols-12">{monthNames.map(m=><div key={m} className={"rounded-md px-2 py-3 text-center text-xs font-bold " + (bestMonths.includes(m)?'bg-forest-700 text-white':'bg-white/70 text-slate-500 dark:bg-white/5 dark:text-slate-400')}>{m}</div>)}</div>
          </section>
        )}
        <section className="field-card rounded-sm p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black text-forest-900"><Compass size={20}/>Best habitat</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{sp.habitat}</p>
        </section>
        <section className="field-card rounded-sm p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black text-forest-900"><ShieldAlert size={20}/>Ethical viewing notes</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{sp.viewingTips}</p>
        </section>
        <section className="field-card rounded-sm p-6">
          <h2 className="flex items-center gap-2 text-2xl font-black text-forest-900"><Camera size={20}/>Photography tips</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">{sp.photographyTips}</p>
        </section>
      </div>
      <div className="grid content-start gap-6">
        <section className="field-card rounded-sm p-5">
          <h2 className="text-lg font-bold text-forest-900">Quick facts</h2>
          <div className="mt-4 grid gap-3 text-sm">
            <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Category</p><p className="font-semibold text-slate-800 dark:text-slate-200">{sp.category}</p></div>
            <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Sighting difficulty</p><p className="font-semibold text-slate-800 dark:text-slate-200">{sp.difficultyOfSighting}</p></div>
            <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Conservation status</p><p className="font-semibold text-slate-800 dark:text-slate-200">{sp.conservationStatus}</p></div>
          </div>
        </section>
        {similar.length > 0 && (
          <section><h2 className="mb-3 text-xl font-black text-forest-900">Similar species</h2><div className="grid gap-3">{similar.map(s => <SpeciesCard key={s!.slug} species={s!} />)}</div></section>
        )}
      </div>
    </section>
  </main>;
}
