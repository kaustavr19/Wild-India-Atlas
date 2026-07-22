export type SpeciesImageMeta = {
  title: string;
  src: string;
  width: number;
  height: number;
  filePage: string;
  author: string;
  license: string;
};

export type ExtendedSpeciesImageMeta = SpeciesImageMeta & {
  scientificName: string;
  source: "Wikimedia Commons" | "iNaturalist" | "Other";
  sourceAsset?: string;
};

type FlagshipSpecies = { slug: string; scientificName: string };
type EbirdEntry = { sciName: string; comName: string; photoUrl?: string };
type INaturalistEntry = { scientificName: string; commonName: string; photoUrl?: string };

export type SpeciesImageAuditIssue = {
  severity: "error" | "warning";
  code: string;
  subject: string;
  message: string;
};

export type SpeciesImageAuditReport = {
  catalog: {
    flagship: number;
    extended: number;
    total: number;
    extendedBirds: number;
    extendedOtherAnimals: number;
  };
  coverage: {
    attributableLicensed: number;
    legacyRemoteWithoutAttribution: number;
    designedFallbackRequired: number;
    displayablePercent: number;
    attributablePercent: number;
  };
  manifests: {
    flagshipEntries: number;
    extendedEntries: number;
  };
  issues: SpeciesImageAuditIssue[];
};

export type RemoteImageResponseClassification = "ok" | "failure" | "inconclusive";

export function classifyRemoteImageResponse(status: number, contentType: string | null): RemoteImageResponseClassification {
  if (status === 429 || status === 408 || status >= 500) return "inconclusive";
  if (status === 404 || status === 410 || (status >= 400 && status < 500)) return "failure";
  if (status < 200 || status >= 300) return "inconclusive";
  if (!contentType) return "inconclusive";
  const normalized = contentType.toLowerCase();
  if (normalized.startsWith("image/")) return "ok";
  if (normalized.startsWith("application/octet-stream")) return "inconclusive";
  return "failure";
}

export type SpeciesImageCandidate = {
  slug: string;
  scientificName: string;
  commonName: string;
  source: "eBird" | "iNaturalist";
  photoUrl?: string;
  confirmationCount: number;
};

function genusSpeciesKey(scientificName: string): string {
  return scientificName.trim().toLowerCase().split(/\s+/).slice(0, 2).join(" ");
}

