import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "wide-desktop", width: 2048, height: 1152 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 },
]) {
  test(`selected map card stays fully accessible at ${viewport.name} size`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/map");
    if (viewport.width < 1024) await page.getByRole("button", { name: /Field index/ }).click();
    await page.locator('button[data-hotspot-slug="dudhwa-national-park"]').click();

    const card = page.locator('article[aria-live="polite"]');
    await expect(card).toBeVisible();
    await expect(card.getByRole("heading", { level: 2, name: "Dudhwa National Park" })).toBeVisible();
    await expect(page).toHaveURL(/place=dudhwa-national-park/);
    await page.waitForTimeout(300);
    if (viewport.width >= 1024) await card.scrollIntoViewIfNeeded();

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
      clientWidth: element.clientWidth,
      scrollHeight: element.scrollHeight,
      scrollWidth: element.scrollWidth,
    }));

    const footerBox = await page.locator("footer").boundingBox();
    const mainBox = await page.locator("main.atlas-map-page").boundingBox();
    const fieldGuide = card.getByRole("link", { name: /Open field guide/ });
    const fieldGuideBox = await fieldGuide.boundingBox();
    expect(footerBox).not.toBeNull();
    expect(mainBox).not.toBeNull();
    expect(fieldGuideBox).not.toBeNull();
    expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(footerBox!.y + 1);
    expect(overflow.scrollHeight).toBeLessThanOrEqual(overflow.clientHeight + 1);
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth + 1);
    expect(fieldGuideBox!.x + fieldGuideBox!.width).toBeLessThanOrEqual(cardBox!.x + cardBox!.width + 1);
    expect(Math.abs(footerBox!.y - (mainBox!.y + mainBox!.height))).toBeLessThanOrEqual(1);
    if (viewport.width >= 1024) {
      expect(cardBox!.y).toBeGreaterThanOrEqual(-2);
      expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(viewport.height + 2);
    } else {
      await fieldGuide.scrollIntoViewIfNeeded();
      const visibleFieldGuideBox = await fieldGuide.boundingBox();
      expect(visibleFieldGuideBox).not.toBeNull();
      expect(visibleFieldGuideBox!.y).toBeGreaterThanOrEqual(-2);
      expect(visibleFieldGuideBox!.y + visibleFieldGuideBox!.height).toBeLessThanOrEqual(viewport.height + 2);
    }

    const screenshotPath = testInfo.outputPath(`map-preview-${viewport.name}.png`);
    await page.screenshot({ path: screenshotPath });
    await testInfo.attach(`map-preview-${viewport.name}`, {
      path: screenshotPath,
      contentType: "image/png",
    });
  });
}
