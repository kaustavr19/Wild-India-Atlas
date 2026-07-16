import test from "node:test";
import assert from "node:assert/strict";
import { searchAtlas, type AtlasSearchItem } from "../lib/atlasSearch.ts";

const items: AtlasSearchItem[] = [
  { id: "species:tiger", title: "Bengal Tiger", subtitle: "Mammal", keywords: "forest big cat", href: "/species/tiger", kind: "Species" },
  { id: "place:bandhavgarh", title: "Bandhavgarh Tiger Reserve", subtitle: "Madhya Pradesh · Tiger Reserve", keywords: "sal forest", href: "/hotspots/bandhavgarh", kind: "Place" },
  { id: "place:corbett", title: "Jim Corbett National Park", subtitle: "Uttarakhand · Tiger Reserve", keywords: "sal forest tiger", href: "/hotspots/corbett", kind: "Place" },
  { id: "place:kaziranga", title: "Kaziranga National Park", subtitle: "Assam · National Park", keywords: "floodplain rhino", href: "/hotspots/kaziranga", kind: "Place" },
];

test("atlas search ranks title matches before keyword matches", () => {
  assert.deepEqual(searchAtlas(items, "tiger").map((item) => item.id), ["species:tiger", "place:bandhavgarh", "place:corbett"]);
});

test("atlas search finds places through habitat and wildlife keywords", () => {
  assert.equal(searchAtlas(items, "rhino")[0]?.id, "place:kaziranga");
  assert.deepEqual(searchAtlas(items, "   "), []);
});
