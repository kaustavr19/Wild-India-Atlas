export type StructuralRisk = {
  slug: string;
  kind: "multi-jurisdiction" | "split-authority" | "access-restricted" | "informal-pa";
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
};
