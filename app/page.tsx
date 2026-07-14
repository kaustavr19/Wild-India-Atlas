"use client";
import Link from "next/link"; import { AlertTriangle, Compass, ShieldAlert } from "lucide-react"; import { hotspots } from "@/data/hotspots"; import { HotspotCard } from "@/components/HotspotCard"; import { HotspotImage } from "@/components/HotspotImage"; import { monthToSeason } from "@/data/seasonalWisdom"; import { ecosystem } from "@/data/ecosystems"; import { closureInfo } from "@/data/closures"; import { structuralRisks } from "@/data/structuralRisks"; import { DescentSequence } from "@/components/DescentSequence"; import type { Hotspot } from "@/data/types"; import hotspotImages from "@/data/hotspot-images.json";
const monthAbbr=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const monthName=['January','February','March','April','May','June','July','August','September','October','November','December'];
// Composed from real per-park fields (ecosystem, mainSpecies/birdSpecies, bestMonths) —
// no hand-written per-park editorial copy, so this stays accurate as the featured park
// changes month to month instead of needing new prose written for each one.
function bestForSentence(h: Hotspot, monthLabel: string): string {
  const eco = ecosystem[h.slug];
  const ecoText = eco ? eco + " habitat" : h.habitat;
  const article = /^[aeiou]/i.test(ecoText) ? "an" : "a";
  const species = [...h.mainSpecies, ...h.birdSpecies].slice(0, 2);
  const speciesText = species.length === 2 ? species[0] + " and " + species[1] : species[0];
  return h.name + " is " + article + " " + ecoText + (speciesText ? ", known for " + speciesText : "") + ". " + monthLabel + " is one of its best months to visit.";
}
// The real experienceTags values used across data/hotspots.ts (confirmed via grep, not
// assumed) — the same tag strings FilterPanel's experience dropdown and /map's free-text
// search already understand. For each tag, picks the first hotspot (in hotspots.ts's own
// declaration order) that both carries the tag and has a real photo in
// data/hotspot-images.json, skipping any hotspot already used by an earlier tile so the
// six tiles show six different parks/photos instead of the same flagship park repeating
// (Jim Corbett alone carries 4 of these 6 tags, which made an earlier "most tags wins"
// tie-break produce a very repetitive mosaic — deterministic first-unused-match reads as
// a real index of the site instead).
const EXPERIENCE_TAGS = ["Photography", "Safari", "Birding", "Family-friendly", "Offbeat", "Trekking"] as const;
type TileSize = "big" | "wide" | "normal";
type ExperienceTile = { tag: string; hotspot: Hotspot; parkCount: number; size: TileSize };
const hotspotImagesBySlug = hotspotImages as Record<string, { title?: string } | undefined>;
function buildExperienceTiles(): ExperienceTile[] {
  const used = new Set<string>();
  const built: { tag: string; hotspot: Hotspot; parkCount: number }[] = [];
  for (const tag of EXPERIENCE_TAGS) {
    const matches = hotspots.filter(h => h.experienceTags.includes(tag));
    const withPhoto = matches.filter(h => !!hotspotImagesBySlug[h.slug]);
    const pick = withPhoto.find(h => !used.has(h.slug)) ?? withPhoto[0];
    if (!pick) continue;
    used.add(pick.slug);
    built.push({ tag, hotspot: pick, parkCount: matches.length });
  }
  // Real mosaic size variation rather than a uniform grid: the two tags with the most
  // matching parks (computed, not guessed) get a larger footprint — one "big" 2x2 tile,
  // one "wide" 2x1 tile — everything else stays a normal single cell. Ranked by the same
  // real parkCount already shown in each tile's own caption, so the layout and the copy
  // agree with each other.
  const byCountDesc = [...built].sort((a, b) => b.parkCount - a.parkCount);
  const bigTag = byCountDesc[0]?.tag;
  const wideTag = byCountDesc[1]?.tag;
  return built.map(t => ({ ...t, size: t.tag === bigTag ? "big" : t.tag === wideTag ? "wide" : "normal" }));
}
const experienceTiles = buildExperienceTiles();
// Secondary preference, not a hard requirement: when more than one hotspot qualifies for
// the current month, prefer one whose real photo shows wildlife/fauna rather than pure
// landscape over one that doesn't — checked against that hotspot's own listed
// mainSpecies/birdSpecies names appearing in the photo's real Wikimedia file title (e.g.
// "Bengal tiger in Bandhavgarh National Park..." vs "The Main Lake at Ranthambore
// National Park..."), not a generic invented keyword list. First such match, in
// hotspots.ts's own declaration order, is promoted to the front; if none of the
// candidates' photos mention one of their own species, the original seasonal order is
// left untouched. With only one hotspot qualifying for a month (true for July → Valley of
// Flowers as of this build), this never has anything to tie-break and changes nothing.
function photoShowsFauna(h: Hotspot): boolean {
  const title = hotspotImagesBySlug[h.slug]?.title?.toLowerCase();
  if (!title) return false;
  return [...h.mainSpecies, ...h.birdSpecies].some(s => title.includes(s.toLowerCase()));
}
// Real, computed counts for the closing trust section — not estimates. Recomputed from
// the actual data files every build, so these stay accurate as the dataset grows rather
// than needing a manual copy update.
const OFFICIAL_OR_INFERRED_COUNT = Object.values(closureInfo).filter(c => c.confidence === "official" || c.confidence === "inferred").length;
const STRUCTURAL_RISK_COUNT = Object.keys(structuralRisks).length;
// "use client" (not any hook here directly) so `now = new Date()` below evaluates fresh
// in the visitor's browser on every load, not once at build time — the featured park is
// deliberately live/seasonal, not a static build-time snapshot.
export default function Home(){ const now=new Date(); const currentMonth=monthAbbr[now.getMonth()]; const currentSeason=monthToSeason[currentMonth]; const monthMatches=hotspots.filter(h=>h.bestMonths.includes(currentMonth)); const faunaPick=monthMatches.length>1 ? monthMatches.find(photoShowsFauna) : undefined; const orderedMatches=faunaPick ? [faunaPick, ...monthMatches.filter(h=>h!==faunaPick)] : monthMatches; const best=orderedMatches.slice(0,4); const regionCount=new Set(hotspots.map(h=>h.region)).size; const featured=best[0]; const otherBets=best.slice(1); const closure=featured?closureInfo[featured.slug]:undefined; const risk=featured?structuralRisks[featured.slug]:undefined; return <main>{featured && <DescentSequence featured={featured} totalParks={hotspots.length} regionCount={regionCount} currentSeason={currentSeason}/>}{featured && <section className="bg-forest-900 text-white"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[42%_1fr] lg:items-stretch lg:gap-x-12 lg:px-6"><HotspotImage slug={featured.slug} type={featured.type} className="group h-64 w-full sm:h-80 lg:h-auto"/><div className="py-10 lg:py-16"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sand">{currentSeason} field notes · {featured.name}</p><h2 className="mt-1 text-3xl font-semibold text-white">Where to go in {monthName[now.getMonth()]}</h2></div><Link href="/map" className="hidden font-bold text-white/80 transition hover:text-sand sm:inline-flex">View all</Link></div><div className={"mt-8 grid gap-6 " + (risk ? "lg:grid-cols-3 lg:gap-x-8" : "lg:grid-cols-2 lg:gap-x-8")}><div><p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-forest-300"><Compass size={14}/>Best for</p><p className="mt-3 border-l-2 border-forest-300/40 pl-4 text-sm leading-6 text-white/80">{bestForSentence(featured, monthName[now.getMonth()])}</p></div>{closure && <div><p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-clay"><AlertTriangle size={14}/>Know before you go</p><p className="mt-3 border-l-2 border-clay/40 pl-4 text-sm leading-6 text-white/80">{closure.note}</p>{closure.sourceName && <p className="mt-2 pl-4 font-mono text-[10px] uppercase tracking-wide text-white/40">Source: {closure.sourceName}</p>}</div>}{risk && <div><p className="flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-amberfield"><ShieldAlert size={14}/>Travel caution</p><p className="mt-3 border-l-2 border-amberfield/40 pl-4 text-sm leading-6 text-white/80">{risk.summary}</p></div>}</div></div></div>{otherBets.length>0 && <div className="mx-auto max-w-7xl px-4 pb-14 pt-2 sm:px-6 lg:px-6 lg:pt-4"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sand">Other good bets this month</p><div className="mt-3 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{otherBets.map(h=><HotspotCard key={h.slug} hotspot={h}/>)}</div></div>}</section>}<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6" id="about"><h2 className="text-3xl font-semibold text-forest-900">Explore by experience</h2><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 md:auto-rows-[180px] md:grid-flow-dense">{experienceTiles.map(tile=><Link href={"/map?query=" + encodeURIComponent(tile.tag)} key={tile.tag} className={"group relative isolate block overflow-hidden rounded-sm h-40 sm:h-52 md:h-auto " + (tile.size==="big" ? "col-span-2 sm:col-span-1 md:col-span-2 md:row-span-2" : tile.size==="wide" ? "col-span-2 sm:col-span-1 md:col-span-2" : "")}><HotspotImage slug={tile.hotspot.slug} type={tile.hotspot.type} className="absolute inset-0 h-full w-full transition duration-500 ease-out group-hover:scale-110"/><div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/25 to-transparent"/><div className="absolute inset-x-0 bottom-0 p-4 sm:p-5"><h3 className={"font-semibold text-white " + (tile.size==="big" ? "text-2xl sm:text-3xl" : tile.size==="wide" ? "text-xl sm:text-2xl" : "text-xl")}>{tile.tag}</h3><p className="mt-1 text-xs font-medium text-white/70">{tile.parkCount} parks · Featuring {tile.hotspot.name}</p></div></Link>)}</div></section><section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6 sm:py-24"><p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-river">How we verify</p><h2 className="mt-3 text-3xl font-semibold text-forest-900">Verified, not guessed.</h2><p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-slate-700 dark:text-slate-300">{OFFICIAL_OR_INFERRED_COUNT} of our {hotspots.length} hotspots carry a closure note backed by a named forest department or a well-documented pattern — not a guess — and {STRUCTURAL_RISK_COUNT} carry an explicit disclosure when the real complexity is jurisdiction or access, not season. Species presence data comes from real eBird and iNaturalist records, not invented lists.</p><Link href="/data-sources" className="mt-6 inline-flex items-center gap-2 font-bold text-forest-700 underline-offset-4 transition hover:underline dark:text-forest-300">See how we verify every park <span className="text-amberfield">→</span></Link></section></main>; }
