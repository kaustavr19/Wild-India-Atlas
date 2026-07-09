import Link from "next/link";
import { SpeciesImage } from "./SpeciesImage";
import { SpecialityBadges } from "./SpecialityBadges";

// One consistent minimal layout for the merged /species list regardless of tier — the
// Flagship/Extended split still exists (it decides which profile template a click leads to),
// it just isn't shown as a browsing-level distinction anymore. Flagship keeps its existing
// photo behavior (real photo or the site's designed fallback illustration, via
// <SpeciesImage>); Extended keeps its own (real photoUrl or a plain text header, never a
// placeholder) — unchanged from how each already worked, just wrapped in the same card shell.
export type MergedSpeciesListItem = {
  slug: string;
  commonName: string;
  scientificName: string;
  group: string;
  tier: "Flagship" | "Extended";
  photoUrl?: string; // only meaningful for Extended entries
  endemic: boolean;
  iconic: boolean;
};

export function MergedSpeciesCard({ item }: { item: MergedSpeciesListItem }) {
  return (
    <Link href={"/species/" + item.slug} className="block min-w-0">
      <article className="field-card group overflow-hidden rounded-sm transition hover:-translate-y-0.5 hover:shadow-field">
        {item.tier === "Flagship" ? (
          <div className="relative">
            <SpeciesImage slug={item.slug} category={item.group} className="h-36 w-full" showCredit={false} />
            <div className="absolute right-3 top-3 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{item.group}</div>
          </div>
        ) : item.photoUrl ? (
          <div className="relative h-36 w-full overflow-hidden bg-forest-900">
            <img src={item.photoUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute right-3 top-3 rounded-sm bg-forest-900/90 px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-flare">{item.group}</div>
          </div>
        ) : (
          <div className="flex h-14 items-center bg-forest-100 px-4 dark:bg-forest-900/40">
            <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-forest-700 dark:text-forest-300">{item.group}</span>
          </div>
        )}
        <div className="p-4">
          <SpecialityBadges endemic={item.endemic} iconic={item.iconic} className="mb-2" />
          <h3 className="truncate font-bold text-forest-900">{item.commonName}</h3>
          <p className="mt-1 truncate text-sm italic text-slate-600 dark:text-slate-400">{item.scientificName}</p>
        </div>
      </article>
    </Link>
  );
}
