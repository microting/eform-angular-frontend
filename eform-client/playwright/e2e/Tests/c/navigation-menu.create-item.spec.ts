import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { NavigationMenuPage } from '../../Page objects/NavigationMenu.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';

test.describe.serial('Navigation menu - Create item', () => {
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

  test('element must be moved from templates to list', async () => {
    await page.waitForTimeout(1000);
    const count = await navigationMenuPage.menuItems().count();
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);
    await page.waitForTimeout(500);

    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());
    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    await page.waitForTimeout(500);
    expect(await (await navigationMenuPage.editLinkInput()).inputValue()).toBe('/');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 0)).inputValue()).toBe('My eForms');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 1)).inputValue()).toBe('Mine eForms');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 2)).inputValue()).toBe('Meine eForms');
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await page.waitForTimeout(500);
    await navigationMenuPage.collapseTemplates(0);
    await page.waitForTimeout(500);
    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(2000);
  });

  test('element must be created from custom link', async () => {
    await page.waitForTimeout(1500);
    const count = await navigationMenuPage.menuItems().count();
    const customLink = {
      securityGroups: [],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomLink(customLink);

    await page.waitForTimeout(1000);
    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());

    // Verify the menu item data is loaded before saving
    await navigationMenuPage.verifyMenuItemDataLoaded(await navigationMenuPage.menuItems().count() - 1);

    await navigationMenuPage.clickSaveMenuBtn();

    await page.waitForTimeout(500);
    await navigationMenuPage.openOnEditCreatedMenuItem(await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(500);
    expect(await (await navigationMenuPage.editLinkInput()).inputValue()).toBe(customLink.link);
    for (const translation of customLink.translations) {
      const i = customLink.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          await navigationMenuPage.menuItems().count() - 1, 0, i)).inputValue()).toBe(translation);
      }
    }

    await page.waitForTimeout(500);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await page.waitForTimeout(500);
    await navigationMenuPage.resetMenu();
    await page.waitForTimeout(2000);
  });

  test('element must be created from custom dropdown', async () => {
    await page.waitForTimeout(1500);
    const count = await navigationMenuPage.menuItems().count();
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomDropdown(dropdown);
    await page.waitForTimeout(1500);

    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());

    // Verify the menu item data is loaded before saving
    await navigationMenuPage.verifyMenuItemDataLoaded(await navigationMenuPage.menuItems().count() - 1);

    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    await navigationMenuPage.openOnEditCreatedMenuItem(await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(500);

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

  test('element must be created from custom dropdown with security group', async () => {
    await page.waitForTimeout(1500);
    const count = await navigationMenuPage.menuItems().count();
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };

    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomDropdown(dropdown);
    await page.waitForTimeout(500);

    expect(count + 1).toBe(await navigationMenuPage.menuItems().count());

    // Verify the menu item data is loaded before saving
    await navigationMenuPage.verifyMenuItemDataLoaded(await navigationMenuPage.menuItems().count() - 1);

    await navigationMenuPage.clickSaveMenuBtn();
    await page.waitForTimeout(500);

    await navigationMenuPage.openOnEditCreatedMenuItem(await navigationMenuPage.menuItems().count() - 1);
    await page.waitForTimeout(500);

    const securityGroupValues = navigationMenuPage.securityGroupsValue();
    for (let i = 0; i < dropdown.securityGroups.length; i++) {
      expect((await securityGroupValues.nth(i).textContent())?.trim()).toBe(dropdown.securityGroups[i]);
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
    await page.waitForTimeout(500);
  });

  // test('element must be created from custom link with security group', async () => {
  //   const count = await navigationMenuPage.menuItems().count();
  //   const customLink = {
  //     securityGroups: ['eForm admins'],
  //     link: 'test0',
  //     translations: ['test1', 'test2', 'test3']
  //   };
  //   await navigationMenuPage.collapseTemplates(1);
  //   await navigationMenuPage.createCustomLink(customLink);
  //   await page.waitForTimeout(500);
  //
  //   expect(count + 1).toBe(await navigationMenuPage.menuItems().count());
  //
  //   await navigationMenuPage.clickSaveMenuBtn();
  //   await page.waitForTimeout(500);
  //
  //   await navigationMenuPage.openOnEditCreatedMenuItem(await navigationMenuPage.menuItems().count() - 1);
  //   await page.waitForTimeout(500);
  //   const securityGroupValues = await navigationMenuPage.securityGroupsValue();
  //   for (let i = 0; i < customLink.securityGroups.length; i++) {
  //     expect(await securityGroupValues[i].textContent()).toBe(customLink.securityGroups[i]);
  //   }
  //   expect(await (await navigationMenuPage.editLinkInput()).inputValue()).toContain(customLink.link);
  //   for (const translation of customLink.translations) {
  //     const i = customLink.translations.indexOf(translation);
  //     if (translation) {
  //       expect(await (await navigationMenuPage.editItemTranslation(
  //         await navigationMenuPage.menuItems().count() - 1, 0, i)).inputValue()).toBe(translation);
  //     }
  //   }
  //
  //   await (await navigationMenuPage.editItemSaveBtn()).click();
  //   await page.waitForTimeout(500);
  //   await navigationMenuPage.resetMenu();
  // });
});
