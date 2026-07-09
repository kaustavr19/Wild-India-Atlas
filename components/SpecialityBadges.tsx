import { Star, Fingerprint } from "lucide-react";

// Two real, separately-defined signals (see data/indiaSpecialities.ts) — never merged into
// one "special" concept. Iconic is an editorial curation call (seeded from data/species.ts,
// the Flagship tier); Endemic is a factual claim resolved from iNaturalist's establishment_means
// for India. A species can show both, one, or neither — no badge is the correct default for
// "no"/"unknown" endemic status, not an invented empty/neutral state.
export function SpecialityBadges({ endemic, iconic, className }: { endemic: boolean; iconic: boolean; className?: string }) {
  if (!endemic && !iconic) return null;
  return (
    <div className={"flex flex-wrap gap-1.5" + (className ? " " + className : "")}>
      {iconic && (
        <span className="inline-flex items-center gap-1 rounded-full bg-amberfield/20 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-amberfield dark:text-sand">
          <Star size={10} className="fill-current" /> Iconic
        </span>
      )}
      {endemic && (
        <span className="inline-flex items-center gap-1 rounded-full bg-river/15 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wide text-river dark:text-sky-300">
          <Fingerprint size={10} /> Endemic
        </span>
      )}
    </div>
  );
}
