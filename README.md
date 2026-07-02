# Wild India Atlas

A map-first travel guide for exploring India's wildlife hotspots — tiger reserves, bird sanctuaries, wetlands, and Himalayan sanctuaries — by region, season, and species.

## Features

- **Real India map** — actual state boundaries (not a placeholder blob), rendered from a vendored GeoJSON with `d3-geo`, colored by region/zone, with hotspots plotted at their real coordinates
- **"Best time to visit" awareness** — the map and homepage highlight regions and hotspots whose best season matches the current month
- **24 wildlife hotspots** with real photography sourced and attributed from Wikimedia Commons (CC-licensed), real nearest airport/railway names linked to Google Maps, and a "Plan your visit" block with directions, background reading, and booking-search links
- **Interactive Map Explorer** (`/map`) — filter by region, wildlife type, experience, season, and difficulty; click a marker or list card to preview a hotspot
- **Hotspot directory** (`/hotspots`) with the same filtering, and detail pages (`/hotspots/[slug]`) with species, seasonal charts, and travel notes
- Jungle/expedition-inspired visual language — `Fraunces` for headlines, `Work Sans` for body text, an earthy palette, and a full-bleed map hero

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 + TypeScript
- Tailwind CSS for styling
- [`d3-geo`](https://github.com/d3/d3-geo) for map projection and path rendering
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
  hotspot-images.json          Wikimedia Commons image metadata + attribution
  officialLinks.ts             Wikipedia / Maps / search link builders
lib/filterHotspots.ts      Search and filter logic
public/brand/               Logo assets
```

## Data & attribution

- State boundaries are a trimmed/simplified GeoJSON of India's states and union territories.
- Hotspot photography is sourced from [Wikimedia Commons](https://commons.wikimedia.org) under CC licenses; each image credits its photographer and license, linking back to the source file.
- Airport/railway/booking/Wikipedia links are generated from real place names — no fabricated or placeholder data.

## Not yet built

Species Explorer and Seasonal Planner appear as disabled nav placeholders — intentionally out of scope for this slice. Also on the wishlist: a CMS for hotspot content, live park advisories, saved itineraries/wishlists, and end-to-end test coverage.
