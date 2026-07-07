# Re-verification cadence

This is a policy document, not automation — there is no staleness checker yet (see
[VERSION_HISTORY.md](../VERSION_HISTORY.md) for when one might land). It exists so the
re-verification schedule for `data/closures.ts` and `data/structuralRisks.ts` is written down
somewhere real, instead of living only in whoever last touched the file's head.

## Quarterly review

Re-check and, if needed, update `lastVerified`:

- Every `data/closures.ts` entry with `confidence: "unconfirmed"` — these are the entries where
  we didn't find an official notice in the first place, so they're the most likely to have
  changed underneath us without anyone here noticing.
- Every entry in `data/structuralRisks.ts` — jurisdiction, authority, and especially
  `kind: "access-restricted"` status can change (a park can reopen, a program can end), and
  these are exactly the facts where stale information does the most damage to a real trip.

## Yearly review

Re-check and, if needed, update `lastVerified`:

- Every `data/closures.ts` entry with `confidence: "official"` or `confidence: "inferred"` and
  no matching `data/structuralRisks.ts` entry — these are the most stable facts in the dataset
  (a named department order, or a well-documented general pattern), but state forest
  departments do still shift exact closure windows year to year.

## How to do a review pass

1. Re-run the same research approach used to write the entry originally (state forest
   department site / official portal / established travel-industry reporting) — see the
   sourcing notes already in `data/closures.ts` and `data/structuralRisks.ts` for the pattern.
2. If the fact is unchanged, bump `lastVerified` to the date of the check.
3. If the fact has changed, update `note`/`detail` (and `closesSeasonally`/`kind` if the
   underlying situation itself changed) alongside `lastVerified` — don't bump the date without
   re-reading the content.
4. If `confidence` or `sourceName`/`sourceUrl` can now be upgraded (e.g. an unconfirmed park
   turns out to have a real official notice after all), update those too — this is how
   `unconfirmed` entries are meant to graduate to `inferred` or `official` over time.
