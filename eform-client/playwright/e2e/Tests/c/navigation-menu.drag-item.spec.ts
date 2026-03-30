import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { NavigationMenuPage } from '../../Page objects/NavigationMenu.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';

test.describe.serial('Navigation menu - Drag item', () => {
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
    const count = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);
    await page.waitForTimeout(500);

    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());

    const currentDropDrownBodyCount = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseMenuItemDropdown(await navigationMenuPage.menuItems().count() - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);

    expect(3).toBe(await navigationMenuPage.dropdownBodyChilds(await navigationMenuPage.menuItems().count() - 1).count());
  });

  test('should edit elements in dropdown', async () => {
    const array = [
      {
        indexChildDropdown: 0,
        translations_array: ['test0Eng', 'test0Dan', 'test0Ger'],
        indexDropdownInMenu: await navigationMenuPage.menuItems().count() - 1
      },
      {
        indexChildDropdown: 1,
        translations_array: ['test1Eng', 'test1Dan', 'test1Ger'],
        indexDropdownInMenu: await navigationMenuPage.menuItems().count() - 1
      },
      {
        indexChildDropdown: 2,
        translations_array: ['test2Eng', 'test2Dan', 'test2Ger'],
        indexDropdownInMenu: await navigationMenuPage.menuItems().count() - 1
      }];

    for (const data of array) {
      await navigationMenuPage.editTranslationsOnDropdownBodyChilds(data);
      await page.waitForTimeout(500);
    } // editing translations in each dropdown element

    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    for (const item of array) {
      const foo = navigationMenuPage.dropdownBodyChilds(await navigationMenuPage.menuItems().count() - 1);
      const bar = foo.nth(item.indexChildDropdown);
      const text = bar.locator('#editBtn');
      await text.click();
      await page.waitForTimeout(500);

      for (const translation of item.translations_array) {
        const i = item.translations_array.indexOf(translation);
        expect(await (await navigationMenuPage.editItemTranslation(
          await navigationMenuPage.menuItems().count() - 1, item.indexChildDropdown, i))
          .inputValue()).toBe(translation);
      }
      await (await navigationMenuPage.editItemSaveBtn()).click();
      await page.waitForTimeout(500);
    }
  });

  test('swap elements in dropdown', async () => {
    await navigationMenuPage.dragAndDropElementOfDropdown(await navigationMenuPage.menuItemsChilds().count(),
      2, 0);
    await page.waitForTimeout(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    const itemsBeforeSwap = ['Sites / test2Dan', 'Device Users / test0Dan', 'Workers / test1Dan'];
    for (let i = 0; i < await navigationMenuPage.dropdownBodyChilds(await navigationMenuPage.menuItems().count() - 1).count(); i++) {
      const elem = navigationMenuPage.dropdownBodyChilds(await navigationMenuPage.menuItems().count() - 1).nth(i);
      const text = (await elem.textContent())?.replace(/\s+/g, ' ').trim() || '';
      expect(text).toContain(itemsBeforeSwap[i]);
    }
    await page.waitForTimeout(500);
    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(500);
  });
});
