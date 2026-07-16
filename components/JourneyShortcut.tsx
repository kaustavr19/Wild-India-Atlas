"use client";

import Link from "next/link";
import { Route } from "lucide-react";
import { useJourney } from "./JourneyProvider";

export function JourneyShortcut() {
  const { entries, hydrated } = useJourney();
  if (!hydrated || entries.length === 0) return null;

  return (
    <Link href="/field-journal#trail" aria-label={`Expedition trail, ${entries.length} recently viewed`} className="relative grid h-9 w-9 place-items-center rounded-full border border-white/15 text-biome-ink transition hover:border-biome-accent hover:text-biome-accent">
      <Route size={16} />
      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-biome-accent px-1 font-mono text-[8px] font-bold text-forest-950">{entries.length}</span>
    </Link>
  );
}
