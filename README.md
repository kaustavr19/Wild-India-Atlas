# Wild India Atlas

**Explore India’s wild places as landscapes, seasons, and living stories—not rows in a travel database.**

[Wild India Atlas](https://wild-india-atlas-mu.vercel.app/) is an immersive, map-first field guide for discovering wildlife across India. It connects 42 protected landscapes, six biomes, flagship species stories, 1,300+ citizen-science species profiles, seasonal travel signals, and practical planning information in one evidence-aware experience.

Start with a tiger, a monsoon month, a floodplain, or a place you have always wanted to visit. The atlas turns each entry point into a trail through the wild.

## Why it feels different

- **Enter a landscape** — every hotspot opens as a biome-led journey through terrain, wildlife, seasonal rhythm, field planning, and nearby places.
- **Experience an encounter** — selected flagship species feature cinematic, scroll-led field encounters with optional ambient soundscapes and ethical observation cues.
- **Follow real evidence** — eBird and iNaturalist records expand the guide without being presented as guaranteed sightings or hand-curated expertise.
- **Plan by nature’s calendar** — discover where to go by month, migration, monsoon, ecosystem, wildlife group, difficulty, or experience.
- **Keep a Field Journal** — save landscapes and species while the expedition trail remembers the latest places and animals explored.
- **See confidence, not false certainty** — closures, access constraints, structural risks, source confidence, and verification dates remain visible where they matter.

## Experience highlights

### A living atlas of India

The interactive map uses real state boundaries and real hotspot coordinates. Region clusters open into ecosystem-coloured markers for forest, wetland, desert, alpine, mangrove, and marine landscapes.

Filters cover region, wildlife group, experience, season, and difficulty. Map layers add signals for mammals, birds, reptiles, flora, rare species, and monsoon travel. Selecting a place reveals its airport, railway station, and documented entry gates.

### 42 immersive hotspot journeys

Every hotspot detail page now feels like entering a distinct landscape:

- cinematic, biome-aware photography and atmosphere
- a fast field-signal panel for season, access, effort, and duration
- landscape, wildlife, season, journey, and onward chapters
- curated mammals, birds, flora, and eBird checklist evidence
- a visual 12-month travel window
- seasonal closure guidance with confidence and freshness signals
- structural-risk disclosures where access or management is unusually complex
- suggested itineraries, permits, directions, travel notes, and ethical guidance
- related landscapes and genuinely nearby hotspots

### Flagship species stories

The 21 hand-curated flagship profiles connect habitat, conservation status, sighting difficulty, ethical viewing, photography guidance, best months, and real atlas locations.

Six signature species go further with scroll-led wildlife encounters:

- Bengal Tiger
- Snow Leopard
- Great Indian Bustard
- One-horned Rhinoceros
- Red Panda
- Olive Ridley Turtle

Each encounter begins with field signs rather than spectacle—tracks, calls, tides, grass movement, and patient observation.

### Evidence-led species profiles

More than 1,300 additional bird, mammal, reptile, and amphibian profiles are derived from grouped eBird and iNaturalist records.

These profiles are intentionally transparent:

- they identify the source and last refresh date
- they show the atlas places where a record is confirmed
- they distinguish presence from probability
- they avoid invented habitat, photography, or viewing advice
- missing conservation or photography data remains missing rather than being guessed

### Seasonal Planner

The Seasonal Planner turns every month into an expedition brief. Explore recommended hotspots, flagship wildlife, regional options, seasonal cautions, and experience types without treating nature as predictable.

### Field Journal and expedition trail

Save species and hotspots to a browser-local Field Journal, revisit them later, and follow the expedition trail of recent encounters across the site. No account or backend is required.

### A coherent field-guide design system

The interface uses:

- `Fraunces` for editorial display typography
- `Work Sans` for readable field notes
- `IBM Plex Mono` for labels and navigation signals
- biome-specific colour systems and atmosphere
- topographic, grain, and field-grid textures
- light and dark themes
- reduced-motion support and keyboard-visible interactions

## Trust and data philosophy

Wild India Atlas is designed to be evocative without becoming careless.

- Seasonal closure notes are researched per protected area rather than inferred from its category.
- Confidence tiers distinguish official, inferred, and currently unconfirmed information.
- Verification dates show when a fact was last checked.
- Structural risks are separated from ordinary seasonal closures.
- Species-to-hotspot links are derived from atlas data rather than maintained as a second conflicting list.
- Citizen-science presence is never presented as abundance or sighting probability.
- Exact gates, source URLs, conservation fields, and photos are omitted when the underlying source does not support them.

Read the public methodology at [`/data-sources`](https://wild-india-atlas-mu.vercel.app/data-sources) and the maintenance policy in [`docs/verification-cadence.md`](docs/verification-cadence.md).

## Main routes

| Route | Experience |
| --- | --- |
| `/` | Immersive atlas arrival, seasonal lead, search, and trail choices |
| `/map` | Interactive geographic explorer |
| `/hotspots` | Landscape-led hotspot discovery |
| `/hotspots/[slug]` | Immersive protected-landscape journey |
| `/species` | Unified flagship and evidence-led species guide |
| `/species/[slug]` | Curated encounter story or evidence profile |
| `/seasonal-planner` | Month-led wildlife trip discovery |
| `/field-journal` | Saved species, places, and expedition trail |
| `/field-kit` | Practical field preparation |
| `/data-sources` | Confidence tiers and data methodology |

## Technology

- [Next.js 16](https://nextjs.org/) App Router
- React 19 and TypeScript
- Tailwind CSS
- [`d3-geo`](https://github.com/d3/d3-geo) for the India map
- [`world-atlas`](https://github.com/topojson/world-atlas) and [`topojson-client`](https://github.com/topojson/topojson-client) for geographic context
- [`lucide-react`](https://lucide.dev/) for interface icons
- static local data with no required backend or database

The production build statically generates 1,413 pages.

## Run locally

Requirements: a current Node.js installation and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Verification

```bash
npm run typecheck
npm test
npm run build
```

### Optional data-refresh tooling

Copy `.env.local.example` to `.env.local` and add a free eBird API key when running the eBird scripts.

```bash
npm run find:ebird-hotspots
npm run fetch:ebird
npm run find:inaturalist-places
npm run fetch:inaturalist
npm run tag:specialities
```

Discovery candidates are reviewed before mappings enter the atlas. These scripts are manual tools, not build hooks, and no live third-party API request is required to render the site.

## Project structure

```text
app/                         Next.js routes and page templates
components/                  UI, map, discovery, encounter, journal, and shell components
data/                        Hotspots, species, imagery, access, season, and evidence records
lib/                         Search, filtering, relationships, itinerary, journey, and biome logic
scripts/                     Optional eBird and iNaturalist refresh tooling
tests/                       Search, discovery, journey, season, and species tests
docs/                        Verification and maintenance policy
public/                      Brand, audio, and static assets
```

## Photography and attribution

Hotspot and flagship-species photography is sourced from Wikimedia Commons under its listed licence. Evidence-led fauna imagery comes from the corresponding iNaturalist source data when available. Credits remain visible and link back to the source page.

Geographic, travel, access, and wildlife information can change. Always confirm permits, closures, weather, route conditions, and local guidance before travelling.

## Release history

The current release is **v1.25 — Immersive hotspot and species detail journeys**.

See [VERSION_HISTORY.md](VERSION_HISTORY.md) for the complete build-by-build changelog.

## Project status

Wild India Atlas is a growing independent field-guide experience. The strongest next opportunities are live park advisories, a maintainable editorial CMS, richer verified biodiversity coverage, itinerary export, and end-to-end browser testing.
