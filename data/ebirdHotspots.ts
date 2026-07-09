export type EbirdMapping = { locId: string; locName: string; verifiedBy: "manual"; note?: string };

// Confirmed hotspot-slug -> eBird hotspot mappings, one entry per data/hotspots.ts slug that
// has been manually confirmed. Populated by hand after reviewing data/ebird-candidates.json
// (produced by `npm run find:ebird-hotspots`) — proximity alone doesn't prove an eBird hotspot
// sits inside a park's real boundary, so nothing is auto-selected into this file. Left empty
// until a human has actually looked at the candidates and picked the right one.
//
// 6 of the 42 parks are deliberately NOT mapped here because no candidate confidently
// represented the park itself (either 0 results, or every candidate was a differently-named
// nearby place rather than the park): chambal-river-sanctuary, hemis-national-park,
// kuno-national-park, rushikulya-rookery, gahirmatha-marine-sanctuary, indravati-national-park.
export const ebirdHotspots: Record<string, EbirdMapping> = {
  "jim-corbett-national-park": { locId: "L29265159", locName: "Jim Corbett Tiger Reserve", verifiedBy: "manual" },
  "ranthambore-national-park": { locId: "L946220", locName: "Ranthambore NP", verifiedBy: "manual" },
  "bandhavgarh-tiger-reserve": { locId: "L2455819", locName: "Bandhavgarh NP", verifiedBy: "manual" },
  "kanha-national-park": { locId: "L1016606", locName: "Kanha Tiger Reserve", verifiedBy: "manual" },
  "tadoba-andhari-tiger-reserve": {
    locId: "L10739849",
    locName: "Tadoba Andhari Tiger Reserve--Moharli Gate",
    verifiedBy: "manual",
    note: "No park-wide hotspot exists; Moharli is the main entrance gate and has the richest checklist of the gate/lake sub-locations.",
  },
  "pench-national-park": { locId: "L3160868", locName: "Pench National Park, Maharashtra", verifiedBy: "manual" },
  "kaziranga-national-park": {
    locId: "L4081617",
    locName: "Kaziranga NP & Surroundings--Burapahar Range (Ghorakati)",
    verifiedBy: "manual",
    note: "No park-wide hotspot exists; Burapahar Range has the richest checklist among the range-specific sub-locations.",
  },
  "manas-national-park": { locId: "L2678036", locName: "Manas NP--General Area", verifiedBy: "manual" },
  "sundarbans-national-park": { locId: "L3915579", locName: "Sundarban Tiger Reserve--General Area", verifiedBy: "manual" },
  "keoladeo-ghana-bharatpur": { locId: "L946706", locName: "Bharatpur--Keoladeo Ghana NP", verifiedBy: "manual" },
  "little-rann-of-kutch": { locId: "L4084081", locName: "Little Rann of Kachchh", verifiedBy: "manual" },
  "gir-national-park": {
    locId: "L967212",
    locName: "Gir Wildlife Sanctuary--General",
    verifiedBy: "manual",
    note: "Gir NP sits inside the larger Gir Wildlife Sanctuary; this general-area hotspot has far richer data than the NP-specific point.",
  },
  "periyar-tiger-reserve": { locId: "L3120198", locName: "Periyar Tiger Reserve--Thannikkudy", verifiedBy: "manual" },
  "nagarhole-kabini": { locId: "L2612302", locName: "Nagarahole NP--General Area", verifiedBy: "manual" },
  "thattekad-bird-sanctuary": { locId: "L3789514", locName: "Thattekkad Bird Sanctuary--General Area", verifiedBy: "manual" },
  "mangalajodi-wetlands": { locId: "L8224034", locName: "Manglajodi Eco Tourism", verifiedBy: "manual" },
  "chilika-lake": { locId: "L2527665", locName: "Chilika Lake", verifiedBy: "manual" },
  "great-himalayan-national-park": { locId: "L5844598", locName: "Great Himalayan NP--Dengha Pool", verifiedBy: "manual" },
  "desert-national-park": { locId: "L2585018", locName: "Desert NP--Sam Sand Dunes", verifiedBy: "manual" },
  "valley-of-flowers": { locId: "L10787420", locName: "Valley of Flowers National Park", verifiedBy: "manual" },
  "dudhwa-national-park": { locId: "L967205", locName: "Dudhwa NP -- General Area", verifiedBy: "manual" },
  "satpura-tiger-reserve": { locId: "L14702523", locName: "Satpura Tiger Reserve--Overall", verifiedBy: "manual" },
  "eravikulam-national-park": { locId: "L2817093", locName: "Eravikulam NP -- Eravikulam Hut", verifiedBy: "manual" },
  "singalila-national-park": { locId: "L3231405", locName: "Singalila NP--General Area DG", verifiedBy: "manual" },
  "bandipur-national-park": { locId: "L2386799", locName: "Bandipur NP--Forest Headquarters", verifiedBy: "manual" },
  "mudumalai-national-park": { locId: "L932559", locName: "Mudumalai NP", verifiedBy: "manual" },
  "biligiri-rangaswamy-temple-tiger-reserve": {
    locId: "L2570313",
    locName: "BR Hills--KGudi",
    verifiedBy: "manual",
    note: "No hotspot uses the reserve's full name; \"BR Hills\" is the park's common short name and this has the richest checklist nearby.",
  },
  "sariska-tiger-reserve": { locId: "L921959", locName: "Sariska Tiger Reserve", verifiedBy: "manual" },
  "panna-national-park": {
    locId: "L14765178",
    locName: "Panna (OBI)",
    verifiedBy: "manual",
    note: "The other nearby candidates are small named talabs (ponds), not the park itself; this is the closest genuinely park-referencing hotspot.",
  },
  "rajaji-national-park": {
    locId: "L2629817",
    locName: "Chilla-Rishikesh Canal Road",
    verifiedBy: "manual",
    note: "No hotspot is named for the park itself; Chilla is a known Rajaji NP range, unlike the other Rishikesh-town candidates.",
  },
  "melghat-tiger-reserve": { locId: "L967207", locName: "Melghat Tiger Reserve", verifiedBy: "manual" },
  "simlipal-national-park": { locId: "L7899045", locName: "Simlipal National Park", verifiedBy: "manual" },
  "valmiki-tiger-reserve": { locId: "L4100972", locName: "Valmiki Tiger Reserve--General Area", verifiedBy: "manual" },
  "namdapha-national-park": { locId: "L4696975", locName: "Namdapha NP & Surroundings--Deban", verifiedBy: "manual" },
  "keibul-lamjao-national-park": { locId: "L17976656", locName: "Keibul Lamjao National Park", verifiedBy: "manual" },
  "silent-valley-national-park": { locId: "L2504933", locName: "Silent Valley National Park--General Area", verifiedBy: "manual" },
};
