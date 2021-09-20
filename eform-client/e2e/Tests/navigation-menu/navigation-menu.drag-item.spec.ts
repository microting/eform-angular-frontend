import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Drag item', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom dropdown which elements', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    navigationMenuPage.createCustomDropdown(dropdown);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.collapseMenuItemDropdown(navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, navigationMenuPage.menuItemsChilds.length - 1);

    expect(3).eq(navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length);
  });
  it('should edit elements in dropdown', async () => {
    const array = [
      {
        indexChildDropdown: 0,
        translations_array: ['test0Eng', 'test0Dan', 'test0Ger'],
        indexDropdownInMenu: navigationMenuPage.menuItemsChilds.length - 1
      },
      {
        indexChildDropdown: 1,
        translations_array: ['test1Eng', 'test1Dan', 'test1Ger'],
        indexDropdownInMenu: navigationMenuPage.menuItemsChilds.length - 1
      },
      {
        indexChildDropdown: 2,
        translations_array: ['test2Eng', 'test2Dan', 'test2Ger'],
        indexDropdownInMenu: navigationMenuPage.menuItemsChilds.length - 1
      }];

    array.forEach(data => navigationMenuPage.editTranslationsOnDropdownBodyChilds(data)); // editing translations in each dropdown element

    navigationMenuPage.clickSaveMenuBtn();

    array.forEach(item => {
      navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1)[item.indexChildDropdown].$('#editBtn').click();
      item.translations_array.forEach((translation, i) =>
        expect(navigationMenuPage.editItemTranslation(navigationMenuPage.menuItemsChilds.length - 1, item.indexChildDropdown, i)
          .getValue()).eq(translation));
      navigationMenuPage.editItemSaveBtn.click();
    });
  });
  it('swap elements in dropdown', async () => {
    navigationMenuPage.dragAndDropElementOfDropdown(navigationMenuPage.menuItemsChilds.length - 1,
      2, 0);
    navigationMenuPage.clickSaveMenuBtn();

    const itemsBeforeSwap = ['drag_handle Device Users / test2Dan', 'drag_handle Workers / test0Dan', 'drag_handle Sites / test1Dan'];
    navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).forEach((elem, i) =>
      expect(elem.getText()).eq(itemsBeforeSwap[i])
    );
    navigationMenuPage.resetMenu();
  });
});
