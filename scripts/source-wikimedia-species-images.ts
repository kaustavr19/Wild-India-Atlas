// Finds review candidates for explicitly selected canonical species through Wikidata's
// exact taxon item and its Wikimedia Commons P18 image. It prints metadata only and never
// writes the production manifest; a human must visually and editorially review each result.
//
// Usage: npm run source:species-images -- --slugs=red-vented-bulbul,gray-wagtail

import ebirdSpeciesRaw from "../data/ebirdSpecies.json" with { type: "json" };
import inaturalistSpeciesRaw from "../data/inaturalistSpecies.json" with { type: "json" };
import { species as flagshipSpecies } from "../data/species.ts";
import { buildSpeciesImageCandidates, type ExtendedSpeciesImageMeta } from "../lib/speciesImageAudit.ts";

const ebirdSpecies = ebirdSpeciesRaw as Record<string, Array<{ sciName: string; comName: string; photoUrl?: string }>>;
const inaturalistSpecies = inaturalistSpeciesRaw as Record<string, Array<{ scientificName: string; commonName: string; photoUrl?: string }>>;
const candidates = buildSpeciesImageCandidates(flagshipSpecies, ebirdSpecies, inaturalistSpecies);
const bySlug = new Map(candidates.map((candidate) => [candidate.slug, candidate]));
const slugsArg = process.argv.find((argument) => argument.startsWith("--slugs="));
const requestedSlugs = slugsArg?.slice("--slugs=".length).split(",").map((slug) => slug.trim()).filter(Boolean) ?? [];

if (requestedSlugs.length === 0) throw new Error("Pass at least one canonical slug with --slugs=slug-one,slug-two.");

type WikidataSparqlResponse = { results?: { bindings?: Array<{ image?: { value?: string } }> } };
type CommonsImageInfo = {
  thumburl?: string;
  thumbwidth?: number;
  thumbheight?: number;
  url?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, { value?: string }>;
};
type CommonsResponse = { query?: { pages?: Record<string, { title?: string; imageinfo?: CommonsImageInfo[] }> } };

const USER_AGENT = "WildIndiaAtlas/1.0 (read-only licensed image candidate lookup; https://github.com/kaustavr19/Wild-India-Atlas)";

function plainText(value: string | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function getJson<T>(url: URL): Promise<T> {
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30_000) });
      if (response.ok) return await response.json() as T;
      lastError = `${response.status} ${response.statusText}`;
      if (response.status !== 429 && response.status < 500) break;
      const retryAfter = Number(response.headers.get("retry-after"));
      const delay = Number.isFinite(retryAfter) && retryAfter > 0
        ? Math.min(retryAfter * 1_000, 30_000)
        : attempt * 4_000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      await new Promise((resolve) => setTimeout(resolve, attempt * 4_000));
    }
  }
  throw new Error(`${lastError} for ${url.hostname}`);
}

async function wikidataImageFilename(scientificName: string): Promise<string> {
  const query = `SELECT ?image WHERE { ?taxon wdt:P225 ${JSON.stringify(scientificName)}; wdt:P18 ?image. } LIMIT 1`;
  const url = new URL("https://query.wikidata.org/sparql");
  url.search = new URLSearchParams({ query, format: "json" }).toString();
  const body = await getJson<WikidataSparqlResponse>(url);
  const imageUrl = body.results?.bindings?.[0]?.image?.value;
  if (!imageUrl) throw new Error(`No Wikidata P18 image found for taxon name ${scientificName}.`);
  return decodeURIComponent(new URL(imageUrl).pathname.split("/").pop()!);
}

async function commonsMetadata(filename: string, scientificName: string): Promise<ExtendedSpeciesImageMeta> {
  const title = `File:${filename}`;
  const url = new URL("https://commons.wikimedia.org/w/api.php");
  url.search = new URLSearchParams({ action: "query", titles: title, prop: "imageinfo", iiprop: "url|size|extmetadata", iiurlwidth: "1280", format: "json" }).toString();
  const body = await getJson<CommonsResponse>(url);
  const page = Object.values(body.query?.pages ?? {})[0];
  const info = page?.imageinfo?.[0];
  if (!page?.title || !info) throw new Error(`Commons returned no image metadata for ${title}.`);

  const metadata = info.extmetadata ?? {};
  const license = plainText(metadata.LicenseShortName?.value);
  const author = plainText(metadata.Artist?.value || metadata.Credit?.value);
  const imageUrl = info.thumburl ?? info.url;
  const width = info.thumbwidth ?? info.width;
  const height = info.thumbheight ?? info.height;
  if (!imageUrl || !width || !height || !author || !license) throw new Error(`Commons metadata is incomplete for ${title}.`);

  return {
    scientificName,
    source: "Wikimedia Commons",
    title: plainText(metadata.ObjectName?.value) || page.title,
    src: imageUrl,
    width,
    height,
    filePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
    author,
    license,
  };
}

const output: Record<string, ExtendedSpeciesImageMeta> = {};
const failures: Array<{ slug: string; reason: string }> = [];
for (const slug of requestedSlugs) {
  const species = bySlug.get(slug);
  if (!species) throw new Error(`${slug} is not a canonical extended species slug.`);
  try {
    const filename = await wikidataImageFilename(species.scientificName);
    output[slug] = await commonsMetadata(filename, species.scientificName);
  } catch (error) {
    failures.push({ slug, reason: error instanceof Error ? error.message : String(error) });
  }
  await new Promise((resolve) => setTimeout(resolve, 1_500));
}

console.log(JSON.stringify(output, null, 2));
if (failures.length > 0) {
  console.error("\nCandidates requiring manual review:");
  for (const failure of failures) console.error(`${failure.slug}\t${failure.reason}`);
}
