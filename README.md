# Wild India Atlas

A map-first travel guide for exploring India's wildlife hotspots — tiger reserves, bird sanctuaries, wetlands, and Himalayan sanctuaries — by region, season, and species.

## Version history

**v3 — Planning-oriented species guide + hotspot detail pages** (current)
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

**v2 — Map as a trip-discovery engine**
- Region clustering: the map groups hotspots into clickable clusters by region at the default zoom, expanding into individual pins once you zoom into one
- Markers colored by ecosystem (forest, wetland, desert, alpine, mangrove, marine), manually classified from each hotspot's habitat description
- Multi-select map layer toggles (Mammals, Birds, Reptiles, Flora, Rare Species, Monsoon) that filter both clusters and pins
- Richer click-through preview: flagship species, difficulty, a linked permits badge, and a photography-friendly badge, alongside best months and nearest airport/railway
- Collapsible "Layers & legend" panel (collapsed by default) instead of a permanently-visible wall of chips
- Neutral state-fill color on the map so region, ecosystem, and "best this month" highlight colors no longer visually compete
- Homepage "Where to go in [month]" section: season-level field notes (best for / avoid / travel caution) alongside the existing data-driven "good bets" picks

**v1 — Prototype slice**
Initial map-first build: interactive India map with real state boundaries, 24 hotspot records with sourced photography and travel data, a filterable map/list explorer, and hotspot detail pages.

## Features

- **Real India map** — actual state boundaries (not a placeholder blob), rendered from a vendored GeoJSON with `d3-geo`, with neighboring countries and water muted in behind it, and hotspots plotted at their real coordinates
- **Region clusters + ecosystem-colored pins** — hotspots cluster by region until you zoom into one, then resolve into pins colored by ecosystem (forest, wetland, desert, alpine, mangrove, marine)
- **Map layer toggles** — filter the map by Mammals, Birds, Reptiles, Flora, Rare Species, or Monsoon, independent of the sidebar filters
- **Access-point markers** — selecting a hotspot shows its real nearest airport, railway station, and (where documented) entry gates directly on the map
- **"Best time to visit" awareness** — the map and homepage highlight regions and hotspots whose best season matches the current month, plus a "Where to go in [month]" homepage section with season-level field notes (best for / avoid / travel caution)
- **42 wildlife hotspots** with real photography sourced and attributed from Wikimedia Commons (CC-licensed), real nearest airport/railway names linked to Google Maps, and a "Plan your visit" block with directions, background reading, and booking-search links
- **Interactive Map Explorer** (`/map`) — filter by region, wildlife type, experience, season, and difficulty; click a marker or list card for a rich preview (species, difficulty, permits, photography-friendly badge)
- **Hotspot directory** (`/hotspots`) with the same filtering, and detail pages (`/hotspots/[slug]`) with a full destination structure — species, a species-spotlight card grid, seasonal calendar, experiences, season/closures notes, a suggested itinerary, and real geographic-nearest hotspots
- **Species Guide** (`/species`, `/species/[slug]`) — 21 species with real photography, where to actually see each one (derived live from hotspot data, shown as compact location cards), best months, sighting difficulty, habitat, ethical viewing notes, and photography tips
- Jungle/expedition-inspired visual language — `Fraunces` for headlines, `Work Sans` for body text, an earthy palette, and a full-bleed map hero

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS for styling
- [`d3-geo`](https://github.com/d3/d3-geo) for map projection and path rendering
- [`world-atlas`](https://github.com/topojson/world-atlas) + [`topojson-client`](https://github.com/topojson/topojson-client) for the neighboring-countries basemap layer
- [`lucide-react`](https://lucide.dev) for icons
- Local, static data — no backend or database

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run typecheck
npm run build
```

## Project structure

```
app/                     Next.js App Router pages
  page.tsx                 Home
  map/page.tsx              Interactive map explorer
  hotspots/page.tsx          Hotspot directory (with filters)
  hotspots/[slug]/page.tsx    Hotspot detail page
  species/page.tsx           Species guide index
  species/[slug]/page.tsx     Species detail page
components/               Reusable UI, map, and card components
data/
  hotspots.ts               42 hotspot records
  species.ts                 21 species records (real content — habitat, conservation status, ethical/photography notes)
  species-images.json         Wikimedia Commons image metadata + attribution, per species
  india-states.json           Vendored India state boundaries (GeoJSON)
  neighboringCountries.ts     Neighboring-country basemap layer (derived from world-atlas)
  hotspot-images.json          Wikimedia Commons image metadata + attribution, per hotspot
  officialLinks.ts             Wikipedia / Maps / search link builders
  accessPoints.ts              Verified district/airport/railway/entry-gate data per hotspot
  ecosystems.ts                 Ecosystem classification per hotspot (forest/wetland/desert/alpine/mangrove/marine)
  seasonalWisdom.ts             Month-to-season mapping + season-level travel field notes
  boatingSpots.ts               Hotspots with a real, text-derived boating experience signal
lib/
  filterHotspots.ts         Search and filter logic
  speciesLinks.ts             Live species <-> hotspot derivation (no hand-maintained species-location lists)
  itinerary.ts                 Generic suggested-itinerary builder
  geo.ts                       Haversine distance for "nearby hotspots"
public/brand/               Logo assets
```

## Data & attribution

- State boundaries are a trimmed/simplified GeoJSON of India's states and union territories; the neighboring-countries layer comes from the public-domain Natural Earth dataset via `world-atlas`.
- Hotspot photography is sourced from [Wikimedia Commons](https://commons.wikimedia.org) under CC licenses; each image credits its photographer and license, linking back to the source file.
- Airport/railway/booking/Wikipedia links are generated from real place names — no fabricated or placeholder data.
- District, airport/railway coordinates, and entry-gate markers (`data/accessPoints.ts`) are individually source-verified; where no reliable public source exists (most park entry gates only publish names, not coordinates), the entry is omitted rather than estimated.
- Ecosystem categories (`data/ecosystems.ts`) are manually classified from each hotspot's existing habitat description. Seasonal field notes (`data/seasonalWisdom.ts`) are general, broadly-true patterns for Indian wildlife travel, not park-specific facts — always confirm exact closure dates and permits locally before booking.
- Species photography is sourced from Wikimedia Commons the same way hotspot photography is — real, attributed, CC-licensed files (`data/species-images.json`).
- A species' "where can I see this" and "best months" are computed live from the real hotspot species lists (`lib/speciesLinks.ts`), not a separately hand-maintained list — this is what caught and fixed several factually wrong species-location claims that existed before this pass. Species with no genuine hotspot match show an honest empty state rather than a fabricated location.
- New hotspots added specifically to cover a species' real range (Eravikulam, Singalila, Rushikulya, Gahirmatha) were only added after checking that no existing hotspot already had a real, documented population — see the "1 fringe + flagship split" note in the v3 changelog for how a borderline case (Nilgiri Tahr at Periyar) was handled.

## Not yet built

Seasonal Planner appears as a disabled nav placeholder — intentionally out of scope for this slice. Also on the wishlist: a CMS for hotspot content, live park advisories, saved itineraries/wishlists, and end-to-end test coverage.
