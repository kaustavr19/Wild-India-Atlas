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
// Phase 10 closed most of the remaining gap. Still deliberately unmapped, all reviewed again
// against this same bar with no better data available: desert-national-park and
// manas-national-park (candidates unchanged — still Australia/Zimbabwe parks with the same
// name), gir-national-park and kuno-national-park (every candidate is an unrelated
// international place that merely starts with the same letters — Girne/Giresun/Giro/etc. for
// "Gir", Kunohe/Kunoy/Kunovice for "Kuno" — none are in India at all), and
// thattekad-bird-sanctuary (still just the same ambiguous forest-division record).
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

  // Confirmed in Phase 10, from data/inaturalist-candidates.json's existing candidate lists.
  "hemis-national-park": { method: "place", placeId: 69395, placeName: "Hemis", verifiedBy: "manual" },
  "panna-national-park": { method: "place", placeId: 69640, placeName: "Panna", verifiedBy: "manual" },
  "periyar-tiger-reserve": { method: "place", placeId: 190814, placeName: "Periyar Tiger Reserve", verifiedBy: "manual" },
  "silent-valley-national-park": { method: "place", placeId: 199131, placeName: "Silent Valley NP", verifiedBy: "manual" },
  "valley-of-flowers": { method: "place", placeId: 69580, placeName: "Valley Of Flowers", verifiedBy: "manual" },

  // Radius fallbacks (Phase 10) — no iNaturalist Place polygon exists for these at all, so a
  // point+radius search around the hotspot's own coordinates substitutes for one. Radius is
  // chosen per park from its known real extent, not a single blanket number.
  "chilika-lake": {
    method: "radius", lat: 19.72, lng: 85.32, radiusKm: 20, verifiedBy: "manual",
    note: "No iNaturalist Place found for Chilika Lake. Radius fallback around the hotspot's coordinates — 20km reflects the lake's real size (India's largest brackish lagoon, ~1,100 km2), larger than the default since a tighter radius would miss much of the actual lagoon.",
  },
  "little-rann-of-kutch": {
    method: "radius", lat: 23.45, lng: 71.2, radiusKm: 25, verifiedBy: "manual",
    note: "No iNaturalist Place found for Little Rann of Kutch. Radius fallback around the hotspot's coordinates — 25km is larger than the default given the sanctuary's genuinely vast real extent (~4,950 km2), but deliberately capped well below a radius that would try to cover the whole sanctuary, to avoid pulling in species records from well outside it.",
  },
  "melghat-tiger-reserve": {
    method: "radius", lat: 21.33, lng: 77.2, radiusKm: 20, verifiedBy: "manual",
    note: "No iNaturalist Place found for Melghat Tiger Reserve. Radius fallback around the hotspot's coordinates — 20km reflects the reserve's above-average size (~2,000+ km2 core and buffer across the Satpura hills).",
  },
  "sariska-tiger-reserve": {
    method: "radius", lat: 27.32, lng: 76.44, radiusKm: 15, verifiedBy: "manual",
    note: "No iNaturalist Place found for Sariska Tiger Reserve. Radius fallback around the hotspot's coordinates — 15km (the default) fits its moderate core size (~880 km2).",
  },
  "tadoba-andhari-tiger-reserve": {
    method: "radius", lat: 20.22, lng: 79.33, radiusKm: 15, verifiedBy: "manual",
    note: "No iNaturalist Place found for Tadoba Andhari Tiger Reserve. Radius fallback around the hotspot's coordinates — 15km (the default) fits its core zone size (~625 km2).",
  },
};
