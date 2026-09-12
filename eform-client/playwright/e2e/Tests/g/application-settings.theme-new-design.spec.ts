import { test, expect, Locator, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { DeviceUsersPage } from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../helper-functions';

// Regression test for the "eForm new design" restyle of the `workspace` theme
// variant (UI label formerly "Google Workspace").
//
// The persisted theme setting is shared with every other spec in the shard, so it
// is never changed here: the seeded default (eform) is loaded and the body class is
// flipped client-side, which is exactly what AppComponent.applyThemeVariant()
// would produce for a persisted `workspace` variant.

const firstName = generateRandmString(8);
const lastName = generateRandmString(8);
const siteName = `${firstName} ${lastName}`;

async function applyNewDesignTheme(page: Page) {
  await page.evaluate(() => {
    const body = document.body;
    body.classList.remove('theme-eform', 'theme-dark');
    body.classList.add('theme-workspace', 'theme-light');
  });
  await expect(page.locator('body')).toHaveClass(/\btheme-workspace\b/);
  await expect(page.locator('body')).toHaveClass(/\btheme-light\b/);
}

function computedStyle(locator: Locator, property: string): Promise<string> {
  return locator.evaluate(
    (el, prop) => getComputedStyle(el).getPropertyValue(prop),
    property
  );
}

test.describe.serial('Theme "eForm new design" (workspace variant)', () => {
  test.describe.configure({ timeout: 240_000 });

  let page: Page;
  let myEformsPage: MyEformsPage;
  let deviceUsersPage: DeviceUsersPage;
  let deviceUserCreated = false;

  const grid = () => page.locator('app-sites .mtx-grid');
  const firstHeaderCell = () => grid().locator('th.mat-mdc-header-cell').first();
  // The row of the site created in beforeAll - guaranteed to exist and to be
  // unlocked, so it renders the row action menu.
  const siteRow = () =>
    grid().locator('tbody > tr').filter({
      has: page.locator('#siteName', { hasText: siteName }),
    });
  const siteRowFirstCell = () => siteRow().locator('td.mat-mdc-cell').first();
  const siteRowActionBtn = () => siteRow().locator('[id^="action-items-"] #actionMenu');

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    // A device user owns a site, so this guarantees a non-locked Sites row.
    await deviceUsersPage.createDeviceUserFromScratch(firstName, lastName);
    deviceUserCreated = true;
    await myEformsPage.Navbar.goToSites();
    await siteRow().waitFor({ state: 'visible', timeout: 40000 });
  });

  test.afterAll(async () => {
    if (!page || page.isClosed()) {
      return;
    }
    try {
      if (deviceUserCreated) {
        // A failed menu test can leave the mat-menu backdrop blocking the navbar.
        await page.keyboard.press('Escape');
        await myEformsPage.Navbar.goToDeviceUsersPage();
        await deviceUsersPage.newDeviceUserBtn().waitFor({ state: 'visible', timeout: 40000 });
        const deviceUser = await deviceUsersPage.getDeviceUserByName(firstName);
        await deviceUser?.delete();
      }
    } finally {
      await page.close();
    }
  });

  // Stop cascade: if a previous test in this serial describe killed the
  // shared page, skip the rest instead of timing out on dead state.
  test.beforeEach(async () => {
    test.skip(!page || page.isClosed(), 'Shared page closed by earlier failure');
  });

  test('eForm Classic theme keeps grid headers in their original case', async () => {
    await expect(page.locator('body')).toHaveClass(/\btheme-eform\b/);
    await expect(firstHeaderCell()).toBeVisible();
    await expect(firstHeaderCell()).not.toHaveCSS('text-transform', 'uppercase');
  });

  test('new design uses Nunito Sans as the body font', async () => {
    await applyNewDesignTheme(page);
    await expect(page.locator('body')).toHaveCSS('font-family', /^["']?Nunito Sans\b/);
  });

  test('new design styles the sites grid header and body cells', async () => {
    const th = firstHeaderCell();
    await expect(th).toHaveCSS('text-transform', 'uppercase');
    await expect(th).toHaveCSS('font-size', '12px');
    await expect(th).toHaveCSS('padding-top', '12px');
    await expect(th).toHaveCSS('padding-left', '16px');
    // 0.06em of 12px = 0.72px; tolerate sub-pixel rounding.
    const letterSpacing = parseFloat(await computedStyle(th, 'letter-spacing'));
    expect(letterSpacing).toBeGreaterThanOrEqual(0.6);
    expect(letterSpacing).toBeLessThanOrEqual(0.8);

    const td = siteRowFirstCell();
    await expect(td).toHaveCSS('padding-top', '12px');
    await expect(td).toHaveCSS('padding-left', '16px');
    await expect(td).toHaveCSS('vertical-align', 'middle');

    await expect(grid()).toHaveCSS('border-top-left-radius', '8px');
  });

  test('new design lays out the content card and sub-header', async () => {
    const contentCard = page.locator('.content-card').first();
    await expect(contentCard).toHaveCSS('padding-left', '24px');
    await expect(contentCard).toHaveCSS('padding-right', '24px');
    await expect(page.locator('app-sites .eform-sub-header')).toHaveCSS('padding-left', '0px');
  });

  test('new design uses a compact row action button and keeps the row lit while its menu is open', async () => {
    const actionBtn = siteRowActionBtn();
    // The row paints the background (cells are transparent); the pinned
    // actions cell inherits it so it stays opaque over scrolled content.
    const row = siteRow();
    const pinnedActionsCell = row.locator('td').last();
    await expect(actionBtn).toHaveCSS('width', '32px');

    // Resting: --md-surface-container, with the pointer away from the row.
    await page.mouse.move(0, 0);
    await expect(actionBtn).not.toHaveAttribute('aria-expanded', 'true');
    await expect(row).toHaveCSS('background-color', 'rgb(255, 255, 255)');

    await actionBtn.click();
    await expect(actionBtn).toHaveAttribute('aria-expanded', 'true');
    // Move the pointer off the row (onto the menu backdrop) so only the
    // "menu open" state can explain a highlighted row, not :hover.
    await page.mouse.move(1, 1);
    // --table-row-hover (#f8fafd) in light mode.
    await expect(row).toHaveCSS('background-color', 'rgb(248, 250, 253)');
    await expect(pinnedActionsCell).toHaveCSS('background-color', 'rgb(248, 250, 253)');

    await page.keyboard.press('Escape');
    await expect(actionBtn).not.toHaveAttribute('aria-expanded', 'true');
  });

  test('new design row hover is visible in dark mode', async () => {
    await page.evaluate(() => document.body.classList.replace('theme-light', 'theme-dark'));
    const row = siteRow();
    try {
      // Dark --md-surface-container is #1e1f20; --table-row-hover is the same
      // colour there, so the theme lifts the hover with a color-mix instead.
      await page.mouse.move(0, 0);
      await expect(row).toHaveCSS('background-color', 'rgb(30, 31, 32)');
      await siteRowFirstCell().hover();
      await expect(row).not.toHaveCSS('background-color', 'rgb(30, 31, 32)');
    } finally {
      await page.evaluate(() => document.body.classList.replace('theme-dark', 'theme-light'));
    }
  });

  test('admin settings theme picker shows the renamed "eForm new design" option', async () => {
    await myEformsPage.Navbar.goToApplicationSettings();
    const labels = page.locator('.theme-option-label');
    await expect(labels.filter({ hasText: /^\s*eForm new design\s*$/ })).toBeVisible({ timeout: 40000 });
    await expect(labels.filter({ hasText: 'Google Workspace' })).toHaveCount(0);
  });
});
