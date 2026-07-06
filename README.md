# Wild India Atlas

Wild India Atlas is a map-first travel guide for planning wildlife trips across India. It combines an interactive, real-boundary map of 42 tiger reserves, bird sanctuaries, wetlands, and Himalayan sanctuaries with a species guide (21 species and counting), so a trip can be planned by region, season, ecosystem, or species — whichever a traveler starts from. Every hotspot page carries real, individually-sourced photography, travel logistics (nearest airport/railway, permits, district), a species spotlight, a real closure/seasonal-access fact, and a suggested itinerary; species pages link back to exactly the hotspots where that animal is actually documented, derived live from the hotspot data rather than a separately hand-maintained list.

For the detailed build-by-build changelog, see [VERSION_HISTORY.md](VERSION_HISTORY.md).

## Features

- **Real India map** — actual state boundaries (not a placeholder blob), rendered from a vendored GeoJSON with `d3-geo`, with neighboring countries and water muted in behind it, and hotspots plotted at their real coordinates
- **Region clusters + ecosystem-colored pins** — hotspots cluster by region until you zoom into one, then resolve into pins colored by ecosystem (forest, wetland, desert, alpine, mangrove, marine)
- **Map layer toggles** — filter the map by Mammals, Birds, Reptiles, Flora, Rare Species, or Monsoon, independent of the sidebar filters
- **Access-point markers** — selecting a hotspot shows its real nearest airport, railway station, and (where documented) entry gates directly on the map
- **"Best time to visit" awareness** — the map and homepage highlight regions and hotspots whose best season matches the current month, plus a "Where to go in [month]" homepage section with season-level field notes (best for / avoid / travel caution)
- **42 wildlife hotspots** with real photography sourced and attributed from Wikimedia Commons (CC-licensed), real nearest airport/railway names linked to Google Maps, and a "Plan your visit" block with directions, background reading, and booking-search links
- **Interactive Map Explorer** (`/map`) — filter by region, wildlife type, experience, season, and difficulty; click a marker or list card for a rich preview (species, difficulty, permits, photography-friendly badge)
- **Hotspot directory** (`/hotspots`) with the same filtering, and detail pages (`/hotspots/[slug]`) with a full destination structure — species, a species-spotlight card grid, seasonal calendar, experiences, a season/closures fact with a source-confidence badge, a suggested itinerary, and real geographic-nearest hotspots
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
  closures.ts                   Individually-researched per-park seasonal closure facts, with source name/URL, last-verified date, and a confidence rating per entry
  seasonalWisdom.ts             Month-to-season mapping + generic season-level travel field notes (fallback only)
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
- New hotspots added specifically to cover a species' real range (Eravikulam, Singalila, Rushikulya, Gahirmatha) were only added after checking that no existing hotspot already had a real, documented population — see the "1 fringe + flagship split" note in the [v1.3 changelog](VERSION_HISTORY.md) for how a borderline case (Nilgiri Tahr at Periyar) was handled.
- "Season & closures" facts (`data/closures.ts`) are individually researched per park from state forest department notices and official park portals — not a blanket rule applied to every "Tiger Reserve"-type hotspot. Exact dates shift year to year by forest department order; treat these as a real planning signal, not a fixed calendar.
- Each closure fact carries a `confidence` rating (`official`/`inferred`/`unconfirmed`) and a `lastVerified` date, shown on the hotspot page via a small `<FreshnessBadge>` — `sourceName` is only set where a note already cited a specific department, and `sourceUrl` is left unset until a specific citable page is verified, rather than ever being guessed.

## Not yet built

Seasonal Planner appears as a disabled nav placeholder — intentionally out of scope for this slice. Also on the wishlist: a CMS for hotspot content, live park advisories, saved itineraries/wishlists, and end-to-end test coverage.
