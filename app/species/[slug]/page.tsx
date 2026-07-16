import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowDown, ArrowRight, Binoculars, Camera, Compass, Feather, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { species, getSpeciesBySlug } from "@/data/species";
import { hotspots } from "@/data/hotspots";
import { hotspotsForSpecies, bestMonthsForSpecies } from "@/lib/speciesLinks";
import { HotspotCard } from "@/components/HotspotCard";
import { SpeciesCard } from "@/components/SpeciesCard";
import { SpeciesImage } from "@/components/SpeciesImage";
import { EmptyState } from "@/components/EmptyState";
import { getExtendedSpecies, getExtendedSpeciesBySlug } from "@/lib/extendedSpecies";
import { ExtendedSpeciesProfile } from "@/components/ExtendedSpeciesProfile";
import { indiaSpecialities } from "@/data/indiaSpecialities";
import { SpecialityBadges } from "@/components/SpecialityBadges";
import { biomeClassName } from "@/lib/experienceDesign";
import { speciesExperience } from "@/lib/speciesExperience";
import { speciesEncounters } from "@/data/speciesEncounters";
import { WildlifeEncounter } from "@/components/WildlifeEncounter";
import { JournalSaveButton } from "@/components/JournalSaveButton";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function generateStaticParams() {
  return [...species.map((item) => ({ slug: item.slug })), ...getExtendedSpecies().map((item) => ({ slug: item.slug }))];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const selectedSpecies = getSpeciesBySlug(slug);
  if (selectedSpecies) {
    const title = `${selectedSpecies.commonName} — Where to See It in India | Wild India Atlas`;
    const description = `${selectedSpecies.shortDescription} Sighting difficulty: ${selectedSpecies.difficultyOfSighting}. ${selectedSpecies.habitat}.`;
    return { title, description, openGraph: { title, description, type: "article" } };
  }
  const extended = getExtendedSpeciesBySlug(slug);
  if (extended) {
    const title = `${extended.commonName} — Confirmed Sightings | Wild India Atlas`;
    const description = `${extended.commonName} (${extended.scientificName}), confirmed via ${extended.source} at ${extended.confirmedAt.length} hotspot${extended.confirmedAt.length === 1 ? "" : "s"} in the atlas.`;
    return { title, description, openGraph: { title, description, type: "article" } };
  }
  return {};
}

