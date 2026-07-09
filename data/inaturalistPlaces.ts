export type INaturalistMapping =
  | { method: "place"; placeId: number; placeName: string; verifiedBy: "manual" }
  | { method: "radius"; lat: number; lng: number; radiusKm: number; verifiedBy: "manual"; note?: string };

// Confirmed hotspot-slug -> iNaturalist mapping, one entry per data/hotspots.ts slug that has
// been manually confirmed. Populated by hand after reviewing data/inaturalist-candidates.json
// (produced by `npm run find:inaturalist-places`) — same conservative bar as
// data/ebirdHotspots.ts: only unambiguous single-candidate matches are filled in here, and
// "single candidate" alone was NOT enough to qualify — three single-candidate results were
// deliberately left out because the match itself was wrong or unclear on closer look:
// manas-national-park (the only candidate was Zimbabwe's Mana Pools National Park, a
// different park on a different continent), desert-national-park (the only candidate was
// Australia's Little Desert National Park), and thattekad-bird-sanctuary (the only candidate
// was a "Forest division" administrative area, not clearly the sanctuary's own boundary).
//
// A "radius" fallback is never auto-picked by the discovery script — whether a point+radius
// search is an acceptable substitute for a real place boundary is a per-park judgment call.
export const inaturalistPlaces: Record<string, INaturalistMapping> = {
  "jim-corbett-national-park": { method: "place", placeId: 233242, placeName: "Jim Corbett National Park", verifiedBy: "manual" },
  "ranthambore-national-park": { method: "place", placeId: 69203, placeName: "Ranthambore", verifiedBy: "manual" },
  "bandhavgarh-tiger-reserve": { method: "place", placeId: 186934, placeName: "Bandhavgarh National Park", verifiedBy: "manual" },
  "kanha-national-park": { method: "place", placeId: 186936, placeName: "Kanha National Park", verifiedBy: "manual" },
  "pench-national-park": { method: "place", placeId: 186937, placeName: "Pench National Park", verifiedBy: "manual" },
  "kaziranga-national-park": { method: "place", placeId: 68897, placeName: "Kaziranga", verifiedBy: "manual" },
  "sundarbans-national-park": { method: "place", placeId: 227699, placeName: "Sundarbans National Park", verifiedBy: "manual" },
  "keoladeo-ghana-bharatpur": { method: "place", placeId: 69206, placeName: "Keoladeo Ghana", verifiedBy: "manual" },
  "nagarhole-kabini": { method: "place", placeId: 9639, placeName: "Nagarhole National Park", verifiedBy: "manual" },
  "great-himalayan-national-park": { method: "place", placeId: 69577, placeName: "Great Himalayan", verifiedBy: "manual" },
  "dudhwa-national-park": { method: "place", placeId: 68896, placeName: "Dudhwa", verifiedBy: "manual" },
  "satpura-tiger-reserve": { method: "place", placeId: 69588, placeName: "Satpura National Park", verifiedBy: "manual" },
  "eravikulam-national-park": { method: "place", placeId: 68903, placeName: "Eravikulam", verifiedBy: "manual" },
  "singalila-national-park": { method: "place", placeId: 69775, placeName: "Singalila", verifiedBy: "manual" },
  "bandipur-national-park": { method: "place", placeId: 69355, placeName: "Bandipur", verifiedBy: "manual" },
  "mudumalai-national-park": { method: "place", placeId: 70349, placeName: "Mudumalai", verifiedBy: "manual" },
  "biligiri-rangaswamy-temple-tiger-reserve": { method: "place", placeId: 142643, placeName: "Biligiri Rangaswamy Temple Tiger Reserve", verifiedBy: "manual" },
  "rajaji-national-park": { method: "place", placeId: 69738, placeName: "Rajaji", verifiedBy: "manual" },
  "simlipal-national-park": { method: "place", placeId: 69202, placeName: "Simlipal", verifiedBy: "manual" },
  "valmiki-tiger-reserve": { method: "place", placeId: 70344, placeName: "Valmiki", verifiedBy: "manual" },
  "indravati-national-park": { method: "place", placeId: 69589, placeName: "Indravati", verifiedBy: "manual" },
  "namdapha-national-park": { method: "place", placeId: 69391, placeName: "Namdapha", verifiedBy: "manual" },
  "keibul-lamjao-national-park": { method: "place", placeId: 69398, placeName: "Keibul-Lamjao", verifiedBy: "manual" },
};
