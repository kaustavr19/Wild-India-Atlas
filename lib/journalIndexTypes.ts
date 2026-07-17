export type JournalIndexRecord = {
  kind: "hotspot" | "flagship-species" | "extended-species";
  title: string;
  subtitle: string;
  meta: string;
  category: string;
  href: string;
  mapHref: string;
  trailDetail: string;
  nextHref: string;
  nextLabel: string;
  photoUrl?: string;
};

export type JournalIndex = Record<string, JournalIndexRecord>;