export default async function SpeciesDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const selectedSpecies = getSpeciesBySlug(slug);
  if (!selectedSpecies) {
    const extended = getExtendedSpeciesBySlug(slug);
    if (!extended) notFound();
    return <ExtendedSpeciesProfile species={extended} />;
  }

  const matchedHotspots = hotspotsForSpecies(selectedSpecies, hotspots);
  const bestMonths = bestMonthsForSpecies(selectedSpecies, hotspots);
  const similar = selectedSpecies.similarSpeciesSlugs.map(getSpeciesBySlug).filter(Boolean);
  const speciality = indiaSpecialities[selectedSpecies.scientificName];
  const experience = speciesExperience(selectedSpecies);
  const encounter = speciesEncounters[selectedSpecies.slug];
  const firstHotspot = matchedHotspots[0];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${selectedSpecies.commonName} — Where to See It in India`,
    description: selectedSpecies.shortDescription,
    about: selectedSpecies.commonName,
  };

  return (
    <main className={`${biomeClassName[experience.biome]} species-story overflow-clip bg-biome-surface text-biome-ink`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="species-hero relative flex min-h-[92svh] items-end overflow-hidden border-b border-white/10">
        <SpeciesImage slug={selectedSpecies.slug} category={selectedSpecies.category} alt={`${selectedSpecies.commonName} in its natural habitat`} priority className="hero-ken-burns absolute inset-0 h-full w-full" />
        <div className="species-hero-wash absolute inset-0" />
        <div className="texture-grain pointer-events-none absolute inset-0" />
        <div className="relative z-[2] mx-auto grid w-full max-w-[90rem] items-end gap-10 px-4 pb-12 pt-32 sm:px-6 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-10 lg:pb-20">
          <div className="motion-reveal max-w-5xl">
            <Link href="/species" className="field-label inline-flex min-h-11 items-center gap-2 text-biome-ink/65 transition hover:text-biome-accent"><ArrowRight size={14} className="rotate-180" /> Species field guide</Link>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="atlas-chip border-biome-accent/40 text-biome-accent">{selectedSpecies.category}</span>
              <span className="atlas-chip">Sighting · {selectedSpecies.difficultyOfSighting}</span>
              {speciality && <SpecialityBadges endemic={speciality.endemic === "yes"} iconic={speciality.iconic} />}
            </div>
            <p className="field-label mt-8 text-biome-accent">{experience.landscape}</p>
            <h1 className="display-hero mt-3 max-w-[12ch] text-biome-ink">{selectedSpecies.commonName}</h1>
            <p className="mt-5 font-display text-lg italic text-biome-ink/58 sm:text-2xl">{selectedSpecies.scientificName}</p>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-biome-ink/82 sm:text-xl sm:leading-9">{selectedSpecies.shortDescription}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#encounter" className="atlas-button"><ArrowDown size={15} /> Enter the encounter</a>
              {firstHotspot && <Link href={`/map?place=${firstHotspot.slug}`} className="atlas-button atlas-button-ghost"><MapPin size={15} /> Find on the atlas</Link>}
              <JournalSaveButton type="species" slug={selectedSpecies.slug} tone="dark" />
            </div>
          </div>

          <aside className="shell-chrome hidden rounded-field p-5 lg:block">
            <p className="field-label text-biome-accent">Field signal</p>
            <p className="mt-3 font-display text-2xl leading-tight">{experience.fieldSignal}</p>
            <div className="mt-6 grid gap-4 border-t border-white/10 pt-5 text-sm">
              <div><p className="field-label text-biome-ink/45">Status</p><p className="mt-1 text-biome-ink/85">{selectedSpecies.conservationStatus}</p></div>
              <div><p className="field-label text-biome-ink/45">Known trails</p><p className="mt-1 text-biome-ink/85">{matchedHotspots.length || "Atlas expansion pending"}</p></div>
              <div><p className="field-label text-biome-ink/45">Best window</p><p className="mt-1 text-biome-ink/85">{bestMonths.length ? `${bestMonths[0]} — ${bestMonths.at(-1)}` : "Varies by range"}</p></div>
            </div>
          </aside>
        </div>
        <div className="absolute bottom-0 right-6 z-[2] hidden h-24 w-px bg-gradient-to-b from-biome-accent to-transparent lg:block" />
      </section>

      <nav aria-label="Species story chapters" className="species-chapter-nav sticky top-[65px] z-30 border-b border-white/10 bg-biome-surface/88 backdrop-blur-xl">
        <div className="atlas-scrollbar mx-auto flex max-w-[90rem] gap-6 overflow-x-auto px-4 py-3 sm:px-6 lg:px-10">
          <a href="#encounter">01 · Encounter</a>{encounter && <a href="#expedition">02 · Expedition</a>}<a href="#season">{encounter ? "03" : "02"} · Season</a><a href="#range">{encounter ? "04" : "03"} · Range</a><a href="#fieldcraft">{encounter ? "05" : "04"} · Fieldcraft</a>
        </div>
      </nav>

      <section id="encounter" className="texture-topography relative scroll-mt-32 border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto grid max-w-[90rem] gap-12 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-10">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <p className="field-label text-biome-accent">01 · {experience.encounterLabel}</p>
            <h2 className="display-section mt-4 text-biome-ink">Enter its world.</h2>
            <p className="mt-7 max-w-md text-base leading-7 text-biome-ink/60">An encounter begins long before the animal appears. Start with the landscape it depends on, then let patience do the rest.</p>
          </div>
          <div className="grid gap-6">
            <article className="species-glass-panel min-h-[320px] rounded-field p-7 sm:p-10">
              <Compass className="text-biome-accent" size={28} strokeWidth={1.5} />
              <p className="field-label mt-10 text-biome-ink/45">Habitat</p>
              <p className="mt-4 font-display text-3xl leading-[1.25] text-biome-ink sm:text-5xl">{selectedSpecies.habitat}</p>
            </article>
            <div className="grid gap-6 sm:grid-cols-2">
              <article className="species-glass-panel rounded-field p-7"><Binoculars className="text-biome-accent" size={24} /><p className="field-label mt-8 text-biome-ink/45">The odds</p><p className="mt-2 font-display text-3xl text-biome-ink">{selectedSpecies.difficultyOfSighting}</p><p className="mt-3 text-sm leading-6 text-biome-ink/58">Wildlife does not perform on schedule. Treat every sighting as a privilege, never a promise.</p></article>
              <article className="species-glass-panel rounded-field p-7"><ShieldCheck className="text-biome-accent" size={24} /><p className="field-label mt-8 text-biome-ink/45">Conservation</p><p className="mt-2 font-display text-3xl leading-tight text-biome-ink">{selectedSpecies.conservationStatus}</p><p className="mt-3 text-sm leading-6 text-biome-ink/58">Your distance, silence, and choice of responsible guides are part of its protection.</p></article>
            </div>
          </div>
        </div>
      </section>

      {encounter && <WildlifeEncounter encounter={encounter} speciesSlug={selectedSpecies.slug} category={selectedSpecies.category} />}

      <section id="season" className="scroll-mt-32 border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="max-w-3xl"><p className="field-label text-biome-accent">{encounter ? "03" : "02"} · Read the year</p><h2 className="display-section mt-4 text-biome-ink">Wait for the right season.</h2><p className="mt-6 max-w-2xl text-base leading-7 text-biome-ink/60">These windows are derived from the best months of atlas places where this species is a known highlight.</p></div>
          {bestMonths.length ? (
            <div className="mt-12 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-12">
              {monthNames.map((month, index) => {
                const active = bestMonths.includes(month);
                return <div key={month} className={`species-month rounded-field px-2 py-5 text-center ${active ? "is-active" : ""}`}><span className="field-label block">{String(index + 1).padStart(2, "0")}</span><span className="mt-3 block font-display text-xl">{month}</span><span className="mx-auto mt-4 block h-1 w-1 rounded-full bg-current" /></div>;
              })}
            </div>
          ) : <div className="mt-10"><EmptyState title="The field window is still being mapped" body="Seasonal guidance will appear as this species is connected to more atlas places." /></div>}
        </div>
      </section>

      <section id="range" className="texture-grain relative scroll-mt-32 border-b border-white/10 py-20 sm:py-28">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><div><p className="field-label text-biome-accent">{encounter ? "04" : "03"} · Follow the trail</p><h2 className="display-section mt-4 text-biome-ink">Where the wild still holds.</h2></div>{firstHotspot && <Link href={`/map?place=${firstHotspot.slug}`} className="atlas-button atlas-button-ghost shrink-0">Open living atlas <ArrowRight size={15} /></Link>}</div>
          {matchedHotspots.length ? <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{matchedHotspots.map((hotspot) => <HotspotCard key={hotspot.slug} hotspot={hotspot} compact tone="atlas" />)}</div> : <div className="mt-10"><EmptyState title="Not yet featured at an atlas hotspot" body="Its real range extends beyond the places currently mapped. Coverage is still growing." /></div>}
        </div>
      </section>

      <section id="fieldcraft" className="scroll-mt-32 bg-paper py-20 text-ink sm:py-28">
        <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-10">
          <p className="field-label text-forest-700 dark:text-sand">{encounter ? "05" : "04"} · Fieldcraft</p>
          <h2 className="display-section mt-4 max-w-4xl text-forest-900">Leave with the story, not the disturbance.</h2>
          <div className="mt-12 grid gap-px overflow-hidden rounded-field border border-forest-900/10 bg-forest-900/10 lg:grid-cols-2">
            <article className="bg-paper p-7 sm:p-10"><ShieldCheck size={28} className="text-forest-700 dark:text-sand" /><p className="field-label mt-10 text-slate-500">Ethical encounter</p><h3 className="mt-3 font-display text-3xl text-forest-900">Let the animal choose the distance.</h3><p className="mt-5 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300">{selectedSpecies.viewingTips}</p></article>
            <article className="bg-paper p-7 sm:p-10"><Camera size={28} className="text-forest-700 dark:text-sand" /><p className="field-label mt-10 text-slate-500">Through the lens</p><h3 className="mt-3 font-display text-3xl text-forest-900">Photograph behaviour, not pressure.</h3><p className="mt-5 max-w-xl text-base leading-8 text-slate-700 dark:text-slate-300">{selectedSpecies.photographyTips}</p></article>
          </div>
          {similar.length > 0 && <section className="mt-20 border-t border-forest-900/10 pt-12"><div className="flex items-center gap-3"><Sparkles size={18} className="text-amberfield" /><p className="field-label text-slate-500">Continue exploring</p></div><h2 className="mt-4 font-display text-4xl text-forest-900 sm:text-5xl">Kindred wild lives</h2><div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{similar.map((item) => <SpeciesCard key={item!.slug} species={item!} />)}</div></section>}
          <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-forest-900/10 pt-10 sm:flex-row sm:items-center"><div><p className="field-label text-slate-500">End of field note</p><p className="mt-2 font-display text-2xl text-forest-900">The next encounter starts with curiosity.</p></div><Link href="/species" className="atlas-button !text-forest-900"><Feather size={15} /> Explore all species</Link></div>
        </div>
      </section>
    </main>
  );
}
