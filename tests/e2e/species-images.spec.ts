import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`licensed extended images and designed fallbacks render at ${viewport.name} size`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/species");

    const search = page.getByPlaceholder("Species or scientific name");
    await search.fill("Red-vented Bulbul");
    const licensedCard = page.locator("article").filter({ hasText: "Red-vented Bulbul" }).first();
    await expect(licensedCard).toBeVisible();
    await expect(licensedCard.locator('[data-species-image-kind="licensed"]')).toBeVisible();

    await search.fill("Indian Pond-Heron");
    const fallbackCard = page.locator("article").filter({ hasText: "Indian Pond-Heron" }).first();
    await expect(fallbackCard).toBeVisible();
    await expect(fallbackCard.locator('[data-species-image-kind="fallback"]')).toBeVisible();
    await fallbackCard.scrollIntoViewIfNeeded();
    const fallbackScreenshotPath = testInfo.outputPath(`species-fallback-${viewport.name}.png`);
    await page.screenshot({ path: fallbackScreenshotPath });
    await testInfo.attach(`species-fallback-${viewport.name}`, { path: fallbackScreenshotPath, contentType: "image/png" });

    await search.fill("Red-vented Bulbul");
    await licensedCard.getByRole("link", { name: /Open field guide/ }).click();
    await expect(page).toHaveURL(/\/species\/red-vented-bulbul$/);
    const heroImage = page.locator('[data-species-image-kind="licensed"]');
    await expect(heroImage).toBeVisible();
    await expect(heroImage.locator("img")).toHaveAttribute("src", "/images/species/extended/red-vented-bulbul.webp");
    const credit = heroImage.getByRole("link", { name: /K\. Hari Krishnan · CC BY-SA 3\.0/ });
    await expect(credit).toHaveAttribute("href", /commons\.wikimedia\.org\/wiki\/File/);

    const screenshotPath = testInfo.outputPath(`species-image-pilot-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath });
    await testInfo.attach(`species-image-pilot-${viewport.name}`, { path: screenshotPath, contentType: "image/png" });
  });
}
