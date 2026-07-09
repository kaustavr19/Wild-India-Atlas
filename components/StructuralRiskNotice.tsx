import Link from "next/link";
import { AlertTriangle, Landmark } from "lucide-react";
import type { StructuralRisk } from "@/data/structuralRisks";

const kindLabel: Record<StructuralRisk["kind"], string> = {
  "multi-jurisdiction": "Multiple jurisdictions",
  "split-authority": "Split management authority",
  "access-restricted": "Not currently bookable for general tourism",
  "informal-pa": "Informal protected area",
  "sparse-documentation": "Remote, thinly documented",
  "restricted-marine-zone": "Restricted marine access zone",
};

// Bigger and more visually distinct than FreshnessBadge on purpose — this is a structural
// fact (jurisdiction, authority, or access status) a visitor needs before they plan around
// anything else on the page, not a small caption. access-restricted gets a warning
// treatment; the other three "jurisdiction is just complicated" kinds get an informational one.
export function StructuralRiskNotice({ risk }: { risk: StructuralRisk }) {
  const isWarning = risk.kind === "access-restricted";
  return (
    <section
      className={
        "rounded-sm border-2 p-5 " +
        (isWarning
          ? "border-clay bg-clay/10 dark:border-clay dark:bg-clay/15"
          : "border-river/30 bg-river/5 dark:border-sky-300/25 dark:bg-river/10")
      }
    >
      <div className="flex items-start gap-3">
        {isWarning ? (
          <AlertTriangle size={24} className="mt-0.5 shrink-0 text-clay" />
        ) : (
          <Landmark size={22} className="mt-0.5 shrink-0 text-river dark:text-sky-300" />
        )}
        <div>
          <p className={"font-mono text-xs font-bold uppercase tracking-wide " + (isWarning ? "text-clay" : "text-river dark:text-sky-300")}>
            {kindLabel[risk.kind]}
          </p>
          <p className="mt-1.5 text-base font-semibold text-forest-900">{risk.summary}</p>
          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">{risk.detail}</p>
          {risk.sourceName && (
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
              Source: {risk.sourceUrl ? <a href={risk.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700 dark:hover:text-slate-200">{risk.sourceName}</a> : risk.sourceName}
            </p>
          )}
          <Link href="/data-sources#structural-risks" className="mt-2 inline-block text-xs font-semibold text-river hover:underline dark:text-sky-300">
            What does this mean? →
          </Link>
        </div>
      </div>
    </section>
  );
}
