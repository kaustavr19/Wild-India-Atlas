import Link from "next/link";
import { MapPin } from "lucide-react";
import type { ExtendedSpecies } from "@/lib/extendedSpecies";
import { formatVerifiedDate } from "@/lib/formatDate";
import { indiaSpecialities } from "@/data/indiaSpecialities";
import { SpecialityBadges } from "./SpecialityBadges";

// Deliberately distinct from the Flagship species profile (app/species/[slug]/page.tsx) — no
// viewingTips/photographyTips/similarSpecies sections, since that data doesn't exist for an
// auto-derived Extended entry. Rendering an empty section or invented tips would misrepresent
// this as curated content when it's really a grouped citizen-science record.
export function ExtendedSpeciesProfile({ species }: { species: ExtendedSpecies }) {
  const speciality = indiaSpecialities[species.scientificName];
  return (
    <main>
      <section className={"relative flex min-h-[280px] items-end overflow-hidden px-4 pb-10 pt-28 text-white sm:px-6 " + (species.photoUrl ? "" : "bg-forest-900")}>
        {species.photoUrl && (
          <>
            <img src={species.photoUrl} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-900 via-forest-900/75 to-forest-900/10" />
          </>
        )}
        <div className="mx-auto w-full max-w-7xl">
          <Link href="/species" className="font-mono text-xs font-bold uppercase tracking-wide text-sand">← Back to species guide</Link>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-sm bg-forest-700 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">{species.iconicGroup}</span>
            <span className="rounded-sm border border-white/30 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/90">via {species.source}</span>
            {speciality && <SpecialityBadges endemic={speciality.endemic === "yes"} iconic={speciality.iconic} />}
          </div>
          <h1 className="mt-4 max-w-4xl text-5xl font-semibold">{species.commonName}</h1>
          <p className="mt-2 max-w-3xl text-lg italic text-white/70">{species.scientificName}</p>
          <p className="mt-3 max-w-3xl border-l-2 border-sand pl-4 text-sm leading-7 text-ivory">
            An Extended-tier entry, auto-grouped from real {species.source} citizen-science records rather than hand-curated — not a full profile like the Flagship species above it on the guide.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="grid content-start gap-6">
          <section className="field-card rounded-sm p-6">
            <h2 className="text-2xl font-black text-forest-900">Confirmed at {species.confirmedAt.length} hotspot{species.confirmedAt.length === 1 ? "" : "s"}</h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">via {species.source} · updated {formatVerifiedDate(species.lastPulled)}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {species.confirmedAt.map(c => (
                <Link
                  key={c.slug}
                  href={"/hotspots/" + c.slug}
                  className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1.5 text-xs font-semibold text-forest-700 transition hover:bg-forest-200 dark:bg-forest-500/25 dark:text-forest-100 dark:hover:bg-forest-500/40"
                >
                  <MapPin size={12} className="shrink-0" />
                  {c.hotspotName}
                </Link>
              ))}
            </div>
          </section>
        </div>
        <div className="grid content-start gap-6">
          <section className="field-card rounded-sm p-5">
            <h2 className="text-lg font-bold text-forest-900">Quick facts</h2>
            <div className="mt-4 grid gap-3 text-sm">
              <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Group</p><p className="font-semibold text-slate-800 dark:text-slate-200">{species.iconicGroup}</p></div>
              <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Source</p><p className="font-semibold text-slate-800 dark:text-slate-200">{species.source}</p></div>
              {species.conservationStatus && (
                <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Conservation status</p><p className="font-semibold text-slate-800 dark:text-slate-200">{species.conservationStatus}</p></div>
              )}
              <div><p className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Hotspots confirmed at</p><p className="font-semibold text-slate-800 dark:text-slate-200">{species.confirmedAt.length}</p></div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
