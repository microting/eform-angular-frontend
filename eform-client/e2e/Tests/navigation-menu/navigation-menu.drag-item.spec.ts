import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Drag item', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
    await browser.pause(5000);
  });
  it('element must be created from custom dropdown which elements', async () => {
    const count = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);
    await browser.pause(500);

    expect(count + 1).eq((await navigationMenuPage.menuItems()).length);

    const currentDropDrownBodyCount = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseMenuItemDropdown((await navigationMenuPage.menuItems()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentDropDrownBodyCount - 1);
    await browser.pause(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentDropDrownBodyCount - 1);
    await browser.pause(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentDropDrownBodyCount - 1);
    await browser.pause(500);

    expect(3).eq((await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1)).length);
  });
  it('should edit elements in dropdown', async () => {
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
      await browser.pause(500);
    } // editing translations in each dropdown element

    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);

    for (const item of array) {
      const foo = await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1);
      const bar = await foo[item.indexChildDropdown];
      const text = await bar.$('#editBtn');
      await text.click();
      await browser.pause(500);

      for (const translation of item.translations_array) {
        const i = item.translations_array.indexOf(translation);
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItems()).length - 1, item.indexChildDropdown, i))
          .getValue()).eq(translation);
      }
      await (await navigationMenuPage.editItemSaveBtn()).click();
      await browser.pause(500);
    }
  });
  it('swap elements in dropdown', async () => {
    await navigationMenuPage.dragAndDropElementOfDropdown((await navigationMenuPage.menuItemsChilds()).length,
      2, 0);
    await browser.pause(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);

    const itemsBeforeSwap = ['menu\nSites / test2Dan\nedit\ndelete', 'menu\nDevice Users / test0Dan\nedit\ndelete', 'menu\nWorkers / test1Dan\nedit\ndelete'];
    // tslint:disable-next-line:max-line-length
    for (let i = 0; i < (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1)).length; i++) {
      const elem = (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1))[i];
      expect(await elem.getText()).eq(itemsBeforeSwap[i]);
    }
    await browser.pause(500);
    await navigationMenuPage.resetMenu();
    await browser.pause(500);
  });
});
