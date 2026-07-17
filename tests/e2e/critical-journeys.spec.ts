import { expect, test } from "@playwright/test";

const seededJournal = [
  {
    id: "species:bengal-tiger",
    type: "species",
    slug: "bengal-tiger",
    note: "Keep this field note",
    savedAt: "2026-07-01T00:00:00.000Z",
  },
  {
    id: "hotspot:jim-corbett-national-park",
    type: "hotspot",
    slug: "jim-corbett-national-park",
    note: "",
    savedAt: "2026-07-01T00:00:00.000Z",
  },
];

const seededJourney = [
  {
    id: "hotspot:jim-corbett-national-park",
    type: "hotspot",
    slug: "jim-corbett-national-park",
    viewedAt: "2026-07-01T00:00:00.000Z",
  },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(
    ({ journal, journey }) => {
      localStorage.setItem("wia-field-journal-v1", JSON.stringify(journal));
      localStorage.setItem("wia-expedition-trail-v1", JSON.stringify(journey));
    },
    { journal: seededJournal, journey: seededJourney },
  );
});

test("fresh visitors receive the regular homepage hero without a descent gate", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { level: 1, name: "Explore India's wild side." });
  await expect(heading).toBeVisible();
  await expect(page.getByText("Scroll to enter the atlas")).toHaveCount(0);

  const hero = heading.locator("xpath=ancestor::section[1]");
  const heroBox = await hero.boundingBox();
  const viewport = page.viewportSize();
  expect(heroBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(heroBox!.height).toBeLessThan(viewport!.height * 1.5);

  const descentPreference = await page.evaluate(() => localStorage.getItem("wia-descent-seen"));
  expect(descentPreference).toBeNull();
});

test("homepage search reaches a species profile", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Explore India's wild side." })).toBeVisible();
  const search = page.getByRole("combobox", { name: "Search the wildlife atlas" });
  await search.fill("Bengal Tiger");
  await expect(page.getByRole("listbox", { name: "Atlas suggestions" })).toBeVisible();
  await search.press("ArrowDown");
  await search.press("Enter");

  await expect(page).toHaveURL(/\/species\/bengal-tiger$/);
  await expect(page.getByRole("heading", { level: 1, name: "Bengal Tiger" })).toBeVisible();
});

test("map deep link reveals the requested hotspot", async ({ page }) => {
  await page.goto("/map?place=jim-corbett-national-park");

  await expect(page.getByRole("heading", { level: 1, name: "Read the wild from above." })).toBeVisible();
  await expect(page.locator('article[aria-live="polite"]').getByText("Jim Corbett National Park", { exact: true })).toBeVisible();
  await expect(page).toHaveURL(/place=jim-corbett-national-park/);
});

test("hotspot and species detail routes retain their public headings", async ({ page }) => {
  await page.goto("/hotspots/jim-corbett-national-park");
  await expect(page.getByRole("heading", { level: 1, name: "Jim Corbett National Park" })).toBeVisible();

  await page.goto("/species/bengal-tiger");
  await expect(page.getByRole("heading", { level: 1, name: "Bengal Tiger" })).toBeVisible();
});

test("listing filters remain sticky in the desktop grid", async ({ page }) => {
  await page.goto("/hotspots");
  await expect(page.locator('section[aria-label="Destination observation lens"]')).toHaveCSS("position", "sticky");

  await page.goto("/species");
  await expect(page.locator('section[aria-label="Species observation lens"]')).toHaveCSS("position", "sticky");
});

test("seasonal planner filters remain shareable in the URL", async ({ page }) => {
  await page.goto("/seasonal-planner");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.getByLabel("Filter by region").selectOption("South");
  await page.getByLabel("Filter by experience").selectOption("Birding");

  await expect(page).toHaveURL(/region=South/);
  await expect(page).toHaveURL(/experience=Birding/);
  await expect(page.getByText("Showing south · birding", { exact: false })).toBeVisible();
});

test("existing journal and trail storage survives hydration and reload", async ({ page }) => {
  await page.goto("/field-journal");

  await expect(page.getByRole("heading", { level: 1, name: "Keep what calls you back." })).toBeVisible();
  await expect(page.locator("article").getByRole("heading", { level: 2, name: "Bengal Tiger" })).toBeVisible();
  await expect(page.locator("article").getByRole("heading", { level: 2, name: "Jim Corbett National Park" })).toBeVisible();
  const seededNote = page.locator('textarea[id="note-species:bengal-tiger"]');
  await expect(seededNote).toHaveValue("Keep this field note");

  await page.reload();
  await expect(seededNote).toHaveValue("Keep this field note");

  const stored = await page.evaluate(() => ({
    journal: JSON.parse(localStorage.getItem("wia-field-journal-v1") ?? "[]"),
    journey: JSON.parse(localStorage.getItem("wia-expedition-trail-v1") ?? "[]"),
  }));
  expect(stored.journal).toEqual(seededJournal);
  expect(stored.journey).toEqual(seededJourney);
});

test("theme preference persists across reload", async ({ page }) => {
  await page.goto("/");

  const toggle = page.getByRole("button", { name: /Switch to (dark|light) mode/ });
  await toggle.click();
  const selectedTheme = await page.evaluate(() => localStorage.getItem("theme"));
  await page.reload();

  const hasDarkClass = await page.locator("html").evaluate((element) => element.classList.contains("dark"));
  expect(hasDarkClass).toBe(selectedTheme === "dark");
});
