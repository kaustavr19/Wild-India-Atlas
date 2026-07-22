import Link from "next/link";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Binoculars,
  Database,
  Feather,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { ExtendedSpecies } from "@/lib/extendedSpecies";
import { formatVerifiedDate } from "@/lib/formatDate";
import { indiaSpecialities } from "@/data/indiaSpecialities";
import { SpecialityBadges } from "./SpecialityBadges";
import { JourneyTracker } from "./JourneyTracker";
import { JournalSaveButton } from "./JournalSaveButton";
import { ExtendedSpeciesImage } from "./ExtendedSpeciesImage";
import { HotspotCard } from "./HotspotCard";
import { getHotspotBySlug } from "@/data/hotspots";
import { ecosystem, type Ecosystem } from "@/data/ecosystems";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";

function dominantBiome(slugs: string[]): Ecosystem {
  const counts = new Map<Ecosystem, number>();
  slugs.forEach((slug) => {
    const biome = ecosystem[slug];
    if (biome) counts.set(biome, (counts.get(biome) ?? 0) + 1);
  });
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "forest";
}

// Evidence-led profiles deliberately do not invent habitat, viewing or photography notes.
// Their richer presentation is built only from grouped citizen-science records already in the atlas.
export function ExtendedSpeciesProfile({ species }: { species: ExtendedSpecies }) {
  const speciality = indiaSpecialities[species.scientificName];
  const confirmedHotspots = species.confirmedAt.map((confirmation) => getHotspotBySlug(confirmation.slug)).filter(Boolean);
  const biome = dominantBiome(species.confirmedAt.map((confirmation) => confirmation.slug));
  const theme = biomeThemes.find((candidate) => candidate.key === biome) ?? biomeThemes[0];
  const firstHotspot = confirmedHotspots[0];

  return (
    <main className={`${biomeClassName[biome]} species-story overflow-clip bg-biome-surface text-biome-ink`}>
      <JourneyTracker type="species" slug={species.slug} />

      <section className="species-hero relative flex min-h-[88svh] items-end overflow-hidden border-b border-biome-line/10">
        <ExtendedSpeciesImage slug={species.slug} category={species.iconicGroup} fallbackPhotoUrl={species.photoUrl} alt={`${species.commonName} taxonomic reference`} priority className="absolute inset-0 h-full w-full" imageClassName="hero-ken-burns" />
        <div className="species-hero-wash absolute inset-0" />
        <div className="texture-grain pointer-events-none absolute inset-0" />

        <div className="relative z-[2] mx-auto grid w-full max-w-[90rem] items-end gap-10 px-4 pb-12 pt-32 sm:px-6 sm:pb-16 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-10 lg:pb-20">
          <div className="motion-reveal max-w-5xl">
            <Link href="/species" className="field-label inline-flex min-h-11 items-center gap-2 text-biome-ink/65 transition hover:text-biome-accent">
              <ArrowLeft size={14} /> Species field guide
            </Link>
            <div className="mt-7 flex flex-wrap items-center gap-2">
              <span className="atlas-chip border-biome-accent/45 text-biome-accent">{species.iconicGroup}</span>
              <span className="atlas-chip">Evidence profile</span>
              <span className="atlas-chip">via {species.source}</span>
              {speciality && <SpecialityBadges endemic={speciality.endemic === "yes"} iconic={speciality.iconic} />}
            </div>
            <p className="field-label mt-8 text-biome-accent">{theme.label} record</p>
            <h1 className="display-hero mt-3 max-w-[12ch] text-biome-ink">{species.commonName}</h1>
            <p className="mt-5 font-display text-lg italic text-biome-ink/58 sm:text-2xl">{species.scientificName}</p>
            <p className="mt-6 max-w-2xl border-l border-biome-accent/65 pl-5 text-base leading-8 text-biome-ink/78 sm:text-lg">
              A verified atlas record grouped from real {species.source} observations—not a hand-curated field profile. Explore where it has been recorded without mistaking presence for a guaranteed sighting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#evidence" className="atlas-button">Read the evidence <ArrowDown size={15} /></a>
              {firstHotspot && <Link href={`/map?place=${firstHotspot!.slug}`} className="atlas-button atlas-button-ghost"><MapPin size={15} /> Find on the atlas</Link>}
              <JournalSaveButton type="species" slug={species.slug} tone="dark" />
            </div>

            <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-field border border-biome-line/15 bg-biome-line/15 lg:hidden">
              <MobileSignal label="Evidence" value={species.source} />
              <MobileSignal label="Recorded at" value={`${species.confirmedAt.length} place${species.confirmedAt.length === 1 ? "" : "s"}`} />
            </div>
          </div>

          <aside className="shell-chrome hidden rounded-field p-5 lg:block">
            <div className="flex items-center justify-between border-b border-biome-line/15 pb-4">
              <p className="field-label text-biome-accent">Record signal</p>
              <Database size={18} className="text-biome-ink/48" />
            </div>
            <EvidenceSignal icon={Binoculars} label="Evidence tier" value="Citizen science" />
            <EvidenceSignal icon={MapPin} label="Recorded at" value={`${species.confirmedAt.length} atlas place${species.confirmedAt.length === 1 ? "" : "s"}`} />
            <EvidenceSignal icon={Database} label="Source" value={species.source} />
            <EvidenceSignal icon={ShieldCheck} label="Status" value={species.conservationStatus ?? "Not supplied by source"} last />
            <p className="field-note mt-5 text-biome-ink/68">{theme.cue}</p>
          </aside>
        </div>
      </section>

      <nav aria-label="Evidence profile chapters" className="species-chapter-nav sticky top-[65px] z-30 border-b border-biome-line/10 bg-biome-surface/90 backdrop-blur-xl">
        <div className="atlas-scrollbar mx-auto flex max-w-[90rem] gap-7 overflow-x-auto px-4 py-3 sm:px-6 lg:px-10">
          <a href="#evidence">01 · Evidence</a>
          <a href="#range">02 · Recorded range</a>
          <a href="#context">03 · Context</a>
        </div>
      </nav>

      <section id="evidence" className="texture-topography scroll-mt-32 border-b border-biome-line/10 px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="mx-auto grid max-w-[90rem] gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
          <header className="lg:sticky lg:top-36 lg:self-start">
            <p className="field-label text-biome-accent">01 · Evidence, not promise</p>
            <h2 className="display-section mt-4 text-biome-ink">A real record with honest limits.</h2>
            <p className="mt-6 max-w-md text-base leading-7 text-biome-ink/60">This page confirms where the species appears in an atlas dataset. It does not claim abundance, predict a sighting, or fill missing field guidance with assumptions.</p>
          </header>

          <div className="grid gap-4 sm:grid-cols-2">
            <article className="species-glass-panel rounded-field p-7 sm:col-span-2 sm:p-10">
              <Database size={27} className="text-biome-accent" />
              <p className="field-label mt-9 text-biome-ink/42">Dataset trail</p>
              <h3 className="mt-3 font-display text-3xl leading-tight text-biome-ink sm:text-5xl">Confirmed through {species.source}</h3>
              <p className="mt-5 max-w-2xl text-base leading-8 text-biome-ink/64">The atlas grouped observations sharing the scientific name <em>{species.scientificName}</em> and connected them to the protected landscapes below.</p>
            </article>
            <EvidenceCard eyebrow="Last refreshed" value={formatVerifiedDate(species.lastPulled)} detail="When the atlas last pulled this source record—not necessarily the observation date." />
            <EvidenceCard eyebrow="Conservation field" value={species.conservationStatus ?? "Not supplied"} detail={species.conservationStatus ? "Reported by the source dataset and displayed without reinterpretation." : `${species.source} does not provide a conservation value for this record.`} />
          </div>
        </div>
      </section>

      <section id="range" className="scroll-mt-32 border-b border-biome-line/10 px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <p className="field-label text-biome-accent">02 · Recorded range</p>
              <h2 className="display-section mt-4 max-w-4xl text-biome-ink">Where the atlas has evidence.</h2>
              <p className="mt-6 max-w-2xl text-base leading-7 text-biome-ink/60">These are confirmed data connections, not a complete distribution map. The species may occur beyond the places currently covered by the atlas.</p>
            </div>
            {firstHotspot && <Link href={`/map?place=${firstHotspot!.slug}`} className="atlas-button atlas-button-ghost shrink-0">Open living atlas <ArrowRight size={15} /></Link>}
          </div>
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {confirmedHotspots.map((hotspot) => <HotspotCard key={hotspot!.slug} hotspot={hotspot!} compact tone="atlas" />)}
          </div>
        </div>
      </section>

      <section id="context" className="scroll-mt-32 bg-paper px-4 py-20 text-ink sm:px-6 sm:py-28 lg:px-10">
        <div className="mx-auto max-w-[90rem]">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
            <div>
              <p className="field-label text-clay">03 · Read responsibly</p>
              <h2 className="display-section mt-4 text-ink">Know what the record can—and cannot—tell you.</h2>
            </div>
            <p className="max-w-xl text-base leading-7 text-ink/62 lg:justify-self-end">Citizen-science evidence expands the atlas without pretending every record has the editorial depth of a flagship profile.</p>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden rounded-field border border-forest-900/10 bg-forest-900/10 md:grid-cols-3">
            <ContextCard icon={ShieldCheck} title="Presence, not probability" body="A confirmed record shows that the species has been reported here. It does not reveal how likely, recent, or seasonally reliable a sighting may be." />
            <ContextCard icon={MapPin} title="Coverage, not full range" body="Only atlas-linked observations appear. Absence from this page is not evidence that a species is absent from another landscape." />
            <ContextCard icon={Binoculars} title="Observe without pressure" body="Use records to understand biodiversity, never to crowd, call, bait, pursue, or reveal a sensitive animal’s exact position." />
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-forest-900/10 pt-10 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3"><Sparkles className="mt-1 text-amberfield" size={18} /><div><p className="field-label text-slate-500">Continue exploring</p><p className="mt-2 font-display text-2xl text-forest-900">Meet the hand-curated flagship species.</p></div></div>
            <Link href="/species" className="atlas-button !text-forest-900"><Feather size={15} /> Explore all species</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function EvidenceSignal({ icon: Icon, label, value, last = false }: { icon: typeof Database; label: string; value: string; last?: boolean }) {
  return <div className={`flex gap-3 py-4 ${last ? "" : "border-b border-biome-line/10"}`}><Icon size={17} className="mt-0.5 shrink-0 text-biome-accent" /><div><p className="field-label text-biome-ink/42">{label}</p><p className="mt-1 text-sm font-semibold text-biome-ink/82">{value}</p></div></div>;
}

function MobileSignal({ label, value }: { label: string; value: string }) {
  return <div className="bg-biome-surface/82 p-4"><p className="field-label text-biome-ink/42">{label}</p><p className="mt-1 text-sm font-semibold text-biome-ink/82">{value}</p></div>;
}

function EvidenceCard({ eyebrow, value, detail }: { eyebrow: string; value: string; detail: string }) {
  return <article className="species-glass-panel rounded-field p-7"><p className="field-label text-biome-accent">{eyebrow}</p><p className="mt-4 font-display text-3xl leading-tight text-biome-ink">{value}</p><p className="mt-4 text-sm leading-6 text-biome-ink/55">{detail}</p></article>;
}

function ContextCard({ icon: Icon, title, body }: { icon: typeof ShieldCheck; title: string; body: string }) {
  return <article className="bg-paper p-7 sm:p-9"><Icon size={25} className="text-forest-700 dark:text-sand" /><h3 className="mt-8 font-display text-3xl text-forest-900">{title}</h3><p className="mt-4 text-sm leading-7 text-slate-700 dark:text-slate-300">{body}</p></article>;
}
