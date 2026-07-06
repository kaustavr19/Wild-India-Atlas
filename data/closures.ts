export type ClosureInfo = {
  closesSeasonally: boolean;
  note: string;
  sourceUrl?: string;
  sourceName?: string;
  lastVerified: string;
  confidence: "official" | "inferred" | "unconfirmed";
};

// Individually researched per park (state forest department notices, official park
// portals, and established travel-industry reporting where no government page states
// it directly) — not a blanket rule applied to every "Tiger Reserve" type. Exact dates
// are set annually by each state forest department and can shift by a week or two;
// treat these as a real planning signal, not a fixed calendar. Omitted only if truly
// no information could be found (none currently — every hotspot has a researched entry).
//
// `confidence` reflects how the underlying note was sourced: "official" when a named
// department/notification/authority backs it, "unconfirmed" when the note itself hedges
// (e.g. "no formal closure notice"), and "inferred" for confidently-stated general
// patterns with no named authority. `sourceUrl` is left undefined everywhere in this
// pass — it is never fabricated, only added once a specific citable page is verified.
export const closureInfo: Record<string, ClosureInfo> = {
  "jim-corbett-national-park": { closesSeasonally: true, note: "Most zones close mid-June to mid-November for monsoon (core tourist season is 15 Nov–15 Jun); Jhirna and Dhela zones stay open year-round.", lastVerified: "2026-07-06", confidence: "inferred" },
  "ranthambore-national-park": { closesSeasonally: true, note: "Core Zones 1–5 close 1 Jul–30 Sep for monsoon per Rajasthan Forest Department order; Zones 6–10 remain open.", sourceName: "Rajasthan Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "bandhavgarh-tiger-reserve": { closesSeasonally: true, note: "Core zone closes 1 Jul–30 Sep for monsoon; the Panpatha, Johila, and Dhamokhar buffer zones stay open year-round.", lastVerified: "2026-07-06", confidence: "inferred" },
  "kanha-national-park": { closesSeasonally: true, note: "Core zone closes for monsoon roughly July through September (park's official season is 1 Oct–30 Jun); some buffer zones continue safaris.", lastVerified: "2026-07-06", confidence: "inferred" },
  "tadoba-andhari-tiger-reserve": { closesSeasonally: true, note: "Core zone closes 30 Jun–30 Sep for monsoon per Maharashtra Forest Department order; buffer gates (e.g. Agarzari, Devada, Junona) generally stay open.", sourceName: "Maharashtra Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "pench-national-park": { closesSeasonally: true, note: "Core zone closes 1 Jul–14/15 Oct for monsoon (official season is 16 Oct–30 Jun).", lastVerified: "2026-07-06", confidence: "inferred" },
  "kaziranga-national-park": { closesSeasonally: true, note: "Closes in anticipation of monsoon flooding around early-to-mid May and reopens 1 Oct; reopening can be delayed and zone access limited in years with severe flood damage.", lastVerified: "2026-07-06", confidence: "inferred" },
  "manas-national-park": { closesSeasonally: true, note: "Closes late June (recently 25 Jun) for monsoon flooding of the Beki River and reopens late September, per NTCA/Assam Forest Department notification; also closed to visitors on Wednesdays in season.", sourceName: "NTCA / Assam Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "sundarbans-national-park": { closesSeasonally: false, note: "No formal closure — boat safaris run year-round, but river levels rise and conditions turn genuinely risky from July to September, so a monsoon visit is strongly discouraged rather than officially barred.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "keoladeo-ghana-bharatpur": { closesSeasonally: false, note: "Open year-round with no formal closure — paths can get slippery in the monsoon, but this is a walking/cycling reserve, not a vehicle-safari zone, so it isn't subject to the tiger-reserve-style closure rule.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "chambal-river-sanctuary": { closesSeasonally: true, note: "Boat safaris pause roughly July–September while the Chambal runs high and fast; the river safari season officially runs October to June.", lastVerified: "2026-07-06", confidence: "inferred" },
  "little-rann-of-kutch": { closesSeasonally: true, note: "Closed 15 Jun–15 Oct — monsoon floods the Rann and the elevated \"bets\" become temporary islands, making safari tracks impassable.", lastVerified: "2026-07-06", confidence: "inferred" },
  "gir-national-park": { closesSeasonally: true, note: "Closed 16 Jun–15 Oct annually for monsoon, per Gujarat Forest Department notification.", sourceName: "Gujarat Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "hemis-national-park": { closesSeasonally: false, note: "No formal closure — winter (Dec–Mar) is actually peak snow-leopard-tracking season despite heavy snow; road access above Leh can still be weather-dependent, so confirm conditions before travelling.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "periyar-tiger-reserve": { closesSeasonally: false, note: "Stays open year-round, unlike most Indian tiger reserves — boat cruises may pause temporarily during the heaviest monsoon downpours, but there's no seasonal park closure.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "nagarhole-kabini": { closesSeasonally: false, note: "Stays open year-round — unlike Central India's Kanha/Corbett/Ranthambore-style reserves, Kabini/Nagarhole runs safaris through the monsoon, though individual drives may be cancelled for heavy rain.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "thattekad-bird-sanctuary": { closesSeasonally: false, note: "No formal closure, but the reserve becomes genuinely hard to access and birding conditions are poor during the Jun–Sep monsoon.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "mangalajodi-wetlands": { closesSeasonally: false, note: "Open year-round — boat access can be affected by monsoon rain, but there's no formal seasonal closure.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "chilika-lake": { closesSeasonally: false, note: "Open year-round — boat rides are frequently cancelled for heavy rain during July–September, but the lake itself has no formal closure.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "great-himalayan-national-park": { closesSeasonally: false, note: "No single formal closure — monsoon (Jul–early Sep) brings landslide risk on trails, and higher-altitude routes become snowbound and impassable Dec–Feb; access is genuinely weather-dependent both seasons.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "desert-national-park": { closesSeasonally: false, note: "No confirmed core-zone closure — the park is officially accessible year-round, though monsoon rain (Jul–Sep) is a poor time to visit and can limit access to low-lying tracks.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "valley-of-flowers": { closesSeasonally: true, note: "Only open 1 Jun to early October each year (exact dates set annually by the Uttarakhand Forest Department); closed the rest of the year due to Himalayan snow.", sourceName: "Uttarakhand Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "dudhwa-national-park": { closesSeasonally: true, note: "Closed 16 Jun–14 Nov annually for monsoon (official season is 15 Nov–15 Jun), per Uttar Pradesh Forest Department.", sourceName: "Uttar Pradesh Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "satpura-tiger-reserve": { closesSeasonally: true, note: "Core zone closes 1 Jul–30 Sep for monsoon (official season is 16 Oct–30 Jun); buffer zones stay open and are considered especially scenic in monsoon.", lastVerified: "2026-07-06", confidence: "inferred" },
  "eravikulam-national-park": { closesSeasonally: true, note: "Closed to visitors February–March annually for Nilgiri Tahr calving season.", lastVerified: "2026-07-06", confidence: "inferred" },
  "singalila-national-park": { closesSeasonally: true, note: "Closed 16 Jun–15 Sep annually for monsoon, to protect red pandas and other wildlife during their breeding season and because trekking trails become unsafe.", lastVerified: "2026-07-06", confidence: "inferred" },
  "rushikulya-rookery": { closesSeasonally: false, note: "No formal closure — the beach is accessible year-round, but there's genuinely nothing to see outside the Feb–Mar Olive Ridley nesting window, so a visit at any other time isn't worthwhile.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "gahirmatha-marine-sanctuary": { closesSeasonally: true, note: "Closed annually roughly May–July; the core nesting beach itself is permanently off-limits to general tourists year-round, not just seasonally.", lastVerified: "2026-07-06", confidence: "inferred" },
  "bandipur-national-park": { closesSeasonally: true, note: "Closes to tourists roughly June–September for monsoon, per Karnataka Forest Department practice.", sourceName: "Karnataka Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "mudumalai-national-park": { closesSeasonally: true, note: "Closes to tourists roughly June–September for monsoon, per Tamil Nadu Forest Department practice.", sourceName: "Tamil Nadu Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "biligiri-rangaswamy-temple-tiger-reserve": { closesSeasonally: true, note: "Safaris are frequently restricted or suspended during the June–September monsoon due to slippery terrain; confirm current status with Jungle Lodges & Resorts before booking.", lastVerified: "2026-07-06", confidence: "inferred" },
  "sariska-tiger-reserve": { closesSeasonally: true, note: "Core Zones 1–3 close 1 Jul–30 Sep for monsoon per Rajasthan Forest Department order; the Alwar buffer zone stays open.", sourceName: "Rajasthan Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "panna-national-park": { closesSeasonally: true, note: "Core zone (Madla & Hinauta) closes 1 Jul–30 Sep for monsoon; buffer zones including Jhinna often stay open.", lastVerified: "2026-07-06", confidence: "inferred" },
  "kuno-national-park": { closesSeasonally: true, note: "Closed 1 Jul–30 Sep for monsoon, which also overlaps with the cheetahs' mating season.", lastVerified: "2026-07-06", confidence: "inferred" },
  "rajaji-national-park": { closesSeasonally: true, note: "Closed 15 Jun–14 Nov annually for monsoon; the Jhilmil Jheel wetland zone has an extended season and stays open until 30 Jun.", lastVerified: "2026-07-06", confidence: "inferred" },
  "melghat-tiger-reserve": { closesSeasonally: true, note: "Closed to visitors during the core monsoon months (Jul–Sep) for wildlife breeding season and unsafe forest tracks; reopens in October.", lastVerified: "2026-07-06", confidence: "inferred" },
  "simlipal-national-park": { closesSeasonally: true, note: "Closed roughly mid-June through October for monsoon (general season is 1 Nov–15 Jun); exact reopening is announced each year by the Field Director once road conditions allow.", sourceName: "Similipal Tiger Reserve (Field Director)", lastVerified: "2026-07-06", confidence: "official" },
  "valmiki-tiger-reserve": { closesSeasonally: true, note: "Closed 1 Jul–30 Sep annually for monsoon, per National Tiger Conservation Authority and Bihar Forest Department guidelines — all jungle, cycle, and Gandak boat safaris pause.", sourceName: "National Tiger Conservation Authority / Bihar Forest Department", lastVerified: "2026-07-06", confidence: "official" },
  "indravati-national-park": { closesSeasonally: false, note: "No seasonal monsoon closure notice — the real constraint is an ongoing security-driven access restriction in this Naxal-affected part of Bastar, not weather; core-zone access is limited year-round regardless of season.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "namdapha-national-park": { closesSeasonally: false, note: "No formal closure — open year-round, but the Jun–Sep monsoon brings heavy rainfall and landslide risk that can cut off parts of the park.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "keibul-lamjao-national-park": { closesSeasonally: false, note: "Open year-round with no formal closure, though the Nov–Feb winter window is when Sangai deer are easiest to see.", lastVerified: "2026-07-06", confidence: "unconfirmed" },
  "silent-valley-national-park": { closesSeasonally: true, note: "Closed to general visitors during peak monsoon (roughly Jun–Nov) and again in the Mar–May fire-risk season per Kerala Forest Department restrictions — confirm the current advisory before booking.", sourceName: "Kerala Forest Department", lastVerified: "2026-07-06", confidence: "official" },
};
