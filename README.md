# Wild India Atlas

A map-first travel guide for exploring India's wildlife hotspots — tiger reserves, bird sanctuaries, wetlands, and Himalayan sanctuaries — by region, season, and species.

## Version history

**v2 — Map as a trip-discovery engine** (current)
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
- **24 wildlife hotspots** with real photography sourced and attributed from Wikimedia Commons (CC-licensed), real nearest airport/railway names linked to Google Maps, and a "Plan your visit" block with directions, background reading, and booking-search links
- **Interactive Map Explorer** (`/map`) — filter by region, wildlife type, experience, season, and difficulty; click a marker or list card for a rich preview (species, difficulty, permits, photography-friendly badge)
- **Hotspot directory** (`/hotspots`) with the same filtering, and detail pages (`/hotspots/[slug]`) with species, seasonal charts, and travel notes
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
components/               Reusable UI, map, and card components
data/
  hotspots.ts               24 hotspot records
  species.ts                 Species data (for future Species Explorer)
  india-states.json           Vendored India state boundaries (GeoJSON)
  neighboringCountries.ts     Neighboring-country basemap layer (derived from world-atlas)
  hotspot-images.json          Wikimedia Commons image metadata + attribution
  officialLinks.ts             Wikipedia / Maps / search link builders
  accessPoints.ts              Verified district/airport/railway/entry-gate data per hotspot
  ecosystems.ts                 Ecosystem classification per hotspot (forest/wetland/desert/alpine/mangrove/marine)
  seasonalWisdom.ts             Month-to-season mapping + season-level travel field notes
lib/filterHotspots.ts      Search and filter logic
public/brand/               Logo assets
```

## Data & attribution

- State boundaries are a trimmed/simplified GeoJSON of India's states and union territories; the neighboring-countries layer comes from the public-domain Natural Earth dataset via `world-atlas`.
- Hotspot photography is sourced from [Wikimedia Commons](https://commons.wikimedia.org) under CC licenses; each image credits its photographer and license, linking back to the source file.
- Airport/railway/booking/Wikipedia links are generated from real place names — no fabricated or placeholder data.
- District, airport/railway coordinates, and entry-gate markers (`data/accessPoints.ts`) are individually source-verified; where no reliable public source exists (most park entry gates only publish names, not coordinates), the entry is omitted rather than estimated.
- Ecosystem categories (`data/ecosystems.ts`) are manually classified from each hotspot's existing habitat description. Seasonal field notes (`data/seasonalWisdom.ts`) are general, broadly-true patterns for Indian wildlife travel, not park-specific facts — always confirm exact closure dates and permits locally before booking.

## Not yet built

Species Explorer and Seasonal Planner appear as disabled nav placeholders — intentionally out of scope for this slice. Also on the wishlist: a CMS for hotspot content, live park advisories, saved itineraries/wishlists, and end-to-end test coverage.
