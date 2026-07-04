export type Ecosystem = "forest" | "wetland" | "desert" | "alpine" | "mangrove" | "marine";

// Manually classified from each hotspot's existing `habitat` text in hotspots.ts
// (not derived from `type`, which doesn't reliably match real ecosystem — e.g.
// Kaziranga is "National Park" type but is floodplain/wetland grassland).
export const ecosystem: Record<string, Ecosystem> = {
  "jim-corbett-national-park": "forest",
  "ranthambore-national-park": "forest",
  "bandhavgarh-tiger-reserve": "forest",
  "kanha-national-park": "forest",
  "tadoba-andhari-tiger-reserve": "forest",
  "pench-national-park": "forest",
  "kaziranga-national-park": "wetland",
  "manas-national-park": "forest",
  "sundarbans-national-park": "mangrove",
  "keoladeo-ghana-bharatpur": "wetland",
  "chambal-river-sanctuary": "wetland",
  "little-rann-of-kutch": "desert",
  "gir-national-park": "forest",
  "hemis-national-park": "alpine",
  "periyar-tiger-reserve": "forest",
  "nagarhole-kabini": "forest",
  "thattekad-bird-sanctuary": "forest",
  "mangalajodi-wetlands": "wetland",
  "chilika-lake": "wetland",
  "great-himalayan-national-park": "alpine",
  "desert-national-park": "desert",
  "valley-of-flowers": "alpine",
  "dudhwa-national-park": "forest",
  "satpura-tiger-reserve": "forest",
};

// Shared display colors so the map and detail pages read the same ecosystem the same way.
export const ecosystemColorClass: Record<Ecosystem,string> = { forest:"bg-forest-700", wetland:"bg-river", desert:"bg-amberfield", alpine:"bg-slate-600", mangrove:"bg-emerald-800", marine:"bg-cyan-500" };
export const ecosystemColorHex: Record<Ecosystem,string> = { forest:"#24563a", wetland:"#2f7da1", desert:"#d98c2b", alpine:"#475569", mangrove:"#065f46", marine:"#06b6d4" };

