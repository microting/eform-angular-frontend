import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Drag item', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom dropdown which elements', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    await navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);

    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);

    await navigationMenuPage.collapseMenuItemDropdown((await navigationMenuPage.menuItemsChilds()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, (await navigationMenuPage.menuItemsChilds()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, (await navigationMenuPage.menuItemsChilds()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, (await navigationMenuPage.menuItemsChilds()).length - 1);

    expect(3).eq((await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItemsChilds()).length - 1)).length);
  });
  it('should edit elements in dropdown', async () => {
    const array = [
      {
        indexChildDropdown: 0,
        translations_array: ['test0Eng', 'test0Dan', 'test0Ger'],
        indexDropdownInMenu: (await navigationMenuPage.menuItemsChilds()).length - 1
      },
      {
        indexChildDropdown: 1,
        translations_array: ['test1Eng', 'test1Dan', 'test1Ger'],
        indexDropdownInMenu: (await navigationMenuPage.menuItemsChilds()).length - 1
      },
      {
        indexChildDropdown: 2,
        translations_array: ['test2Eng', 'test2Dan', 'test2Ger'],
        indexDropdownInMenu: (await navigationMenuPage.menuItemsChilds()).length - 1
      }];

    for (const data of array) {
      await navigationMenuPage.editTranslationsOnDropdownBodyChilds(data);
    } // editing translations in each dropdown element

    await navigationMenuPage.clickSaveMenuBtn();

    array.forEach(async item => {
      await navigationMenuPage.dropdownBodyChilds(
        (await navigationMenuPage.menuItemsChilds()).length - 1)[item.indexChildDropdown].$('#editBtn').click();
      for (const translation of item.translations_array) {
        const i = item.translations_array.indexOf(translation);
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItemsChilds()).length - 1, item.indexChildDropdown, i))
          .getValue()).eq(translation);
      }
      await (await navigationMenuPage.editItemSaveBtn()).click();
    });
  });
  it('swap elements in dropdown', async () => {
    await navigationMenuPage.dragAndDropElementOfDropdown((await navigationMenuPage.menuItemsChilds()).length - 1,
      2, 0);
    await navigationMenuPage.clickSaveMenuBtn();

    const itemsBeforeSwap = ['drag_handle Device Users / test2Dan', 'drag_handle Workers / test0Dan', 'drag_handle Sites / test1Dan'];
    // tslint:disable-next-line:max-line-length
    for (let i = 0; i < (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItemsChilds()).length - 1)).length; i++) {
      const elem = (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItemsChilds()).length - 1))[i];
      expect(await elem.getText()).eq(itemsBeforeSwap[i]);
    }
    await navigationMenuPage.resetMenu();
  });
});
