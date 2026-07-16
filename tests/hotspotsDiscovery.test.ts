import assert from "node:assert/strict";
import test from "node:test";
import { hotspots } from "../data/hotspots.ts";
import { ecosystem } from "../data/ecosystems.ts";

const landscapeKeys = ["forest", "wetland", "desert", "alpine", "mangrove", "marine"];

test("maps every hotspot into one discovery landscape", () => {
  assert.equal(Object.keys(ecosystem).length, hotspots.length);
  for (const hotspot of hotspots) assert.ok(landscapeKeys.includes(ecosystem[hotspot.slug]), `${hotspot.name} needs a valid discovery landscape`);
});

test("keeps all six landscape portals populated", () => {
  for (const landscape of landscapeKeys) assert.ok(hotspots.some((hotspot) => ecosystem[hotspot.slug] === landscape), `${landscape} portal should contain a field site`);
});
