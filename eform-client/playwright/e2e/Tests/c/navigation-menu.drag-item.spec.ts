import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { NavigationMenuPage } from '../Page objects/NavigationMenu.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';

test.describe('Navigation menu - Drag item', () => {
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
    await page.waitForTimeout(5000);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('element must be created from custom dropdown which elements', async () => {
    const count = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);
    await page.waitForTimeout(500);

    expect(count + 1).toBe((await navigationMenuPage.menuItems()).length);

    const currentDropDrownBodyCount = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseMenuItemDropdown((await navigationMenuPage.menuItems()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);

    expect(3).toBe((await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1)).length);
  });

  test('should edit elements in dropdown', async () => {
    const array = [
      {
        indexChildDropdown: 0,
        translations_array: ['test0Eng', 'test0Dan', 'test0Ger'],
        indexDropdownInMenu: (await navigationMenuPage.menuItems()).length - 1
      },
      {
        indexChildDropdown: 1,
        translations_array: ['test1Eng', 'test1Dan', 'test1Ger'],
        indexDropdownInMenu: (await navigationMenuPage.menuItems()).length - 1
      },
      {
        indexChildDropdown: 2,
        translations_array: ['test2Eng', 'test2Dan', 'test2Ger'],
        indexDropdownInMenu: (await navigationMenuPage.menuItems()).length - 1
      }];

    for (const data of array) {
      await navigationMenuPage.editTranslationsOnDropdownBodyChilds(data);
      await page.waitForTimeout(500);
    } // editing translations in each dropdown element

    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    for (const item of array) {
      const foo = await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1);
      const bar = foo[item.indexChildDropdown];
      const text = bar.locator('#editBtn');
      await text.click();
      await page.waitForTimeout(500);

      for (const translation of item.translations_array) {
        const i = item.translations_array.indexOf(translation);
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItems()).length - 1, item.indexChildDropdown, i))
          .inputValue()).toBe(translation);
      }
      await (await navigationMenuPage.editItemSaveBtn()).click();
      await page.waitForTimeout(500);
    }
  });

  test('swap elements in dropdown', async () => {
    await navigationMenuPage.dragAndDropElementOfDropdown((await navigationMenuPage.menuItemsChilds()).length,
      2, 0);
    await page.waitForTimeout(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    const itemsBeforeSwap = ['menu\nSites / test2Dan\nedit\ndelete', 'menu\nDevice Users / test0Dan\nedit\ndelete', 'menu\nWorkers / test1Dan\nedit\ndelete'];
    for (let i = 0; i < (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1)).length; i++) {
      const elem = (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1))[i];
      expect(await elem.textContent()).toBe(itemsBeforeSwap[i]);
    }
    await page.waitForTimeout(500);
    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(500);
  });
});
