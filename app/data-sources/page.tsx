import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ConfidenceDot } from "@/components/FreshnessBadge";
import { StructuralRiskNotice } from "@/components/StructuralRiskNotice";
import { structuralRisks } from "@/data/structuralRisks";

export const metadata: Metadata = {
  title: "How we verify data | Wild India Atlas",
  description: "What the confidence badges on hotspot pages mean, and how closure and travel facts are sourced and kept up to date.",
};

export default function DataSourcesPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
      <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-river">Data &amp; trust</p>
      <h1 className="mt-3 flex items-center gap-3 text-4xl font-semibold text-forest-900">
        <ShieldCheck size={32} className="text-forest-700 dark:text-forest-300" />
        How we verify data
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700 dark:text-slate-300">
        Wild India Atlas is a static site with no live database — every fact you see was researched, written, and
        committed by hand. The badges on hotspot pages exist so you can tell, at a glance, how solid a specific
        claim is before you plan around it.
      </p>

      <section className="mt-10 field-card rounded-sm p-6">
        <h2 className="text-2xl font-black text-forest-900">The three confidence tiers</h2>
        <div className="mt-5 grid gap-5">
          <div className="flex items-start gap-3">
            <ConfidenceDot confidence="official" className="mt-1.5" />
            <div>
              <p className="font-bold text-forest-900">Official source</p>
              <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                The note cites a specific department, notification, or authority by name (e.g. "Rajasthan Forest
                Department order") — the strongest tier we track.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ConfidenceDot confidence="inferred" className="mt-1.5" />
            <div>
              <p className="font-bold text-forest-900">Inferred from general reporting</p>
              <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                A confidently-stated general pattern (e.g. a well-documented monsoon closure window) with no single
                named authority behind it in our research.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ConfidenceDot confidence="unconfirmed" className="mt-1.5" />
            <div>
              <p className="font-bold text-forest-900">Unconfirmed</p>
              <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                No official closure notice could be found — often because a park genuinely has no formal seasonal
                closure, but we haven't found a source that states that outright either.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 field-card rounded-sm p-6">
        <h2 className="text-2xl font-black text-forest-900">What "Verified" means</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
          The date on a badge is when we last checked and confirmed the wording of that note — it is <em>not</em> a
          claim that the underlying government policy changed on that date, or that it's been re-checked since.
          State forest departments set exact closure dates annually and can shift them by a week or two; always
          confirm locally before booking travel.
        </p>
      </section>

      <section className="mt-6 field-card rounded-sm p-6">
        <h2 className="text-2xl font-black text-forest-900">Source links</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
          Where a badge names a source, we've named the department or authority the note is based on. A direct link
          to a specific citable page is only shown once we've verified that page ourselves — we don't guess at
          government URLs or link to a homepage and call it a source.
        </p>
      </section>

      <section id="structural-risks" className="mt-6 field-card scroll-mt-24 rounded-sm p-6">
        <h2 className="text-2xl font-black text-forest-900">Structural risk flags</h2>
        <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
          A handful of hotspots have real complexity that isn't seasonal — it's about who has authority over the
          place, or whether it's genuinely open to visitors at all. Where that applies, a larger callout appears
          near the top of the hotspot page, separate from the closure badge:
        </p>
        <div className="mt-4 grid gap-3">
          <div>
            <p className="font-bold text-forest-900">Multiple jurisdictions / split management authority</p>
            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
              The park spans more than one state, or is managed by an authority that doesn't match the usual
              state-Forest-Department pattern this site sources from elsewhere. Treat closure and permit
              information for these parks as lower-confidence, and double-check the specific zone or authority
              relevant to your visit.
            </p>
          </div>
          <div>
            <p className="font-bold text-forest-900">Access restricted</p>
            <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
              The strongest flag we use — it means general tourism to that park is not currently possible, for
              reasons unrelated to season. This is a warning, not a planning footnote: don't book a trip around a
              park carrying this flag without independently confirming current access first.
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <StructuralRiskNotice risk={structuralRisks["kuno-national-park"]} />
          <StructuralRiskNotice risk={structuralRisks["indravati-national-park"]} />
        </div>
      </section>

      <p className="mt-8 text-sm text-slate-600 dark:text-slate-400">
        <Link href="/hotspots" className="font-semibold text-river hover:underline dark:text-sky-300">
          ← Back to the hotspot directory
        </Link>
      </p>
    </main>
  );
}
