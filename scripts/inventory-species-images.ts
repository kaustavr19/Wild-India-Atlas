// Builds a read-only inventory of every canonical extended species that still uses
// the designed fallback. Exact Wikidata P225 matches are queried in batches, then
// Wikimedia Commons metadata is classified without changing the production manifest.
//
// Usage: npm run inventory:species-images
//        npm run inventory:species-images -- --output=docs/custom-inventory.json

import { writeFile } from "node:fs/promises";
import path from "node:path";
import extendedImagesRaw from "../data/extended-species-images.json" with { type: "json" };
import ebirdSpeciesRaw from "../data/ebirdSpecies.json" with { type: "json" };
import inaturalistSpeciesRaw from "../data/inaturalistSpecies.json" with { type: "json" };
import { species as flagshipSpecies } from "../data/species.ts";
import {
  buildSpeciesImageCandidates,
  type ExtendedSpeciesImageMeta,
} from "../lib/speciesImageAudit.ts";
import {
  classifySpeciesImageInventory,
  summarizeSpeciesImageInventory,
  type SpeciesImageInventoryStatus,
} from "../lib/speciesImageInventory.ts";

type Candidate = ReturnType<typeof buildSpeciesImageCandidates>[number];
type WikidataBinding = {
  name?: { value?: string };
  taxon?: { value?: string };
  image?: { value?: string };
};
type WikidataResponse = { results?: { bindings?: WikidataBinding[] } };
type CommonsImageInfo = {
  thumburl?: string;
  thumbwidth?: number;
  thumbheight?: number;
  url?: string;
  width?: number;
  height?: number;
  extmetadata?: Record<string, { value?: string }>;
};
type CommonsPage = { title?: string; imageinfo?: CommonsImageInfo[] };
type CommonsResponse = { query?: { pages?: Record<string, CommonsPage> } };
type TaxonLookup = { taxonUri?: string; imageFilename?: string };
type CommonsLookup = {
  title?: string;
  author?: string;
  license?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  filePage?: string;
};
type InventoryItem = {
  slug: string;
  commonName: string;
  scientificName: string;
  source: Candidate["source"];
  confirmationCount: number;
  status: SpeciesImageInventoryStatus;
  reason: string;
  taxonUri?: string;
  imageFilename?: string;
  imageUrl?: string;
  width?: number;
  height?: number;
  filePage?: string;
  author?: string;
  license?: string;
};

const extendedImages = extendedImagesRaw as Record<string, ExtendedSpeciesImageMeta>;
const ebirdSpecies = ebirdSpeciesRaw as Record<string, Array<{ sciName: string; comName: string; photoUrl?: string }>>;
const inaturalistSpecies = inaturalistSpeciesRaw as Record<string, Array<{ scientificName: string; commonName: string; photoUrl?: string }>>;
const outputArg = process.argv.find((argument) => argument.startsWith("--output="));
const outputPath = path.resolve(process.cwd(), outputArg?.slice("--output=".length) || "docs/phase-3d-species-image-inventory.json");
const USER_AGENT = "WildIndiaAtlas/1.0 (read-only licensed image inventory; https://github.com/kaustavr19/Wild-India-Atlas)";
const WIKIDATA_BATCH_SIZE = 30;
const COMMONS_BATCH_SIZE = 20;

function plainText(value: string | undefined): string {
  return (value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function chunks<T>(items: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let index = 0; index < items.length; index += size) result.push(items.slice(index, index + size));
  return result;
}

function fileKey(value: string): string {
  return decodeURIComponent(value)
    .replace(/^File:/i, "")
    .replace(/_/g, " ")
    .trim()
    .toLocaleLowerCase("en");
}

async function getJson<T>(url: URL): Promise<T> {
  let lastError = "unknown error";
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": USER_AGENT },
        signal: AbortSignal.timeout(30_000),
      });
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

async function lookupWikidata(candidates: Candidate[]): Promise<Map<string, TaxonLookup>> {
  const lookups = new Map<string, TaxonLookup>();
  const batches = chunks(candidates, WIKIDATA_BATCH_SIZE);
  for (let index = 0; index < batches.length; index++) {
    const batch = batches[index];
    const values = batch.map((candidate) => JSON.stringify(candidate.scientificName)).join(" ");
    const query = `SELECT ?name ?taxon ?image WHERE {
      VALUES ?name { ${values} }
      OPTIONAL {
        ?taxon wdt:P225 ?name.
        OPTIONAL { ?taxon wdt:P18 ?image. }
      }
    }`;
    const url = new URL("https://query.wikidata.org/sparql");
    url.search = new URLSearchParams({ query, format: "json" }).toString();
    const body = await getJson<WikidataResponse>(url);
    for (const binding of body.results?.bindings ?? []) {
      const name = binding.name?.value;
      if (!name) continue;
      const existing = lookups.get(name);
      const next: TaxonLookup = {
        taxonUri: binding.taxon?.value ?? existing?.taxonUri,
        imageFilename: binding.image?.value
          ? decodeURIComponent(new URL(binding.image.value).pathname.split("/").pop()!)
          : existing?.imageFilename,
      };
      lookups.set(name, next);
    }
    process.stderr.write(`Wikidata ${index + 1}/${batches.length}\r`);
    await new Promise((resolve) => setTimeout(resolve, 750));
  }
  process.stderr.write("\n");
  return lookups;
}

