export type SpeciesImageInventoryStatus =
  | "review-ready"
  | "no-exact-taxon"
  | "no-primary-image"
  | "unsupported-license"
  | "incomplete-metadata";

export type SpeciesImageInventoryInput = {
  hasExactTaxon: boolean;
  hasPrimaryImage: boolean;
  license?: string;
  author?: string;
  imageUrl?: string;
  filePage?: string;
  width?: number;
  height?: number;
};

export type SpeciesImageInventorySummary = Record<SpeciesImageInventoryStatus, number> & {
  total: number;
};

export const speciesImageInventoryStatuses: SpeciesImageInventoryStatus[] = [
  "review-ready",
  "no-exact-taxon",
  "no-primary-image",
  "unsupported-license",
  "incomplete-metadata",
];

export function isApprovedSpeciesImageLicense(license: string | undefined): boolean {
  return Boolean(license && /^CC BY(?:-SA)? \d\.\d$/i.test(license.trim()));
}

export function classifySpeciesImageInventory(input: SpeciesImageInventoryInput): SpeciesImageInventoryStatus {
  if (!input.hasExactTaxon) return "no-exact-taxon";
  if (!input.hasPrimaryImage) return "no-primary-image";
  if (!isApprovedSpeciesImageLicense(input.license)) return "unsupported-license";
  if (
    !input.author?.trim()
    || !input.imageUrl?.startsWith("https://")
    || !input.filePage?.startsWith("https://")
    || !Number.isFinite(input.width)
    || !Number.isFinite(input.height)
    || (input.width ?? 0) <= 0
    || (input.height ?? 0) <= 0
  ) {
    return "incomplete-metadata";
  }
  return "review-ready";
}

export function summarizeSpeciesImageInventory(
  items: Array<{ status: SpeciesImageInventoryStatus }>,
): SpeciesImageInventorySummary {
  const summary: SpeciesImageInventorySummary = {
    total: items.length,
    "review-ready": 0,
    "no-exact-taxon": 0,
    "no-primary-image": 0,
    "unsupported-license": 0,
    "incomplete-metadata": 0,
  };
  for (const item of items) summary[item.status] += 1;
  return summary;
}
