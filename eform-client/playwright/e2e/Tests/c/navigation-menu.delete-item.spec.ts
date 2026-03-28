import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { NavigationMenuPage } from '../../Page objects/NavigationMenu.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';

test.describe.serial('Navigation menu - Delete item', () => {
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

  test('element must be created from custom dropdown which elements and create templates elements', async () => {
    await page.waitForTimeout(2000);
    const count = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseTemplates(1);
    await page.waitForTimeout(1500);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);
    await page.waitForTimeout(500);
    await page.waitForTimeout(500);

    // create 2 items from templates menu
    await navigationMenuPage.collapseTemplates(0);
    await page.waitForTimeout(500);
    await navigationMenuPage.createMenuItemFromTemplate(2);
    await page.waitForTimeout(500);
    await navigationMenuPage.createMenuItemFromTemplate(3);
    await page.waitForTimeout(500);
    await navigationMenuPage.collapseTemplates(0);
    await page.waitForTimeout(1500);

    // check, how match created elements
    expect(count + 3).toBe(await navigationMenuPage.menuItems().count());

    const currentDropDrownBodyCount = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseMenuItemDropdown(await navigationMenuPage.menuItems().count() - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentDropDrownBodyCount - 1);
    await page.waitForTimeout(500);

    // check, how match created items in dropdown
    expect(3).toBe(await navigationMenuPage.dropdownBodyChilds(await navigationMenuPage.menuItems().count() - 1).count());

    // save menu
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);
  });

  test('should before deleted items from custom dropdown and items menu', async () => {
    await page.waitForTimeout(2000);
    // remember count elements in dropdown
    const countInDropdown = await navigationMenuPage.dropdownBodyChilds(await navigationMenuPage.menuItems().count() - 1).count();

    // delete elements in dropdown
    await navigationMenuPage.deleteElementFromDropdown(await navigationMenuPage.menuItems().count() - 1, 0);
    await page.waitForTimeout(500);
    await navigationMenuPage.deleteElementFromDropdown(await navigationMenuPage.menuItems().count() - 1, 0);
    await page.waitForTimeout(500);
    await navigationMenuPage.deleteElementFromDropdown(await navigationMenuPage.menuItems().count() - 1, 0);
    await page.waitForTimeout(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    // check how many items are left in the dropdown
    expect(countInDropdown - 3).toBe((await navigationMenuPage.dropdownBodyChilds(
      await navigationMenuPage.menuItems().count() - 1)).length);

    // remember count elements in menu items
    const countInMenuItems = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.deleteElementFromMenuItems(0);
    await page.waitForTimeout(500);
    await navigationMenuPage.deleteElementFromMenuItems(0); // delete 2 template elements
    await page.waitForTimeout(500);
    await navigationMenuPage.deleteElementFromMenuItems(await navigationMenuPage.menuItems().count() - 1); // delete created dropdown
    await page.waitForTimeout(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    // check how many items are left in the menu items
    expect(countInMenuItems - 3).toBe(await navigationMenuPage.menuItems().count());

    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(1500);
  });
});
