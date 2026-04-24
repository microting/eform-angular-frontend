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

await page.goto(BASE + '/login');
await page.fill('input[name="username"]', USER);
await page.fill('input[name="password"]', PASS);
await page.click('button:has-text("Login")');
await page.waitForURL((u) => !u.toString().includes('/login'), { timeout: 30000 });

for (const p of pages) {
  try {
    await page.goto(BASE + p.url);
    await page.waitForLoadState('networkidle');
    if (mode === 'dark') {
      await page.evaluate(() => {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
      });
      await page.waitForTimeout(300);
    }
    if (p.open === 'tags-dropdown') {
      await page.click('ng-select[formcontrolname="tagIds"]', { timeout: 5000 });
      await page.waitForTimeout(300);
    } else if (p.open === 'first-row-delete') {
      await page.click('table tbody tr:first-child button[mattooltip*="Delete"]', { timeout: 5000 });
      await page.waitForTimeout(300);
    }
    await page.waitForTimeout(500); // settle animations
    const file = path.join(outDir, `${p.name}__${mode}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log('captured', file);
  } catch (e) {
    console.error(`SKIP ${p.name}: ${e.message.split('\n')[0]}`);
  }
}

await browser.close();