async function lookupCommons(filenames: string[]): Promise<Map<string, CommonsLookup>> {
  const lookups = new Map<string, CommonsLookup>();
  const uniqueFilenames = [...new Set(filenames)];
  const batches = chunks(uniqueFilenames, COMMONS_BATCH_SIZE);
  for (let index = 0; index < batches.length; index++) {
    const titles = batches[index].map((filename) => `File:${filename}`).join("|");
    const url = new URL("https://commons.wikimedia.org/w/api.php");
    url.search = new URLSearchParams({
      action: "query",
      titles,
      prop: "imageinfo",
      iiprop: "url|size|extmetadata",
      iiurlwidth: "960",
      format: "json",
    }).toString();
    const body = await getJson<CommonsResponse>(url);
    for (const page of Object.values(body.query?.pages ?? {})) {
      const info = page.imageinfo?.[0];
      if (!page.title || !info) continue;
      const metadata = info.extmetadata ?? {};
      lookups.set(fileKey(page.title), {
        title: plainText(metadata.ObjectName?.value) || page.title,
        author: plainText(metadata.Artist?.value || metadata.Credit?.value),
        license: plainText(metadata.LicenseShortName?.value),
        imageUrl: info.thumburl ?? info.url,
        width: info.thumbwidth ?? info.width,
        height: info.thumbheight ?? info.height,
        filePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, "_"))}`,
      });
    }
    process.stderr.write(`Commons ${index + 1}/${batches.length}\r`);
    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
  process.stderr.write("\n");
  return lookups;
}

function reasonFor(status: SpeciesImageInventoryStatus): string {
  switch (status) {
    case "review-ready": return "Exact taxon, approved attribution licence, and complete Commons metadata; visual review still required.";
    case "no-exact-taxon": return "Wikidata returned no item with this exact P225 scientific name.";
    case "no-primary-image": return "The exact Wikidata taxon has no P18 primary image.";
    case "unsupported-license": return "The primary image is not published under an approved CC BY or CC BY-SA licence.";
    case "incomplete-metadata": return "Commons metadata is missing an author, source URL, file page, or dimensions.";
  }
}

const candidates = buildSpeciesImageCandidates(flagshipSpecies, ebirdSpecies, inaturalistSpecies)
  .filter((candidate) => !extendedImages[candidate.slug] && !candidate.photoUrl)
  .sort((left, right) => right.confirmationCount - left.confirmationCount || left.commonName.localeCompare(right.commonName));

const taxonLookups = await lookupWikidata(candidates);
const commonsLookups = await lookupCommons(
  candidates
    .map((candidate) => taxonLookups.get(candidate.scientificName)?.imageFilename)
    .filter((filename): filename is string => Boolean(filename)),
);

const items: InventoryItem[] = candidates.map((candidate) => {
  const taxon = taxonLookups.get(candidate.scientificName);
  const commons = taxon?.imageFilename ? commonsLookups.get(fileKey(taxon.imageFilename)) : undefined;
  const status = classifySpeciesImageInventory({
    hasExactTaxon: Boolean(taxon?.taxonUri),
    hasPrimaryImage: Boolean(taxon?.imageFilename),
    license: commons?.license,
    author: commons?.author,
    imageUrl: commons?.imageUrl,
    filePage: commons?.filePage,
    width: commons?.width,
    height: commons?.height,
  });
  return {
    slug: candidate.slug,
    commonName: candidate.commonName,
    scientificName: candidate.scientificName,
    source: candidate.source,
    confirmationCount: candidate.confirmationCount,
    status,
    reason: reasonFor(status),
    taxonUri: taxon?.taxonUri,
    imageFilename: taxon?.imageFilename,
    imageUrl: commons?.imageUrl,
    width: commons?.width,
    height: commons?.height,
    filePage: commons?.filePage,
    author: commons?.author,
    license: commons?.license,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  productionBaseline: {
    totalSpecies: 1359,
    reviewedExtendedImages: Object.keys(extendedImages).length,
    fallbackSpeciesInventoried: candidates.length,
  },
  summary: summarizeSpeciesImageInventory(items),
  items,
};

await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(`Wrote ${items.length} inventory records to ${path.relative(process.cwd(), outputPath)}.`);
console.log(JSON.stringify(report.summary, null, 2));
