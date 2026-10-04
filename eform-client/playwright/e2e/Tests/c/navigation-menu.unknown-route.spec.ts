import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';

// #8103: a URL that matches no route used to redirect silently to My eForms,
// and the menu editor accepted internal links that match no route.

const UI_TIMEOUT = 15_000;
// The menu editor's first render waits for the navigation-menu API call.
const API_TIMEOUT = 30_000;

test.describe.serial('Unknown routes', () => {
  let page: Page;
  let loginPage: LoginPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('an unknown URL shows the not-found page and keeps the URL', async () => {
    await loginPage.open('/no-such-page-8103?tab=2');
    await expect(page.locator('#notFoundPage')).toBeVisible({ timeout: API_TIMEOUT });
    await expect(page.locator('#notFoundUrl')).toHaveText('/no-such-page-8103?tab=2');
    await expect(page).toHaveURL(/\/no-such-page-8103\?tab=2$/);
    // A plugin link saved without the /plugins prefix lands here too.
    await loginPage.open('/items-planning-pn/plannings');
    await expect(page.locator('#notFoundUrl')).toHaveText('/items-planning-pn/plannings', { timeout: API_TIMEOUT });

    await page.locator('#notFoundHomeBtn').click({ timeout: UI_TIMEOUT });
    await expect(page.locator('#newEFormBtn')).toBeVisible({ timeout: API_TIMEOUT });
    await expect(page.locator('#notFoundPage')).toHaveCount(0);
  });

  test('the menu editor warns about an internal link that matches no route', async () => {
    await loginPage.open('/advanced/navigation-menu');
    const customTemplate = page.locator('app-navigation-menu-custom #menuTemplate');
    await expect(customTemplate).toBeVisible({ timeout: API_TIMEOUT });
    await customTemplate.click({ timeout: UI_TIMEOUT });
    const addCustomLink = page.locator('#addCustomLink');
    await expect(addCustomLink).toBeVisible({ timeout: UI_TIMEOUT });
    await addCustomLink.click({ timeout: UI_TIMEOUT });

    const dialog = page.locator('mat-dialog-container');
    const linkInput = dialog.locator('#customLinkLink');
    const warning = dialog.locator('#customLinkNoRouteWarning');
    await expect(linkInput).toBeVisible({ timeout: UI_TIMEOUT });

    await linkInput.fill('/no-such-page-8103');
    await expect(warning).toBeVisible({ timeout: UI_TIMEOUT });

    await linkInput.fill('/advanced/sites');
    await expect(warning).toHaveCount(0);

    // An external link is not checked against the app's routes.
    await linkInput.fill('no-such-page-8103');
    await expect(warning).toBeVisible({ timeout: UI_TIMEOUT });
    await dialog.locator('#customLinkIsInternalLink input[type="checkbox"]').uncheck({ timeout: UI_TIMEOUT });
    await expect(warning).toHaveCount(0);

    await dialog.locator('#customLinkCancelCreateBtn').click({ timeout: UI_TIMEOUT });
    await expect(dialog).toHaveCount(0, { timeout: UI_TIMEOUT });
  });
});
