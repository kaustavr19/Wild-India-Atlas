export const JOURNEY_LIMIT = 8;

export type JourneyEntryType = "species" | "hotspot";

export type JourneyEntry = {
  id: string;
  type: JourneyEntryType;
  slug: string;
  viewedAt: string;
};

export function addJourneyVisit(
  entries: JourneyEntry[],
  type: JourneyEntryType,
  slug: string,
  viewedAt = new Date().toISOString(),
): JourneyEntry[] {
  const id = `${type}:${slug}`;
  return [{ id, type, slug, viewedAt }, ...entries.filter((entry) => entry.id !== id)].slice(0, JOURNEY_LIMIT);
}

export function isJourneyEntry(value: unknown): value is JourneyEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Partial<JourneyEntry>;
  return typeof entry.id === "string"
    && (entry.type === "species" || entry.type === "hotspot")
    && typeof entry.slug === "string"
    && typeof entry.viewedAt === "string";
}
