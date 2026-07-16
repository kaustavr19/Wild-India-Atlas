"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const JOURNAL_KEY = "wia-field-journal-v1";

export type JournalEntryType = "species" | "hotspot";
export type JournalEntry = {
  id: string;
  type: JournalEntryType;
  slug: string;
  note: string;
  savedAt: string;
};

type JournalContextValue = {
  entries: JournalEntry[];
  hydrated: boolean;
  isSaved: (type: JournalEntryType, slug: string) => boolean;
  toggleSave: (type: JournalEntryType, slug: string) => void;
  saveMany: (items: Array<{ type: JournalEntryType; slug: string }>) => void;
  updateNote: (id: string, note: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const JournalContext = createContext<JournalContextValue | null>(null);

function persist(entries: JournalEntry[]) {
  try { localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries)); } catch {}
}

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem(JOURNAL_KEY) ?? "[]") as JournalEntry[];
      if (Array.isArray(parsed)) setEntries(parsed.filter((entry) => entry && typeof entry.id === "string" && (entry.type === "species" || entry.type === "hotspot")));
    } catch {}
    setHydrated(true);
  }, []);

  const value = useMemo<JournalContextValue>(() => ({
    entries,
    hydrated,
    isSaved: (type, slug) => entries.some((entry) => entry.id === `${type}:${slug}`),
    toggleSave: (type, slug) => setEntries((current) => {
      const id = `${type}:${slug}`;
      const next = current.some((entry) => entry.id === id)
        ? current.filter((entry) => entry.id !== id)
        : [{ id, type, slug, note: "", savedAt: new Date().toISOString() }, ...current];
      persist(next);
      return next;
    }),
    saveMany: (items) => setEntries((current) => {
      const existing = new Set(current.map((entry) => entry.id));
      const additions = items
        .filter((item) => !existing.has(`${item.type}:${item.slug}`))
        .map((item) => ({ id: `${item.type}:${item.slug}`, ...item, note: "", savedAt: new Date().toISOString() }));
      const next = [...additions, ...current];
      persist(next);
      return next;
    }),
    updateNote: (id, note) => setEntries((current) => {
      const next = current.map((entry) => entry.id === id ? { ...entry, note } : entry);
      persist(next);
      return next;
    }),
    remove: (id) => setEntries((current) => {
      const next = current.filter((entry) => entry.id !== id);
      persist(next);
      return next;
    }),
    clear: () => { setEntries([]); persist([]); },
  }), [entries, hydrated]);

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const value = useContext(JournalContext);
  if (!value) throw new Error("useJournal must be used inside JournalProvider");
  return value;
}
