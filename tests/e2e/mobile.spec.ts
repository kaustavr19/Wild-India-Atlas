import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("wia-descent-seen", "1"));
});

for (const listing of [
  {
    path: "/hotspots",
    lens: "Destination observation lens",
    resultsHeading: "Places worth knowing slowly.",
    resultsSection: "destination-results-title",
  },
  {
    path: "/species",
    lens: "Species observation lens",
    resultsHeading: "Species worth learning slowly.",
    resultsSection: "species-results-title",
  },
]) {
  test(`${listing.path} filter dock scrolls away on mobile`, async ({ page }, testInfo) => {
    await page.goto(listing.path);

    const lens = page.locator(`section[aria-label="${listing.lens}"]`);
    await expect(lens).toHaveCSS("position", "relative");

    const results = page.getByRole("heading", { level: 2, name: listing.resultsHeading });
    await results.scrollIntoViewIfNeeded();
    await expect(results).toBeVisible();

    const firstCard = page.locator(`section[aria-labelledby="${listing.resultsSection}"] article`).first();
    await firstCard.scrollIntoViewIfNeeded();
    await expect(firstCard).toBeVisible();

    const lensBox = await lens.boundingBox();
    expect(lensBox).not.toBeNull();
    expect(lensBox!.y + lensBox!.height).toBeLessThan(0);

    const screenshotPath = testInfo.outputPath(`${listing.path.slice(1)}-results-unobstructed.png`);
    await page.screenshot({ path: screenshotPath });
    await testInfo.attach(`${listing.path.slice(1)}-results-unobstructed`, {
      path: screenshotPath,
      contentType: "image/png",
    });
  });
}
