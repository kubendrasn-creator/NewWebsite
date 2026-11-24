import { test, expect } from '@playwright/test';

const ROUTES = [
  './',
  'services/',
  'why-apt/',
  'about/',
  'careers/',
  'contact/',
];

test.describe('Apt Infosoft Verification Suite', () => {

  test('All routes load without console errors and without hashes in URL', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    for (const route of ROUTES) {
      await page.goto(route);
      await expect(page).toHaveURL(/NewWebsite\/([a-z0-9\-_/]*)$/);
      expect(page.url()).not.toContain('#');
      
      const h1 = page.locator('main h1, h1').first();
      await expect(h1).toBeVisible();
    }

    // Filter out expected or benign network/favicon warnings if any
    const realErrors = consoleErrors.filter(e => !e.includes('favicon') && !e.includes('Failed to load resource: the server responded with a status of 404'));
    expect(realErrors).toHaveLength(0);
  });

  test('Hero section and innovation badge have sufficient clearance below header', async ({ page }) => {
    await page.goto('./');
    const header = page.locator('#site-header');
    await expect(header).toBeVisible();
    const headerBox = await header.boundingBox();
    expect(headerBox).not.toBeNull();

    const badge = page.locator('text=Tailored Software Solutions').first();
    await expect(badge).toBeVisible();
    const badgeBox = await badge.boundingBox();
    expect(badgeBox).not.toBeNull();

    // Badge top must be at least 15px below the bottom of the floating header
    const headerBottom = headerBox!.y + headerBox!.height;
    expect(badgeBox!.y).toBeGreaterThan(headerBottom + 15);
  });

  test('About accordion cards: independent expansion and 0px leakage when closed', async ({ page }) => {
    await page.goto('about/');
    
    // Check all 4 panels are initially collapsed and hidden
    const toggles = page.locator('.benefit-card-toggle');
    expect(await toggles.count()).toBe(4);

    for (let i = 0; i < 4; i++) {
      const toggle = toggles.nth(i);
      const isExpanded = await toggle.getAttribute('aria-expanded');
      expect(isExpanded).toBe('false');

      const panelId = await toggle.getAttribute('aria-controls');
      expect(panelId).not.toBeNull();
      const panel = page.locator(`#${panelId}`);
      // Panel must be hidden (display: none or 0 height)
      await expect(panel).toBeHidden();
    }

    const getDocY = async (loc: any) => {
      const box = await loc.boundingBox();
      const scrollY = await page.evaluate(() => window.scrollY);
      return box ? box.y + scrollY : 0;
    };

    // Scroll into view first so no auto-scroll interferes
    const toggleA = toggles.nth(0);
    const cardB = toggles.nth(1);
    await toggleA.scrollIntoViewIfNeeded();

    const yBBefore = await getDocY(cardB);

    // Click Card A
    const panelIdA = await toggleA.getAttribute('aria-controls');
    expect(panelIdA).not.toBeNull();
    const panelA = page.locator(`#${panelIdA}`);

    await toggleA.click();
    await expect(toggleA).toHaveAttribute('aria-expanded', 'true');
    await expect(panelA).toBeVisible();

    // In a multi-column CSS grid with items-start, Card B height or y-position does not shift
    const yBAfter = await getDocY(cardB);
    expect(Math.abs(yBAfter - yBBefore)).toBeLessThanOrEqual(1);

    // Keyboard support: Pressing Escape on Card A closes it
    await toggleA.focus();
    await page.keyboard.press('Escape');
    await expect(toggleA).toHaveAttribute('aria-expanded', 'false');
    await expect(panelA).toBeHidden();
  });

  test('Pause Motion toggle stops animations and persists state in sessionStorage', async ({ page }) => {
    await page.goto('./');
    const pauseBtn = page.locator('#pause-motion-toggle');
    await expect(pauseBtn).toBeVisible();
    await expect(pauseBtn).toHaveText('Pause motion');

    await pauseBtn.click();
    await expect(pauseBtn).toHaveText('Resume motion');
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');

    // Verify sessionStorage persistence
    const storedState = await page.evaluate(() => sessionStorage.getItem('apt_motion_paused'));
    expect(storedState).toBe('true');

    // Click resume
    await pauseBtn.click();
    await expect(pauseBtn).toHaveText('Pause motion');
    await expect(page.locator('html')).not.toHaveAttribute('data-motion');
  });

  test('Click-to-copy button copies phone/email and announces via aria-live toast', async ({ page }) => {
    await page.goto('contact/');
    const copyBtn = page.locator('.click-to-copy-btn').first();
    await expect(copyBtn).toBeVisible();

    // Grant clipboard permissions on chromium
    if (page.context().browser()?.browserType().name() === 'chromium') {
      try {
        await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      } catch (e) {}
    }

    await copyBtn.click();
    const toast = page.locator('#a11y-toast');
    await expect(toast).toContainText('Copied');
  });

  test('Careers role cards show only designated opening status and mailto button', async ({ page }) => {
    await page.goto('careers/');
    const noDev = page.locator('text=No Openings in Development');
    const noTest = page.locator('text=No Openings in Testing');
    await expect(noDev).toBeVisible();
    await expect(noTest).toBeVisible();

    const mailtoBtn = page.locator('a[href^="mailto:info@aptinfosoft.com?subject=Resume"]').first();
    await expect(mailtoBtn).toBeVisible();
    await expect(mailtoBtn).toHaveText('Send your resume');
  });

  test('Footer displays correct copyright range © 2017–{current build year}', async ({ page }) => {
    await page.goto('./');
    const footer = page.locator('footer');
    const currentYear = new Date().getFullYear();
    await expect(footer).toContainText(`© 2017–${currentYear} Apt Infosoft`);
  });

});
