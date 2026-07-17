"use client";

import { useEffect, useState } from "react";
import type { JournalIndex } from "@/lib/journalIndexTypes";

let cached: JournalIndex | undefined;
let pending: Promise<JournalIndex> | undefined;

function loadIndex(): Promise<JournalIndex> {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = fetch("/data/journal-index")
      .then((response) => {
        if (!response.ok) throw new Error(`Journal index request failed with ${response.status}`);
        return response.json() as Promise<JournalIndex>;
      })
      .then((index) => {
        cached = index;
        return index;
      })
      .finally(() => {
        pending = undefined;
      });
  }
  return pending;
}

export function useJournalIndex(enabled: boolean) {
  const [index, setIndex] = useState<JournalIndex | undefined>(cached);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!enabled || index) return;
    let active = true;
    loadIndex()
      .then((value) => {
        if (active) setIndex(value);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [enabled, index]);

  return {
    index,
    loading: enabled && !index && !failed,
    failed,
  };
}
