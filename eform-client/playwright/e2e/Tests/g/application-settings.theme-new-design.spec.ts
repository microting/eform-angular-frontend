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
  // The Device Users row of the user created in beforeAll.
  const deviceUserRow = () => page.locator('tbody > tr', { hasText: firstName });

  // Appends stand-in markup to the content card while `assertions` run, then
  // removes it, so fixtures never leak into later tests.
  const withContentCardFixture = async (html: string, assertions: () => Promise<void>) => {
    await page.evaluate((markup) => {
      const template = document.createElement('template');
      template.innerHTML = markup;
      Array.from(template.content.children).forEach((el) => el.setAttribute('data-e2e-fixture', ''));
      document.querySelector('.content-card')?.append(template.content);
    }, html);
    try {
      await assertions();
    } finally {
      await page.evaluate(() => document.querySelectorAll('[data-e2e-fixture]').forEach((el) => el.remove()));
    }
  };
  // A hand-written one-row table (no .mdc-data-table__row), like the legacy grids.
  const matTable = (cells: string) =>
    `<table class="mat-mdc-table"><tbody><tr class="mat-mdc-row">${cells}</tr></tbody></table>`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    // A device user owns a site, so this guarantees a non-locked Sites row.
    // Not createDeviceUserFromScratch(): it counts rows a fixed 500 ms after
    // saving, which races the list refresh on this shard's fresh database.
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await deviceUsersPage.newDeviceUserBtn().waitFor({ state: 'visible', timeout: 40000 });
    await deviceUsersPage.createNewDeviceUser(firstName, lastName);
    deviceUserCreated = true;
    await expect(deviceUserRow()).toBeVisible({ timeout: 40000 });
    await myEformsPage.Navbar.goToSites();
    await siteRow().waitFor({ state: 'visible', timeout: 40000 });
  });

  test.afterAll(async () => {
    if (!page || page.isClosed()) {
      return;
    }
    try {
      if (deviceUserCreated) {
        // A failed test can leave a menu or dialog backdrop blocking the
        // navbar. Only press Escape then: otherwise focus sits in the side
        // drawer (after a nav click) and Escape closes the drawer instead.
        if (await page.locator('.cdk-overlay-backdrop').first().isVisible()) {
          await page.keyboard.press('Escape');
        }
        await myEformsPage.Navbar.goToDeviceUsersPage();
        await deviceUsersPage.newDeviceUserBtn().waitFor({ state: 'visible', timeout: 40000 });
        // Let the list load before looking the user up; if its creation never
        // completed there is no row, and the lookup below finds nothing to delete.
        await deviceUserRow()
          .waitFor({ state: 'visible', timeout: 40000 })
          .catch(() => undefined);
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

    // The frame's bottom edge is the only line under the last row.
    const lastRowFirstCell = grid().locator('tbody > tr').last().locator('td').first();
    await expect(lastRowFirstCell).toHaveCSS('border-bottom-style', 'none');

    await expect(grid()).toHaveCSS('border-top-left-radius', '8px');
    // width: 100% + the 1px frame must not overflow the container.
    await expect(grid()).toHaveCSS('box-sizing', 'border-box');

    // The right-pinned actions header keeps the --bg header tint (#f8fafd),
    // even against a plugin-style `:host ::ng-deep … th` paint (0,3,1).
    const pinnedActionsHeader = grid().locator('thead tr th').last();
    await expect(pinnedActionsHeader).toHaveClass(/\bmat-table-sticky-right\b/);
    await expect(pinnedActionsHeader).toHaveCSS('background-color', 'rgb(248, 250, 253)');
    const pluginPaintSelector = '.mtx-grid .mat-mdc-header-row th.mat-table-sticky-right';
    await page.evaluate((selector) => {
      const style = document.createElement('style');
      style.id = 'e2e-plugin-pinned-paint';
      style.textContent = `${selector} { background: rgb(255, 0, 0) !important; }`;
      document.head.appendChild(style);
    }, pluginPaintSelector);
    try {
      // Positive control: the injected paint really targets this cell.
      expect(await pinnedActionsHeader.evaluate((el, s) => el.matches(s), pluginPaintSelector)).toBe(true);
      await expect(pinnedActionsHeader).toHaveCSS('background-color', 'rgb(248, 250, 253)');
    } finally {
      await page.evaluate(() => document.getElementById('e2e-plugin-pinned-paint')?.remove());
    }
  });

  test('new design lays out the content card and sub-header', async () => {
    const contentCard = page.locator('.content-card').first();
    await expect(contentCard).toHaveCSS('padding-left', '24px');
    await expect(contentCard).toHaveCSS('padding-right', '24px');
    await expect(page.locator('app-sites .eform-sub-header')).toHaveCSS('padding-left', '0px');
  });

  test('new design keeps the content card flush around full-bleed views', async () => {
    const contentCard = page.locator('.content-card').first();
    // Stand-in for the backend-configuration calendar's root.
    await withContentCardFixture('<div class="calendar-shell"></div>', async () => {
      await expect(contentCard).toHaveCSS('padding-left', '0px');
      await expect(contentCard).toHaveCSS('padding-top', '0px');
    });
    await expect(contentCard).toHaveCSS('padding-left', '24px');
  });

  test('new design keeps time-planning grid dividers off the frame edges', async () => {
    // Stand-in for the time-planning week grid: day cells carry the status
    // classes that styles.scss gives !important right/bottom borders.
    const dayCell = '<td class="mat-mdc-cell white-background">day</td>';
    await withContentCardFixture(
      `<div class="mtx-grid time-dashboard" id="e2e-time-dashboard">${matTable(dayCell + dayCell)}</div>`,
      async () => {
        const cells = page.locator('#e2e-time-dashboard td');
        // Day divider between cells, in the row-separator colour.
        await expect(cells.first()).toHaveCSS('border-right-style', 'solid');
        await expect(cells.first()).toHaveCSS('border-right-color', 'rgb(225, 231, 239)');
        // None against the frame's right and bottom edges.
        await expect(cells.last()).toHaveCSS('border-right-style', 'none');
        await expect(cells.last()).toHaveCSS('border-bottom-style', 'none');
      }
    );
  });

  test('new design drops mtx dividers after left-pinned columns except on the time-planning grid', async () => {
    // Stand-ins for a grid with left-pinned columns (compliance report,
    // working hours) and the time-planning week grid. mtx-grid's global
    // styles are loaded by the Sites grid on this page.
    const pinnedCells = matTable(
      '<td class="mat-mdc-cell mat-table-sticky-left">a</td><td class="mat-mdc-cell">b</td>'
    );
    await withContentCardFixture(
      `<div class="mtx-grid" id="e2e-pinned-left">${pinnedCells}</div>` +
        `<div class="mtx-grid time-dashboard" id="e2e-pinned-left-tp">${pinnedCells}</div>`,
      async () => {
        await expect(page.locator('#e2e-pinned-left td').first()).toHaveCSS('border-right-style', 'none');
        await expect(page.locator('#e2e-pinned-left-tp td').first()).toHaveCSS('border-right-style', 'solid');
      }
    );
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
