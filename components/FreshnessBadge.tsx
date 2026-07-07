"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { Info } from "lucide-react";
import type { ClosureInfo } from "@/data/closures";

export const confidenceDotClass: Record<ClosureInfo["confidence"], string> = {
  official: "bg-forest-700 dark:bg-forest-400",
  inferred: "bg-amberfield",
  unconfirmed: "bg-slate-400 dark:bg-slate-500",
};

// Lighter variant for use on cards with a permanently-dark image backdrop (e.g. map
// preview cards), which aren't affected by the site's light/dark mode toggle.
const confidenceDotClassOnDark: Record<ClosureInfo["confidence"], string> = {
  official: "bg-forest-300",
  inferred: "bg-amberfield",
  unconfirmed: "bg-slate-300",
};

export const confidenceLabel: Record<ClosureInfo["confidence"], string> = {
  official: "Official source",
  inferred: "Inferred from general reporting",
  unconfirmed: "Unconfirmed — no official notice found",
};

export function formatVerifiedDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// Bare confidence dot for use on cards/list views — no text, just a tiny signal that a
// hotspot's closure fact carries a known confidence tier. Non-interactive (title tooltip
// only); the full explanation lives in FreshnessBadge on the detail page.
export function ConfidenceDot({ confidence, className, onDark }: { confidence: ClosureInfo["confidence"]; className?: string; onDark?: boolean }) {
  return (
    <span
      title={confidenceLabel[confidence]}
      className={"inline-block h-1.5 w-1.5 shrink-0 rounded-full " + (onDark ? confidenceDotClassOnDark[confidence] : confidenceDotClass[confidence]) + (className ? " " + className : "")}
    />
  );
}

export function FreshnessBadge({ closure }: { closure: ClosureInfo }) {
  const [open, setOpen] = useState(false);
  const popoverId = useId();

  return (
    <div
      className="relative mt-1 inline-block"
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}
    >
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls={popoverId}
        className="inline-flex items-center gap-1.5 rounded-sm text-xs text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
      >
        <ConfidenceDot confidence={closure.confidence} />
        Verified {formatVerifiedDate(closure.lastVerified)}
        {closure.sourceName && <>&nbsp;·&nbsp;{closure.sourceName}</>}
        <Info size={12} className="shrink-0 opacity-60" />
      </button>
      {open && (
        <div
          id={popoverId}
          className="absolute left-0 top-full z-10 mt-2 w-64 rounded-sm border border-forest-700/15 bg-white p-3 text-xs leading-5 text-slate-700 shadow-field dark:border-white/10 dark:bg-forest-900 dark:text-slate-300"
        >
          <p className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <ConfidenceDot confidence={closure.confidence} />
            {confidenceLabel[closure.confidence]}
          </p>
          {closure.sourceName && <p className="mt-1.5">Source: {closure.sourceName}</p>}
          <p className="mt-1.5">
            Verified {formatVerifiedDate(closure.lastVerified)} — this is when the note was last checked, not necessarily when the underlying policy last changed.
          </p>
          <Link href="/data-sources" className="mt-2 inline-block font-semibold text-river hover:underline dark:text-sky-300">
            What does this mean? →
          </Link>
        </div>
      )}
    </div>
  );
}
