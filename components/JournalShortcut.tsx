"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useJournal } from "./JournalProvider";

export function JournalShortcut() {
  const { entries, hydrated } = useJournal();
  return (
    <Link href="/field-journal" aria-label={`Field journal${hydrated && entries.length ? `, ${entries.length} saved` : ""}`} className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 text-biome-ink transition hover:border-biome-accent hover:text-biome-accent">
      <Bookmark size={16} />
      {hydrated && entries.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-biome-accent px-1 font-mono text-[8px] font-bold text-biome-surface">{Math.min(entries.length, 99)}</span>}
    </Link>
  );
}
