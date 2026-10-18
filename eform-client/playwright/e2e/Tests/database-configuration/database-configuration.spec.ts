import { test, expect } from '@playwright/test';
import { DatabasePage } from '../../Page objects/Database.page';
import DatabaseConfigurationConstants from '../../Constants/DatabaseConfigurationConstants';
import { LoginPage } from '../../Page objects/Login.page';

test.describe('Database', () => {
  test.describe.configure({ retries: 0 });

  test('should be configured successfully', async ({ page }) => {
    test.setTimeout(300_000);
    const databasePage = new DatabasePage(page);
    const loginPage = new LoginPage(page);
    await databasePage.open('/');
    await databasePage.saveBtn().waitFor({ state: 'visible', timeout: 90000 });
    await databasePage.languageDropdown().waitFor({ state: 'visible', timeout: 90000 });
    await page.waitForTimeout(5000);
    await databasePage.languageDropdown().waitFor({ state: 'visible', timeout: 90000 });
    await page.waitForTimeout(1000);
    expect(await databasePage.firstNameInput().isVisible()).toBeTruthy();
    expect(await databasePage.lastNameInput().isVisible()).toBeTruthy();
    expect(await databasePage.emailInput().isVisible()).toBeTruthy();
    expect(await databasePage.passwordInput().isVisible()).toBeTruthy();
    expect(await databasePage.customerNo().isVisible()).toBeTruthy();
    expect(await databasePage.tokenInput().isVisible()).toBeTruthy();
    expect(await databasePage.authenticationType().isVisible()).toBeTruthy();
    expect(await databasePage.languageDropdown().isVisible()).toBeTruthy();
    await databasePage.configure(DatabaseConfigurationConstants.languageOptions.danish);
    await page.waitForTimeout(1000);
    await databasePage.save();
    await page.waitForTimeout(120000);
    await page.goto('http://localhost:4200');
    await page.locator('#loginBtn').waitFor({ state: 'visible', timeout: 90000 });
    expect(await loginPage.loginBtn().isVisible()).toBeTruthy();
  });
});
