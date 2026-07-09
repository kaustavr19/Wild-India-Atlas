"use client";
import { useState } from "react";
import { formatVerifiedDate } from "@/lib/formatDate";
import { Tag } from "@/components/Tag";
import type { EbirdSpeciesEntry } from "@/scripts/fetch-ebird-species";

const COLLAPSED_COUNT = 24;

// Separate from the curated "What you can see" chips on purpose — this is the raw, unedited
// eBird checklist for the hotspot's confirmed mapping (see data/ebirdHotspots.ts), additive to
// editorial content rather than a replacement for it. obsCount deliberately isn't shown: it's
// the count from a single most-recent checklist, not a frequency, and would overstate the
// signal if presented as one — presence on the list is what's meaningful here.
export function EbirdChecklist({ species }: { species: EbirdSpeciesEntry[] }) {
  const [expanded, setExpanded] = useState(false);
  if (species.length === 0) return null;
  const visible = expanded ? species : species.slice(0, COLLAPSED_COUNT);

  return (
    <section className="field-card rounded-sm p-6">
      <h2 className="text-2xl font-black text-forest-900">Birds confirmed via eBird</h2>
      <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
        via eBird · updated {formatVerifiedDate(species[0].lastPulled)}
      </span>
      <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
        {species.length} species reported on real eBird checklists at this hotspot — a citizen-science record, separate from the curated species list above.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {visible.map(s => <Tag key={s.speciesCode} tone="blue">{s.comName}</Tag>)}
      </div>
      {species.length > COLLAPSED_COUNT && (
        <button
          type="button"
          onClick={() => setExpanded(e => !e)}
          className="mt-4 font-mono text-xs font-bold uppercase tracking-wide text-river hover:underline dark:text-sky-300"
        >
          {expanded ? "Show less" : `Show all ${species.length} species`}
        </button>
      )}
    </section>
  );
}
