import assert from "node:assert/strict";
import test from "node:test";
import { hotspots } from "../data/hotspots.ts";
import { recommendationsFor, seasonForMonth, speciesForRecommendations } from "../lib/seasonalPlanner.ts";
import { species } from "../data/species.ts";
import { MONTHS } from "../lib/seasonalPlanner.ts";

test("maps every month to a season", () => {
  assert.equal(seasonForMonth("Jan"), "Winter");
  assert.equal(seasonForMonth("Jul"), "Monsoon");
  assert.equal(seasonForMonth("Oct"), "Post-monsoon");
});

test("filters seasonal recommendations by region and experience", () => {
  const results = recommendationsFor(hotspots, "Nov", "Northeast", "Safari");
  assert.ok(results.length > 0);
  assert.ok(results.every((item) => item.bestMonths.includes("Nov") && item.region === "Northeast" && item.experienceTags.includes("Safari")));
});

test("resolves a unique flagship species set for a trail", () => {
  const matches = recommendationsFor(hotspots, "Nov", "All regions", "All experiences");
  const resolved = speciesForRecommendations(matches, species, 4);
  assert.ok(resolved.length > 0 && resolved.length <= 4);
  assert.equal(new Set(resolved.map((item) => item.slug)).size, resolved.length);
});

test("keeps every month discoverable in the unfiltered planner", () => {
  for (const month of MONTHS) assert.ok(recommendationsFor(hotspots, month, "All regions", "All experiences").length > 0, `${month} should have at least one recommendation`);
});
