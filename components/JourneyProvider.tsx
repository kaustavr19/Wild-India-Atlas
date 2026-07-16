"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { addJourneyVisit, isJourneyEntry, type JourneyEntry, type JourneyEntryType } from "@/lib/journey";

const JOURNEY_KEY = "wia-expedition-trail-v1";

type JourneyContextValue = {
  entries: JourneyEntry[];
  hydrated: boolean;
  recordVisit: (type: JourneyEntryType, slug: string) => void;
  clearJourney: () => void;
};

const JourneyContext = createContext<JourneyContextValue | null>(null);

function persist(entries: JourneyEntry[]) {
  try { localStorage.setItem(JOURNEY_KEY, JSON.stringify(entries)); } catch {}
}

export function JourneyProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JourneyEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(JOURNEY_KEY) ?? "[]") as unknown;
      if (Array.isArray(parsed)) setEntries(parsed.filter(isJourneyEntry).slice(0, 8));
    } catch {}
    setHydrated(true);
  }, []);

  const recordVisit = useCallback((type: JourneyEntryType, slug: string) => setEntries((current) => {
      const next = addJourneyVisit(current, type, slug);
      persist(next);
      return next;
    }), []);
  const clearJourney = useCallback(() => { setEntries([]); persist([]); }, []);

  const value = useMemo<JourneyContextValue>(() => ({ entries, hydrated, recordVisit, clearJourney }), [clearJourney, entries, hydrated, recordVisit]);

  return <JourneyContext.Provider value={value}>{children}</JourneyContext.Provider>;
}

export function useJourney() {
  const value = useContext(JourneyContext);
  if (!value) throw new Error("useJourney must be used inside JourneyProvider");
  return value;
}
