// Usage: node capture.mjs <output-dir> [--mode=light|dark]
// Reads pages.json, logs in, navigates each page, captures full-page PNG.

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const outDir = args[0];
const mode = (args.find(a => a.startsWith('--mode=')) || '--mode=light').split('=')[1];
if (!outDir) { console.error('output dir required'); process.exit(1); }
fs.mkdirSync(outDir, { recursive: true });

const pages = JSON.parse(fs.readFileSync(new URL('./pages.json', import.meta.url)));

const BASE = process.env.E2E_BASE_URL || 'http://localhost:4200';
const USER = process.env.E2E_USER || 'admin@admin.com';
const PASS = process.env.E2E_PASS || 'secretpassword';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
const page = await ctx.newPage();

// Login
await page.goto(BASE + '/auth', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);

// Hide any overlay spinners that block clicks
await page.evaluate(() => {
  document.querySelectorAll('.overlay-spinner').forEach(el => el.style.display = 'none');
});

await page.fill('input[name="username"]', USER);
await page.fill('input[name="password"]', PASS);
await page.click('#loginBtn');
await page.waitForURL((u) => {
  const p = new URL(u).pathname;
  return p !== '/auth' && p !== '/login';
}, { timeout: 30000 });
await page.waitForTimeout(2000);
console.log('logged in, current URL:', page.url());

if (mode === 'dark') {
  await page.goto(BASE + '/account-management/settings', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  await page.click('mat-checkbox[formcontrolname="darkTheme"]');
  await page.waitForTimeout(1000);
}

for (const p of pages) {
  await page.goto(BASE + p.url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(3000);

  // Hide spinners before interaction/capture
  await page.evaluate(() => {
    document.querySelectorAll('.overlay-spinner').forEach(el => el.style.display = 'none');
  });

  if (p.open === 'tags-dropdown') {
    const ngSelect = await page.$('ng-select');
    if (ngSelect) {
      await ngSelect.click();
      await page.waitForTimeout(500);
    } else {
      console.log('  skip: no ng-select found on', p.url);
    }
  } else if (p.open === 'first-row-delete') {
    const deleteBtn = await page.$('table tbody tr:first-child button[mattooltip*="Delete"]');
    if (deleteBtn) {
      await deleteBtn.click();
      await page.waitForTimeout(500);
    } else {
      console.log('  skip: no delete button found on', p.url);
    }
  }

  await page.waitForTimeout(500);
  const file = path.join(outDir, `${p.name}__${mode}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('captured', file);
}

await browser.close();
