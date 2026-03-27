import { test, expect } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';
import { ApplicationSettingsPage } from '../Page objects/ApplicationSettings.page';
import ApplicationSettingsConstants from '../Constants/ApplicationSettingsConstants';

test.describe('Application settings page - site header section', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let applicationSettingsPage: ApplicationSettingsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    applicationSettingsPage = new ApplicationSettingsPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  // test('should change main text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await page.locator('#mainTextLoginPage').waitFor({ state: 'visible', timeout: 240000 });
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   await (await applicationSettingsPage.SiteHeader.mainTextInput()).setValue(
  //     ApplicationSettingsConstants.SiteHeader.customMainText
  //   );
  //   await applicationSettingsPage.save();
  //   await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 240000 });
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).getText()
  //   ).toBe(ApplicationSettingsConstants.SiteHeader.customMainText);
  // });
  // test('should change secondary text', async () => {
  //   await (await applicationSettingsPage.SiteHeader.secondaryTextInput()).setValue(
  //     ApplicationSettingsConstants.SiteHeader.customSecondaryText
  //   );
  //   await applicationSettingsPage.save();
  //   await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).getText()
  //   ).toBe(ApplicationSettingsConstants.SiteHeader.customSecondaryText);
  // });
  // test('should hide main text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await (await applicationSettingsPage.SiteHeader.mainTextVisibilityToggleBtn()).click();
  //   await applicationSettingsPage.save();
  //   await loginPage.open('/application-settings');
  //   await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   await loginPage.open('/');
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).isDisplayed()
  //   ).toBe(false);
  // });
  // test('should hide secondary text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await (await applicationSettingsPage.SiteHeader.secondaryTextVisibilityToggleBtn()).click();
  //   await applicationSettingsPage.save();
  //   await loginPage.open('/application-settings');
  //   await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   await loginPage.open('/');
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).isDisplayed()
  //   ).toBe(false);
  // });

  test('should hide image', async () => {
    await myEformsPage.Navbar.goToApplicationSettings();
    await loginPage.waitForSpinnerHide();
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    await (await applicationSettingsPage.SiteHeader.imageVisibilityToggler()).click();
    await applicationSettingsPage.save();
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    await loginPage.open('/application-settings');
    await page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    await loginPage.open('/');
    expect(
      await (await applicationSettingsPage.siteHeaderImage()).isDisplayed()
    ).toBe(false);
  });

  // test('should reset site header main text', async () => {
  //   await myEformsPage.Navbar.goToApplicationSettings();
  //   await applicationSettingsPage.SiteHeader.reset();
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   await loginPage.open('/application-settings');
  //   await page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 50000 });
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).isDisplayed()
  //   ).toBeTruthy();
  // });
  // test('should reset site header secondary text', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderMainText()).getText()
  //   ).toBe(ApplicationSettingsConstants.SiteHeader.originalMainText);
  // });
  // test('should reset site header main text visibility', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).isDisplayed()
  //   ).toBeTruthy();
  // });
  // test('should reset site header secondary text visibility', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderSecondaryText()).getText()
  //   ).toBe(ApplicationSettingsConstants.SiteHeader.originalSecondaryText);
  // });
  // test('should reset site header image text visibility', async () => {
  //   expect(
  //     await (await applicationSettingsPage.siteHeaderImage()).isDisplayed()
  //   ).toBeTruthy();
  // });
});
