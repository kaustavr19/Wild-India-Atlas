export type AtlasSearchItem = {
  id: string;
  title: string;
  subtitle: string;
  keywords: string;
  href: string;
  kind: "Species" | "Place";
};

export function searchAtlas(items: AtlasSearchItem[], query: string, limit = 6): AtlasSearchItem[] {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return [];

  return items
    .map((item) => {
      const title = item.title.toLocaleLowerCase();
      const subtitle = item.subtitle.toLocaleLowerCase();
      const keywords = item.keywords.toLocaleLowerCase();
      const score = title === needle ? 0 : title.startsWith(needle) ? 1 : title.includes(needle) ? 2 : subtitle.includes(needle) ? 3 : keywords.includes(needle) ? 4 : -1;
      return { item, score };
    })
    .filter((match) => match.score >= 0)
    .sort((a, b) => a.score - b.score || (a.item.kind === b.item.kind ? 0 : a.item.kind === "Species" ? -1 : 1) || a.item.title.localeCompare(b.item.title))
    .slice(0, limit)
    .map((match) => match.item);
}
