import { test, expect } from '@playwright/test';

test.describe('Modernization Remap & Motion Story Verification', () => {
  test('Hero includes verbatim Modernization fragment link', async ({ page }) => {
    await page.goto('./');
    const link = page.locator('#top a', { hasText: 'If legacy technology is holding you back' });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', /\/services\/application-modernization\/?$/);
  });

  test('Modernization Spotlight slider: keyboard, pointer, clip-path, a11y, no layout shift', async ({ page }) => {
    await page.goto('./');
    const spotlight = page.locator('#modernization-spotlight');
    await expect(spotlight).toBeVisible();

    const range = spotlight.locator('input.spotlight-range');
    await expect(range).toBeVisible();
    await expect(range).toHaveAttribute('aria-label', 'Compare legacy and modern');
    await expect(range).toHaveAttribute('aria-valuetext', '50% modern');

    const modernLayer = spotlight.locator('.spotlight-modern-layer');
    const boxBefore = await spotlight.boundingBox();

    // Check initial clip-path at 50%
    const style50 = await spotlight.locator('.spotlight-compare').getAttribute('style');
    expect(style50).toContain('--pos: 50');

    // Keyboard: ArrowRight -> 51%, PageUp -> 61%, Home -> 0%, End -> 100%
    await range.focus();
    await page.keyboard.press('ArrowRight');
    await expect(range).toHaveAttribute('aria-valuetext', '51% modern');

    await page.keyboard.press('PageUp');
    await expect(range).toHaveAttribute('aria-valuetext', '61% modern');

    await page.keyboard.press('Home');
    await expect(range).toHaveAttribute('aria-valuetext', '0% modern');
    const clip0 = await modernLayer.evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip0).toContain('0%');

    await page.keyboard.press('End');
    await expect(range).toHaveAttribute('aria-valuetext', '100% modern');
    const clip100 = await modernLayer.evaluate((el) => getComputedStyle(el).clipPath);
    expect(clip100).toContain('100%');

    // Pointer drag to middle (50%)
    const rBox = await range.boundingBox();
    expect(rBox).not.toBeNull();
    await page.mouse.move(rBox!.x + rBox!.width * 0.25, rBox!.y + rBox!.height / 2);
    await page.mouse.down();
    await page.mouse.move(rBox!.x + rBox!.width * 0.5, rBox!.y + rBox!.height / 2);
    await page.mouse.up();

    // Layout height stability
    const boxAfter = await spotlight.boundingBox();
    expect(Math.abs(boxAfter!.height - boxBefore!.height)).toBeLessThanOrEqual(1);
  });

  test('Scene B scroll story has exactly 4 beats with verbatim captions', async ({ page }) => {
    await page.goto('./');
    const beats = page.locator('#motion-story .motion-beat-row');
    await expect(beats).toHaveCount(4);

    const expectedCaptions = [
      'No two businesses are alike.',
      'We help companies build products from concept to commercialization.',
      'Our onsite-offshore delivery model ensures cost, time and delivery efficiency across time zones.',
      'Reliable, repeatable, timely and comprehensive testing is a must for the successful implementation of any software product or application.',
    ];

    for (let i = 0; i < 4; i++) {
      const text = (await beats.nth(i).locator('.kinetic-caption').textContent()) || '';
      expect(text.replace(/\s+/g, ' ').trim()).toBe(expectedCaptions[i]);
    }
  });

  test('Services Bento layout and original numerals at 1024, 1280, 1440', async ({ page }) => {
    for (const width of [1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('./');

      const modTile = page.locator('.bento-tile-modernization');
      const appDevTile = page.locator('.bento-tile-appdev');
      const standardTile = page.locator('.bento-tile-standard').first();

      await expect(modTile).toHaveAttribute('data-service-numeral', '04');
      await expect(appDevTile).toHaveAttribute('data-service-numeral', '02');

      const modBox = await modTile.boundingBox();
      const appDevBox = await appDevTile.boundingBox();
      const stdBox = await standardTile.boundingBox();

      expect(modBox!.height).toBeGreaterThan(stdBox!.height * 1.3);
      expect(appDevBox!.width).toBeGreaterThan(stdBox!.width * 1.5);
    }
  });

  test('Contact page uses Motion Delivery section and has no live clocks', async ({ page }) => {
    await page.goto('contact/');
    await expect(page.locator('#contact-delivery-stage svg')).toBeVisible();
    await expect(page.locator('text=Your time')).toHaveCount(0);
  });

  test('Application Modernization page renders static Modern hero and interactive comparison', async ({ page }) => {
    await page.goto('services/application-modernization/');
    await expect(page.locator('[aria-label="Modernized application architecture"] svg')).toBeVisible();
    await expect(page.locator('#modernization-spotlight input.spotlight-range')).toBeVisible();
  });
});
