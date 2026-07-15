import type { Metadata } from "next";
import { ArrowRight, Binoculars, Compass, Leaf, MapPin, PawPrint, Waves, Wind } from "lucide-react";
import { BiomeSurface } from "@/components/BiomeSurface";
import { HotspotImage } from "@/components/HotspotImage";
import { SoundPreferenceToggle } from "@/components/SoundPreference";
import { biomeClassName, biomeThemes } from "@/lib/experienceDesign";

export const metadata: Metadata = {
  title: "Field Kit · Wild India Atlas",
  description: "Private visual reference for the Wild India Atlas experience design system.",
  robots: { index: false, follow: false },
};

const swatches = [
  { label: "Canopy", value: "#16261e", className: "bg-[#16261e]" },
  { label: "Field paper", value: "#fbf7ec", className: "bg-[#fbf7ec]" },
  { label: "Turmeric", value: "#d8b56d", className: "bg-[#d8b56d]" },
  { label: "River", value: "#2f7da1", className: "bg-[#2f7da1]" },
  { label: "Clay", value: "#b5592f", className: "bg-[#b5592f]" },
  { label: "Moss", value: "#6f7d3c", className: "bg-[#6f7d3c]" },
];

const motionSamples = [
  { label: "Reveal", className: "motion-reveal", icon: Leaf },
  { label: "Drift", className: "motion-drift", icon: Wind },
  { label: "Float", className: "motion-float", icon: Binoculars },
  { label: "Observe", className: "motion-pulse-soft", icon: PawPrint },
];

