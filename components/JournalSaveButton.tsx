"use client";

import { Bookmark, BookmarkCheck } from "lucide-react";
import type { JournalEntryType } from "./JournalProvider";
import { useJournal } from "./JournalProvider";

export function JournalSaveButton({ type, slug, tone = "light", compact = false, className = "" }: {
  type: JournalEntryType;
  slug: string;
  tone?: "light" | "dark";
  compact?: boolean;
  className?: string;
}) {
  const { hydrated, isSaved, toggleSave } = useJournal();
  const saved = hydrated && isSaved(type, slug);
  const label = saved ? "Remove from field journal" : "Save to field journal";

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={saved}
      disabled={!hydrated}
      onClick={() => toggleSave(type, slug)}
      className={`${tone === "dark" ? "border-white/20 bg-black/20 text-white hover:border-sand hover:text-sand" : "border-forest-900/15 bg-paper text-forest-900 hover:border-amberfield hover:text-clay"} inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] backdrop-blur-md transition disabled:opacity-50 ${className}`}
    >
      {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
      {!compact && <span>{saved ? "Saved" : "Save"}</span>}
    </button>
  );
}
