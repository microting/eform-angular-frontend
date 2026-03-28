import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { NavigationMenuPage } from '../../Page objects/NavigationMenu.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';

test.describe.serial('Navigation menu - Edit item', () => {
  let page: Page;
  let loginPage: LoginPage;
  let navigationMenuPage: NavigationMenuPage;
  let myEformsPage: MyEformsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    navigationMenuPage = new NavigationMenuPage(page);
    myEformsPage = new MyEformsPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('element must be created from custom link with security group', async () => {
    await page.waitForTimeout(2000);
    const count = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseTemplates(1);
    await page.waitForTimeout(1500);
    const customLink = {
      securityGroups: ['eForm admins'],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.createCustomLink(customLink);
    await page.waitForTimeout(500);
    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());
    await page.waitForTimeout(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);
  });

  test('link with security group must be updated', async () => {
    const customLink = {
      securityGroups: ['eForm users'],
      link: 'linkTest00',
      translations: ['Test11', 'Test22', 'Test31']
    };
    await navigationMenuPage.collapseTemplates(1);
    await page.waitForTimeout(1500);
    await navigationMenuPage.editCustomLink(customLink, await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(500);

    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    await navigationMenuPage.openOnEditCreatedMenuItem(await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(1500);
    const securityGroups = await navigationMenuPage.securityGroupsValue();
    for (const securityGroup of customLink.securityGroups) {
      const i = customLink.securityGroups.indexOf(securityGroup);
      expect(await securityGroups.nth(i).textContent()).toBe(securityGroup);
    }
    expect(await (await navigationMenuPage.editLinkInput()).inputValue()).toContain(customLink.link);
    for (const translation of customLink.translations) {
      const i = customLink.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          await navigationMenuPage.menuItems().count() - 1, 0, i)).inputValue()).toBe(translation);
      }
    }
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await page.waitForTimeout(500);

    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(2000);
  });

  test('element must be created from custom dropdown with security group', async () => {
    await page.waitForTimeout(1500);
    const count = await navigationMenuPage.menuItems().count();
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.collapseTemplates(1);
    await page.waitForTimeout(1500);
    await navigationMenuPage.createCustomDropdown(dropdown);
    await page.waitForTimeout(500);
    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);
  });

  test('dropdown with security group must be updated', async () => {
    const dropdown = {
      securityGroups: ['eForm users'],
      translations: ['Test11', 'Test22', 'Test31']
    };
    await navigationMenuPage.editCustomDropdown(dropdown, await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(500);

    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    await navigationMenuPage.openOnEditCreatedMenuItem(await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(500);
    const securityGroupValues = navigationMenuPage.securityGroupsValue();
    for (const securityGroup of dropdown.securityGroups) {
      const i = dropdown.securityGroups.indexOf(securityGroup);
      expect(await securityGroupValues.nth(i).textContent()).toBe(securityGroup);
    }
    for (const translation of dropdown.translations) {
      const i = dropdown.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          await navigationMenuPage.menuItems().count() - 1, 0, i)).inputValue()).toBe(translation);
      }
    }
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await page.waitForTimeout(500);
    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(2000);
  });

  test('element must be moved from templates to list', async () => {
    await page.waitForTimeout(1500);
    const count = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);
    await page.waitForTimeout(500);

    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);
    await navigationMenuPage.collapseTemplates(0);
  });

  test('element must be updated on link field', async () => {
    const data = {
      link: '/device-users',
      translations: []
    };
    await navigationMenuPage.editTemplateItem(data, 0);
    await page.waitForTimeout(500);
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    await page.waitForTimeout(500);
    expect(await (await navigationMenuPage.editLinkInput()).inputValue()).toBe(data.link);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await page.waitForTimeout(500);
  });

  test('element must be updated on translation fields', async () => {
    const data = {
      link: '',
      translations: ['translate1', 'translate21', 'translate0']
    };
    await navigationMenuPage.editTemplateItem(data, 0);
    await page.waitForTimeout(500);

    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    await page.waitForTimeout(500);

    for (const translation of data.translations) {
      const i = data.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(0, 0, i)).inputValue()).toBe(translation);
      }
    }
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await page.waitForTimeout(500);
    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(500);
  });
});
