import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { NavigationMenuPage } from '../../Page objects/NavigationMenu.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';

let translation = '';

test.describe('Subheader test', () => {
  let page;
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

  test('element must be moved from templates to list', async () => {
    const count = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);
    await navigationMenuPage.collapseTemplates(0);

    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());
    await navigationMenuPage.clickSaveMenuBtn();
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    translation = await (await navigationMenuPage.editItemTranslation(0, 0, 1)).inputValue();
    await (await navigationMenuPage.editItemSaveBtn()).click();
  });

  test('must navigate on create menu item and translate must be == translate', async () => {
    await (await myEformsPage.Navbar.clickOnHeaderMenuItem2(translation)).click();
    const h1 = page.locator('eform-new-subheader h2');
    expect(await h1.textContent()).toBe(translation);
    await myEformsPage.Navbar.goToMenuEditorPage();
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    translation = 'Test translation';
    await (await navigationMenuPage.editItemTranslation(0, 0, 1)).fill(translation);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.clickSaveMenuBtn();
    await (await myEformsPage.Navbar.clickOnHeaderMenuItem2(translation)).click();
    expect(await h1.textContent()).toBe(translation);
    await myEformsPage.Navbar.goToMenuEditorPage();
    await navigationMenuPage.resetMenu();
  });
});
