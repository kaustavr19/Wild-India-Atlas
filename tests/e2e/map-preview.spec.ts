import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`selected map card stays fully accessible at ${viewport.name} size`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/map");
    if (viewport.width < 1024) await page.getByRole("button", { name: /Field index/ }).click();
    await page.locator('button[data-hotspot-slug="ranthambore-national-park"]').click();

    const card = page.locator('article[aria-live="polite"]');
    await expect(card).toBeVisible();
    await expect(card.getByRole("heading", { level: 2, name: "Ranthambore National Park" })).toBeVisible();
    await expect(page).toHaveURL(/place=ranthambore-national-park/);
    await page.waitForTimeout(300);
    await card.scrollIntoViewIfNeeded();

    const cardBox = await card.boundingBox();
    const mapBox = await page.getByTestId("map-canvas").boundingBox();
    expect(cardBox).not.toBeNull();
    expect(mapBox).not.toBeNull();
    expect(cardBox!.x).toBeGreaterThanOrEqual(mapBox!.x - 1);
    expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(mapBox!.x + mapBox!.width + 1);
    if (viewport.width >= 1024) {
      expect(cardBox!.y).toBeGreaterThanOrEqual(mapBox!.y - 1);
      expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(mapBox!.y + mapBox!.height + 1);
    } else {
      expect(cardBox!.y).toBeGreaterThanOrEqual(mapBox!.y + mapBox!.height - 1);
    }

    const overflow = await card.evaluate((element) => ({
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    }));
    expect(cardBox!.y).toBeGreaterThanOrEqual(-2);
    expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(viewport.height + 2);

    const footerBox = await page.locator("footer").boundingBox();
    expect(footerBox).not.toBeNull();
    expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(footerBox!.y + 1);
    expect(overflow.scrollHeight).toBeLessThanOrEqual(overflow.clientHeight + 1);

    const screenshotPath = testInfo.outputPath(`map-preview-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath });
    await testInfo.attach(`map-preview-${viewport.name}`, {
      path: screenshotPath,
      contentType: "image/png",
    });
  });
}
