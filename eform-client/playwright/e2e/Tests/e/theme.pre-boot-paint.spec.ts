import { test, expect } from '@playwright/test';

// The inline script in index.html paints theme-light/theme-dark on <body> before Angular boots, so no user
// sees the wrong theme first. These specs assert the class at domcontentloaded, i.e. before the app bundle runs.
// No login is needed: the paint depends only on the theme-mode key and the OS colour scheme.
const bodyClassAtDomContentLoaded = async (page) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  return page.evaluate(() => document.body.className);
};

test.describe('Pre-boot theme paint', () => {
  test('stored dark with a light OS paints theme-dark', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'dark'));
    await page.emulateMedia({ colorScheme: 'light' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-dark');
    expect(cls).not.toContain('theme-light');
  });

  test('stored light with a dark OS paints theme-light', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'light'));
    await page.emulateMedia({ colorScheme: 'dark' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-light');
    expect(cls).not.toContain('theme-dark');
  });

  test('stored system with a dark OS paints theme-dark', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'system'));
    await page.emulateMedia({ colorScheme: 'dark' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-dark');
    expect(cls).not.toContain('theme-light');
  });

  test('stored system with a light OS paints theme-light', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('theme-mode', 'system'));
    await page.emulateMedia({ colorScheme: 'light' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-light');
    expect(cls).not.toContain('theme-dark');
  });

  test('no stored key with a dark OS paints theme-dark', async ({ page }) => {
    await page.addInitScript(() => localStorage.removeItem('theme-mode'));
    await page.emulateMedia({ colorScheme: 'dark' });
    const cls = await bodyClassAtDomContentLoaded(page);
    expect(cls).toContain('theme-dark');
    expect(cls).not.toContain('theme-light');
  });
});
