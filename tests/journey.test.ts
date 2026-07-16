import test from "node:test";
import assert from "node:assert/strict";
import { addJourneyVisit, JOURNEY_LIMIT, type JourneyEntry } from "../lib/journey.ts";

test("a revisit moves an encounter to the front without duplicating it", () => {
  const entries: JourneyEntry[] = [
    { id: "species:bengal-tiger", type: "species", slug: "bengal-tiger", viewedAt: "2026-07-14T00:00:00.000Z" },
    { id: "hotspot:kaziranga-national-park", type: "hotspot", slug: "kaziranga-national-park", viewedAt: "2026-07-13T00:00:00.000Z" },
  ];
  const next = addJourneyVisit(entries, "hotspot", "kaziranga-national-park", "2026-07-16T00:00:00.000Z");
  assert.deepEqual(next.map((entry) => entry.id), ["hotspot:kaziranga-national-park", "species:bengal-tiger"]);
  assert.equal(next[0].viewedAt, "2026-07-16T00:00:00.000Z");
});

test("the expedition trail keeps only the latest encounters", () => {
  let entries: JourneyEntry[] = [];
  for (let index = 0; index < JOURNEY_LIMIT + 3; index += 1) entries = addJourneyVisit(entries, "species", `species-${index}`, `2026-07-${String(index + 1).padStart(2, "0")}T00:00:00.000Z`);
  assert.equal(entries.length, JOURNEY_LIMIT);
  assert.equal(entries[0].slug, `species-${JOURNEY_LIMIT + 2}`);
  assert.equal(entries.at(-1)?.slug, "species-3");
});
