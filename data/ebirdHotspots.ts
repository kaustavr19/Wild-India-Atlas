export type EbirdMapping = { locId: string; locName: string; verifiedBy: "manual"; note?: string };

// Confirmed hotspot-slug -> eBird hotspot mappings, one entry per data/hotspots.ts slug that
// has been manually confirmed. Populated by hand after reviewing data/ebird-candidates.json
// (produced by `npm run find:ebird-hotspots`) — proximity alone doesn't prove an eBird hotspot
// sits inside a park's real boundary, so nothing is auto-selected into this file. Left empty
// until a human has actually looked at the candidates and picked the right one.
export const ebirdHotspots: Record<string, EbirdMapping> = {};
