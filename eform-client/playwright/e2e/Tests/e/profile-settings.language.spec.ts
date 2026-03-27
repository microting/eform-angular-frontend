import { test, expect } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';
import { ProfileSettingsPage } from '../Page objects/ProfileSettings.page';

const translationsEFormsPageEng: Array<{ key: string; value: string }> = [
  { key: 'eform-new-subheader h2', value: 'My eForms' },
];
const translationsEFormsPageGer: Array<{ key: string; value: string }> = [
  { key: 'eform-new-subheader h2', value: 'Meine eForms' },
];
const translationsEFormsPageDan: Array<{ key: string; value: string }> = [
  { key: 'eform-new-subheader h2', value: 'Mine eForms' },
];

test.describe('Profile settings', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let profileSettings: ProfileSettingsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    profileSettings = new ProfileSettingsPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should set language to English', async () => {
    await myEformsPage.Navbar.goToProfileSettings();
    await profileSettings.chooseLanguage('English');
    await profileSettings.saveProfileSettings();
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    await myEformsPage.Navbar.goToMyEForms();
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    for (const translation of translationsEFormsPageEng) {
      expect(await page.locator(translation.key).textContent()).toBe(translation.value);
    }
  });

  test('should set language to Dansk', async () => {
    await myEformsPage.Navbar.goToProfileSettings();
    await profileSettings.chooseLanguage('Dansk');
    await profileSettings.saveProfileSettings();
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    await myEformsPage.Navbar.goToMyEForms();
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    for (const translation of translationsEFormsPageDan) {
      expect(await page.locator(translation.key).textContent()).toBe(translation.value);
    }
  });
});