function toSlug(name: string): string {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function isHttpsUrl(value: string): boolean {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isLocalImagePath(value: string): boolean {
  return /^\/images\/[a-z0-9/_-]+\.(?:avif|jpe?g|png|webp)$/i.test(value);
}

export function buildSpeciesImageCandidates(
  flagshipSpecies: FlagshipSpecies[],
  ebirdSpecies: Record<string, EbirdEntry[]>,
  inaturalistSpecies: Record<string, INaturalistEntry[]>,
): SpeciesImageCandidate[] {
  const byScientificName = new Map<string, Omit<SpeciesImageCandidate, "slug" | "confirmationCount"> & { confirmedAtSlugs: Set<string> }>();

  for (const [hotspotSlug, entries] of Object.entries(ebirdSpecies)) {
    for (const entry of entries) {
      const scientificName = entry.sciName.trim();
      if (!scientificName) continue;
      const key = scientificName.toLowerCase();
      if (!byScientificName.has(key)) {
        byScientificName.set(key, {
          scientificName,
          commonName: entry.comName,
          source: "eBird",
          confirmedAtSlugs: new Set([hotspotSlug]),
          ...(entry.photoUrl ? { photoUrl: entry.photoUrl } : {}),
        });
      } else {
        byScientificName.get(key)!.confirmedAtSlugs.add(hotspotSlug);
      }
    }
  }

  for (const [hotspotSlug, entries] of Object.entries(inaturalistSpecies)) {
    for (const entry of entries) {
      const scientificName = entry.scientificName.trim();
      if (!scientificName) continue;
      const key = scientificName.toLowerCase();
      const current = byScientificName.get(key);
      if (!current) {
        byScientificName.set(key, {
          scientificName,
          commonName: entry.commonName,
          source: "iNaturalist",
          confirmedAtSlugs: new Set([hotspotSlug]),
          ...(entry.photoUrl ? { photoUrl: entry.photoUrl } : {}),
        });
      } else {
        current.confirmedAtSlugs.add(hotspotSlug);
        if (!current.photoUrl && entry.photoUrl) current.photoUrl = entry.photoUrl;
      }
    }
  }

  const flagshipGenusSpecies = new Set(flagshipSpecies.map((item) => genusSpeciesKey(item.scientificName)));
  const usedSlugs = new Set(flagshipSpecies.map((item) => item.slug));
  const result: SpeciesImageCandidate[] = [];

  for (const key of Array.from(byScientificName.keys()).sort()) {
    const item = byScientificName.get(key)!;
    if (flagshipGenusSpecies.has(genusSpeciesKey(item.scientificName))) continue;

    let slug = toSlug(item.commonName) || toSlug(item.scientificName);
    if (usedSlugs.has(slug)) {
      let suffix = 2;
      while (usedSlugs.has(`${slug}-${suffix}`)) suffix++;
      slug = `${slug}-${suffix}`;
    }
    usedSlugs.add(slug);
    result.push({
      slug,
      scientificName: item.scientificName,
      commonName: item.commonName,
      source: item.source,
      confirmationCount: item.confirmedAtSlugs.size,
      ...(item.photoUrl ? { photoUrl: item.photoUrl } : {}),
    });
  }

  return result;
}

function validateImageMeta(
  subject: string,
  meta: Partial<SpeciesImageMeta>,
  issues: SpeciesImageAuditIssue[],
): void {
  const requiredText: Array<keyof Pick<SpeciesImageMeta, "title" | "src" | "filePage" | "author" | "license">> = [
    "title",
    "src",
    "filePage",
    "author",
    "license",
  ];
  for (const field of requiredText) {
    if (typeof meta[field] !== "string" || !meta[field]!.trim()) {
      issues.push({ severity: "error", code: "missing-image-metadata", subject, message: `${field} is required.` });
    }
  }
  if (meta.src && !isHttpsUrl(meta.src) && !isLocalImagePath(meta.src)) {
    issues.push({ severity: "error", code: "invalid-image-url", subject, message: "src must be a valid HTTPS URL or local /images path." });
  }
  if (meta.filePage && !isHttpsUrl(meta.filePage)) {
    issues.push({ severity: "error", code: "invalid-credit-url", subject, message: "filePage must be a valid HTTPS URL." });
  }
  if (meta.license && !/^CC BY(?:-SA)? \d\.\d$/i.test(meta.license)) {
    issues.push({ severity: "error", code: "unsupported-image-license", subject, message: "license must be an approved Creative Commons attribution licence." });
  }
  if (!Number.isFinite(meta.width) || Number(meta.width) <= 0 || !Number.isFinite(meta.height) || Number(meta.height) <= 0) {
    issues.push({ severity: "error", code: "invalid-image-dimensions", subject, message: "width and height must be positive numbers." });
  }
}

function percent(part: number, total: number): number {
  return total === 0 ? 0 : Math.round((part / total) * 10_000) / 100;
}

export function buildSpeciesImageAudit({
  flagshipSpecies,
  flagshipImages,
  extendedImages,
  ebirdSpecies,
  inaturalistSpecies,
}: {
  flagshipSpecies: FlagshipSpecies[];
  flagshipImages: Record<string, SpeciesImageMeta>;
  extendedImages: Record<string, ExtendedSpeciesImageMeta>;
  ebirdSpecies: Record<string, EbirdEntry[]>;
  inaturalistSpecies: Record<string, INaturalistEntry[]>;
}): SpeciesImageAuditReport {
  const issues: SpeciesImageAuditIssue[] = [];
  const flagshipSlugs = new Set(flagshipSpecies.map((item) => item.slug));

  for (const species of flagshipSpecies) {
    const meta = flagshipImages[species.slug];
    if (!meta) {
      issues.push({ severity: "error", code: "missing-flagship-image", subject: species.slug, message: "Flagship species has no curated image." });
    } else {
      validateImageMeta(species.slug, meta, issues);
    }
  }
  for (const slug of Object.keys(flagshipImages)) {
    if (!flagshipSlugs.has(slug)) {
      issues.push({ severity: "error", code: "orphan-flagship-image", subject: slug, message: "Image key does not match a flagship species slug." });
    }
  }

  const extended = buildSpeciesImageCandidates(flagshipSpecies, ebirdSpecies, inaturalistSpecies);
  const extendedBySlug = new Map(extended.map((item) => [item.slug, item]));
  for (const [slug, meta] of Object.entries(extendedImages)) {
    const species = extendedBySlug.get(slug);
    if (!species) {
      issues.push({ severity: "error", code: "orphan-extended-image", subject: slug, message: "Image key does not match a canonical extended species slug." });
      continue;
    }
    validateImageMeta(slug, meta, issues);
    if (isLocalImagePath(meta.src) && (!meta.sourceAsset || !isHttpsUrl(meta.sourceAsset))) {
      issues.push({ severity: "error", code: "missing-source-asset", subject: slug, message: "Locally cached images require their original HTTPS sourceAsset." });
    }
    if (!meta.scientificName?.trim()) {
      issues.push({ severity: "error", code: "missing-scientific-name", subject: slug, message: "scientificName is required." });
    } else if (meta.scientificName.trim().toLowerCase() !== species.scientificName.toLowerCase()) {
      issues.push({ severity: "error", code: "scientific-name-mismatch", subject: slug, message: `Expected ${species.scientificName}.` });
    }
    if (!meta.source || !["Wikimedia Commons", "iNaturalist", "Other"].includes(meta.source)) {
      issues.push({ severity: "error", code: "missing-image-source", subject: slug, message: "source is required." });
    }
  }

  for (const species of extended) {
    if (species.photoUrl && !isHttpsUrl(species.photoUrl)) {
      issues.push({ severity: "error", code: "invalid-legacy-photo-url", subject: species.slug, message: "Citizen-science photoUrl must be a valid HTTPS URL." });
    }
  }

  const flagshipWithImage = flagshipSpecies.filter((item) => Boolean(flagshipImages[item.slug])).length;
  const extendedWithLicensedImage = extended.filter((item) => Boolean(extendedImages[item.slug])).length;
  const extendedLegacyOnly = extended.filter((item) => !extendedImages[item.slug] && Boolean(item.photoUrl)).length;
  const attributableLicensed = flagshipWithImage + extendedWithLicensedImage;
  const total = flagshipSpecies.length + extended.length;
  const designedFallbackRequired = total - attributableLicensed - extendedLegacyOnly;

  if (extendedLegacyOnly > 0) {
    issues.push({
      severity: "warning",
      code: "legacy-photos-without-attribution",
      subject: "extended-species",
      message: `${extendedLegacyOnly} displayed citizen-science photos have URLs but no author, license, or source-page metadata.`,
    });
  }

  return {
    catalog: {
      flagship: flagshipSpecies.length,
      extended: extended.length,
      total,
      extendedBirds: extended.filter((item) => item.source === "eBird").length,
      extendedOtherAnimals: extended.filter((item) => item.source === "iNaturalist").length,
    },
    coverage: {
      attributableLicensed,
      legacyRemoteWithoutAttribution: extendedLegacyOnly,
      designedFallbackRequired,
      displayablePercent: percent(attributableLicensed + extendedLegacyOnly, total),
      attributablePercent: percent(attributableLicensed, total),
    },
    manifests: {
      flagshipEntries: Object.keys(flagshipImages).length,
      extendedEntries: Object.keys(extendedImages).length,
    },
    issues,
  };
}
