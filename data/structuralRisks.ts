export type StructuralRisk = {
  slug: string;
  kind: "multi-jurisdiction" | "split-authority" | "access-restricted" | "informal-pa" | "sparse-documentation" | "restricted-marine-zone";
  summary: string;
  detail: string;
  sourceName?: string;
  sourceUrl?: string;
  lastVerified: string;
};

// Separate from data/closures.ts on purpose: these five hotspots' real complexity is
// structural (jurisdiction, authority, or access status), not seasonal, so squeezing them
// into a closesSeasonally/note shape would understate what a visitor actually needs to know.
// sourceUrl is left unset everywhere here — same rule as closures.ts, never fabricated.
export const structuralRisks: Record<string, StructuralRisk> = {
  "chambal-river-sanctuary": {
    slug: "chambal-river-sanctuary",
    kind: "multi-jurisdiction",
    summary: "This sanctuary spans three states with no single managing authority.",
    detail: "The National Chambal Sanctuary crosses Rajasthan, Madhya Pradesh, and Uttar Pradesh and isn't run by one single forest department. Because of that, the closure and permit information on this page should be treated as lower-confidence than for a single-state park — always confirm with whichever state's stretch of river you actually plan to visit.",
    lastVerified: "2026-07-07",
  },
  "chilika-lake": {
    slug: "chilika-lake",
    kind: "split-authority",
    summary: "Chilika Lake is managed by the Chilika Development Authority, not a state Forest Department.",
    detail: "Unlike the other Odisha hotspots in this atlas, which are governed by the Odisha Forest Department, Chilika Lake falls under the Chilika Development Authority. Sourcing patterns (permit portals, closure notification style) that apply to Forest-Department-run parks elsewhere in this dataset don't necessarily carry over here.",
    lastVerified: "2026-07-07",
  },
  "sundarbans-national-park": {
    slug: "sundarbans-national-park",
    kind: "split-authority",
    summary: "Sundarbans sits under overlapping Forest Department, Biosphere Reserve, and Tiger Reserve jurisdiction.",
    detail: "Different sub-areas of the Sundarbans landscape can fall under different rules depending on which designation governs that specific zone. Treat any single closure or permit rule sourced for this listing as a general guide rather than something that necessarily applies uniformly across the whole landscape.",
    lastVerified: "2026-07-07",
  },
  "kuno-national-park": {
    slug: "kuno-national-park",
    kind: "split-authority",
    summary: "Kuno is governed by the state Forest Department alongside national Project Cheetah oversight.",
    detail: "Cheetah-related access rules and safari-zone restrictions may originate from the national Project Cheetah program rather than the Madhya Pradesh Forest Department alone. Confirm current cheetah-safari-zone rules specifically — they can change independently of general park policy.",
    lastVerified: "2026-07-07",
  },
  "indravati-national-park": {
    slug: "indravati-national-park",
    kind: "access-restricted",
    summary: "General tourism to Indravati is not currently bookable or visitable.",
    detail: "Access has been effectively closed to general tourism for years on security grounds in this part of Bastar, Chhattisgarh. This listing is kept for reference, not as a travel recommendation — do not plan a trip here based on the rest of this page without independently confirming current access status with the Chhattisgarh Forest Department first.",
    lastVerified: "2026-07-07",
  },
  "hemis-national-park": {
    slug: "hemis-national-park",
    kind: "sparse-documentation",
    summary: "Hemis is remote and high-altitude, with far less online documentation than other parks in this atlas.",
    detail: "Hemis sits in the trans-Himalayan cold desert of Ladakh, and permit rules, road access, and closure timing — particularly around snow-leopard viewing season and winter weather — are far less consistently documented online than for lowland parks. Treat anything on this page beyond the basics as a starting point rather than a confirmed fact, and verify current permit and safety guidance directly with the Ladakh Wildlife Department or a local operator before planning around it, especially for a winter visit.",
    lastVerified: "2026-07-09",
  },
  "rushikulya-rookery": {
    slug: "rushikulya-rookery",
    kind: "informal-pa",
    summary: "Rushikulya is a seasonal turtle-nesting beach, not a formally boundaried visitor park.",
    detail: "Rushikulya Rookery is one of the world's major Olive Ridley mass-nesting sites, but unlike the tiger reserves and national parks elsewhere in this atlas, it isn't a single legally boundaried protected area with dedicated visitor infrastructure. Access and viewing arrangements are locally coordinated — often by village-level turtle-protection groups alongside the Odisha Forest Department — around the nesting season (typically Jan–Mar) and can vary from year to year. Confirm current arrangements locally before visiting.",
    lastVerified: "2026-07-09",
  },
  "gahirmatha-marine-sanctuary": {
    slug: "gahirmatha-marine-sanctuary",
    kind: "restricted-marine-zone",
    summary: "Gahirmatha is a marine sanctuary with seasonally restricted boat access, not a park you tour freely.",
    detail: "Gahirmatha Marine Wildlife Sanctuary protects the world's largest Olive Ridley nesting rookery, and general boat access into the core nesting zone is restricted — especially during the Nov–May nesting and hatching season — and enforced jointly by the Odisha Forest Department and Coast Guard. This is different from Indravati's blanket tourism closure: Gahirmatha can be visited with the right permits and timing, but don't assume open boat access without confirming current rules first.",
    lastVerified: "2026-07-09",
  },
};
