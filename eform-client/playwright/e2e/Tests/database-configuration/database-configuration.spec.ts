import { test, expect } from '@playwright/test';
import { DatabasePage } from '../Page objects/Database.page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';
import { LoginPage } from '../Page objects/Login.page';

test.describe('Database', () => {
  test('should be configured successfully', async ({ page }) => {
    const databasePage = new DatabasePage(page);
    const loginPage = new LoginPage(page);
    await databasePage.open('/');
    await (await databasePage.saveBtn()).waitForDisplayed({ timeout: 90000 });
    await (await databasePage.languageDropdown()).waitForDisplayed({ timeout: 90000 });
    await page.waitForTimeout(5000);
    await (await databasePage.languageDropdown()).waitForDisplayed({ timeout: 90000 });
    await page.waitForTimeout(1000);
    expect(await (await databasePage.firstNameInput()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.lastNameInput()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.emailInput()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.passwordInput()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.customerNo()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.tokenInput()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.authenticationType()).isDisplayed()).toBeTruthy();
    expect(await (await databasePage.languageDropdown()).isDisplayed()).toBeTruthy();
    await databasePage.configure(DatabaseConfigurationConstants.languageOptions.danish);
    await page.waitForTimeout(1000);
    await databasePage.save();
    await page.locator('#loginBtn').waitFor({ state: 'visible', timeout: 90000 });
    expect(await (await loginPage.loginBtn()).isDisplayed()).toBeTruthy();
  });
});
