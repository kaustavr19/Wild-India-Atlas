"use client";

import { useEffect } from "react";
import type { JourneyEntryType } from "@/lib/journey";
import { useJourney } from "./JourneyProvider";

export function JourneyTracker({ type, slug }: { type: JourneyEntryType; slug: string }) {
  const { recordVisit } = useJourney();
  useEffect(() => { recordVisit(type, slug); }, [recordVisit, slug, type]);
  return null;
}
