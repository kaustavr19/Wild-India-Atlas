# Version history

**v1.4 — Provenance and freshness for closure data** (current)
- `ClosureInfo` (`data/closures.ts`) now carries machine-readable provenance alongside each of the 42 researched closure facts: `sourceName` (the named department/authority, where the existing note already cited one — never invented), `lastVerified` (an ISO date), and a `confidence` rating (`official` / `inferred` / `unconfirmed`) derived from how firmly each note was already sourced
- `sourceUrl` is part of the type but intentionally left unset for this pass — no URL is fabricated; it's only filled in once a specific citable page has been verified
- New `<FreshnessBadge>` component renders a compact confidence-colored dot + "Verified {month year}" + source name (as a tooltip and secondary text) next to the closure note on hotspot detail pages, so a visitor can see at a glance how solid a given closure claim is
- No closure facts (`closesSeasonally`/`note`) were changed in this pass — this is a schema and UI layer on top of the existing v1.3 research, not new content

**v1.3 — Planning-oriented species guide + hotspot detail pages**
- New Species Guide (`/species`, `/species/[slug]`) covering 21 species with real, attributed Wikimedia Commons photography — where to actually see each species (derived live from hotspots' real species lists, not a hand-maintained list — this caught and fixed several factually wrong entries, e.g. Snow Leopard previously pointed at three central-India tiger forests instead of Hemis), best months, sighting difficulty, habitat, ethical viewing notes, photography tips, and similar-species cross-links
- 4 new hotspots added after verifying real range/species overlap first: Eravikulam National Park (Nilgiri Tahr), Singalila National Park (Red Panda), and Rushikulya + Gahirmatha (Olive Ridley Turtle nesting) — Gahirmatha's real access restrictions are prominently disclosed rather than glossed over
- 3 existing hotspots corrected with real, previously-missing species (Malabar Grey Hornbill at Thattekad, King Cobra at Sundarbans and Periyar, Lion-tailed Macaque at Periyar), found by checking official park records before assuming new hotspots were needed
- Hotspot detail pages rebuilt out to a full destination-page structure: unique SEO metadata + structured data per page (previously every page on the site shared one identical title/description), an ecosystem badge and "why go" callout in the hero, a structured experiences section, family-friendliness as an explicit fact, a season/closures block, a generic-but-personalized suggested itinerary, and a real geographic-nearest "nearby hotspots" section
- Species and hotspots now link to each other bidirectionally from their species/wildlife tags
- 14 more parks added to close the gap with a competitor audit (wildatlas.in/parks): Bandipur, Mudumalai, BRT Tiger Reserve, Sariska, Panna, Kuno, Rajaji, Melghat, Simlipal, Valmiki, Indravati, Namdapha, Keibul Lamjao, and Silent Valley — each fully sourced (real Wikimedia Commons photo, ecosystem classification, travel facts) to the same bar as the rest, bringing the atlas to 42 hotspots across 6 regions
- Added an Asiatic Cheetah species entry so Kuno's 2022 reintroduction story links properly from its hotspot page
- New "Species spotlight" section on hotspot detail pages — small clickable species cards (photo + name) for every mammal/bird with a matching species page
- Species pages' "where can I see this" hotspot cards switched to a compact style (photo, name, state only) now that the list can run to a dozen+ parks per species
- Homepage park/region counts are now computed live from the hotspot data instead of a hardcoded stat that had drifted out of date
- "Season & closures" on hotspot pages now shows a real, individually-researched closure fact per park (`data/closures.ts`) instead of the same generic per-season text for every hotspot — sourced from state forest department notices and official park portals, covering all 42 hotspots
- Backfilled `district`/Wikipedia/permit-portal links for the 14 newest hotspots to the same sourcing bar as the original 28

**v1.2 — Map as a trip-discovery engine**
- Region clustering: the map groups hotspots into clickable clusters by region at the default zoom, expanding into individual pins once you zoom into one
- Markers colored by ecosystem (forest, wetland, desert, alpine, mangrove, marine), manually classified from each hotspot's habitat description
- Multi-select map layer toggles (Mammals, Birds, Reptiles, Flora, Rare Species, Monsoon) that filter both clusters and pins
- Richer click-through preview: flagship species, difficulty, a linked permits badge, and a photography-friendly badge, alongside best months and nearest airport/railway
- Collapsible "Layers & legend" panel (collapsed by default) instead of a permanently-visible wall of chips
- Neutral state-fill color on the map so region, ecosystem, and "best this month" highlight colors no longer visually compete
- Homepage "Where to go in [month]" section: season-level field notes (best for / avoid / travel caution) alongside the existing data-driven "good bets" picks

**v1 — Prototype slice**
Initial map-first build: interactive India map with real state boundaries, 24 hotspot records with sourced photography and travel data, a filterable map/list explorer, and hotspot detail pages.