export default function FieldKitPage() {
  return (
    <main className="pb-10 pt-28 sm:pt-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-8 border-b border-forest-700/15 pb-12 dark:border-white/10 lg:grid-cols-[1fr_0.72fr] lg:items-end">
          <div>
            <p className="field-label text-river dark:text-sky-300">Experience system · Phase 1</p>
            <h1 className="display-section mt-4 max-w-4xl text-forest-900 dark:text-white">A living field guide for India&apos;s wild places.</h1>
          </div>
          <p className="max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 lg:justify-self-end">
            This private page is the visual source of truth for atmosphere, typography, texture, motion and interaction. Public pages will borrow from this kit rather than inventing their own styles.
          </p>
        </div>

        <section className="py-14">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="field-label text-river dark:text-sky-300">01 · Atmosphere</p>
              <h2 className="mt-2 text-3xl text-forest-900 dark:text-white">Biome palettes</h2>
            </div>
            <p className="max-w-lg text-sm leading-6 text-slate-600 dark:text-slate-300">Each biome scopes five semantic colours. Components remain identical while the landscape changes around them.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {biomeThemes.map((theme, index) => (
              <BiomeSurface key={theme.key} biome={theme.key} textured className="min-h-[330px] overflow-hidden rounded-field p-6 shadow-field">
                <div className="flex items-start justify-between gap-4">
                  <span className="field-label text-biome-accent">0{index + 1} · {theme.region}</span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-white/10"><MapPin size={15} /></span>
                </div>
                <div className="mt-28">
                  <h3 className="text-4xl font-medium text-biome-ink">{theme.label}</h3>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-biome-ink/72">{theme.atmosphere}</p>
                  <p className="field-label mt-6 border-t border-white/15 pt-4 text-biome-ink/55">{theme.cue}</p>
                </div>
              </BiomeSurface>
            ))}
          </div>
        </section>

        <section className="grid gap-8 border-y border-forest-700/15 py-14 dark:border-white/10 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <p className="field-label text-river dark:text-sky-300">02 · Voice</p>
            <h2 className="mt-2 text-3xl text-forest-900 dark:text-white">Editorial, then practical.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">Fraunces carries wonder and observation. Work Sans handles planning. IBM Plex Mono marks coordinates, seasons and evidence.</p>
          </div>
          <div className="space-y-9">
            <div>
              <span className="field-label text-clay">Display · Fraunces 500</span>
              <p className="display-section mt-3 text-forest-900 dark:text-white">Where the forest begins to breathe.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <span className="field-label text-river dark:text-sky-300">Body · Work Sans</span>
                <p className="mt-3 leading-7 text-slate-700 dark:text-slate-300">Move slowly at the edge of the meadow. Chital alarm calls often travel through the forest before a tiger appears.</p>
              </div>
              <div>
                <span className="field-label text-river dark:text-sky-300">Field note · Fraunces italic</span>
                <p className="field-note mt-3 text-slate-700 dark:text-slate-300">Fresh pugmarks crossed the track just after first light.</p>
              </div>
            </div>
            <div className="rounded-field bg-forest-900 p-5 text-white">
              <span className="field-label text-sand">Observation 07:42 · 22.3341° N, 80.6115° E</span>
            </div>
          </div>
        </section>

        <section className="py-14">
          <div className="mb-7">
            <p className="field-label text-river dark:text-sky-300">03 · Core palette</p>
            <h2 className="mt-2 text-3xl text-forest-900 dark:text-white">Field colours</h2>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {swatches.map((swatch) => (
              <div key={swatch.label} className="field-card overflow-hidden rounded-field">
                <div className={`h-28 ${swatch.className}`} />
                <div className="p-3">
                  <p className="text-sm font-semibold">{swatch.label}</p>
                  <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-slate-500">{swatch.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <BiomeSurface biome="forest" textured className="overflow-hidden rounded-field px-5 py-12 shadow-lift sm:px-10">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="field-label text-biome-accent">04 · Controls</p>
              <h2 className="display-section mt-4 max-w-2xl text-biome-ink">Made for curious explorers.</h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-biome-ink/70">Controls are compact, tactile and legible. Sound is always an explicit preference and remains off until the visitor enables it.</p>
            </div>
            <div className="flex flex-col items-start gap-5 lg:items-end">
              <div className="flex flex-wrap gap-3">
                <button className="atlas-button" type="button">Open the atlas <ArrowRight size={15} /></button>
                <button className="atlas-button atlas-button-ghost" type="button">Read field notes</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="atlas-chip"><PawPrint size={13} /> Tiger</span>
                <span className="atlas-chip"><Waves size={13} /> Wetlands</span>
                <SoundPreferenceToggle />
              </div>
            </div>
          </div>
        </BiomeSurface>

        <section className="grid gap-8 py-14 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <p className="field-label text-river dark:text-sky-300">05 · Imagery</p>
            <h2 className="mt-2 text-3xl text-forest-900 dark:text-white">Photography with cartographic edges.</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">Full-bleed photographs carry immersion. Organic and atlas masks become occasional editorial devices, never a treatment applied to every image.</p>
          </div>
          <div className={`biome-forest grid min-h-[430px] grid-cols-2 gap-4 overflow-hidden rounded-field bg-biome-surface p-5 sm:p-8 ${biomeClassName.forest}`}>
            <HotspotImage slug="jim-corbett-national-park" type="National Park" showCredit={false} className="image-mask-organic image-wash h-64 self-end shadow-lift sm:h-80" />
            <HotspotImage slug="kaziranga-national-park" type="National Park" showCredit={false} className="image-mask-atlas image-wash h-72 shadow-lift sm:h-96" />
          </div>
        </section>

        <section className="border-t border-forest-700/15 py-14 dark:border-white/10">
          <div className="mb-7">
            <p className="field-label text-river dark:text-sky-300">06 · Motion</p>
            <h2 className="mt-2 text-3xl text-forest-900 dark:text-white">One movement, one meaning.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {motionSamples.map(({ label, className, icon: Icon }) => (
              <div key={label} className="field-card min-h-44 overflow-hidden rounded-field p-5">
                <span className="field-label text-slate-500">{label}</span>
                <div className="grid h-28 place-items-center">
                  <span className={`grid h-14 w-14 place-items-center rounded-full bg-forest-900 text-sand shadow-field ${className}`}><Icon size={22} /></span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex gap-4 rounded-field border border-forest-700/15 bg-white/45 p-5 dark:border-white/10 dark:bg-white/5">
            <Compass className="mt-0.5 shrink-0 text-clay" size={20} />
            <div>
              <h3 className="text-lg text-forest-900 dark:text-white">Accessibility rule</h3>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">All atmosphere is progressive enhancement. Reduced-motion visitors receive static compositions, sound stays opt-in, and content never depends on animation to become available.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
