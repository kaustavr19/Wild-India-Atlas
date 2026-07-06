import type { ClosureInfo } from "@/data/closures";

const confidenceDot: Record<ClosureInfo["confidence"], string> = {
  official: "bg-forest-700 dark:bg-forest-400",
  inferred: "bg-amberfield",
  unconfirmed: "bg-slate-400 dark:bg-slate-500",
};

const confidenceLabel: Record<ClosureInfo["confidence"], string> = {
  official: "Official source",
  inferred: "Inferred from general reporting",
  unconfirmed: "Unconfirmed — no official notice found",
};

function formatVerifiedDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function FreshnessBadge({ closure }: { closure: ClosureInfo }) {
  const title = confidenceLabel[closure.confidence] + (closure.sourceName ? " — " + closure.sourceName : "");
  return (
    <span title={title} className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
      <span className={"h-1.5 w-1.5 shrink-0 rounded-full " + confidenceDot[closure.confidence]} />
      Verified {formatVerifiedDate(closure.lastVerified)}
      {closure.sourceName && <>&nbsp;·&nbsp;{closure.sourceName}</>}
    </span>
  );
}
