import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe('Navigation menu - Delete item', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom dropdown which elements and create templates elements', function () {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    navigationMenuPage.createCustomDropdown(dropdown);

    navigationMenuPage.collapseTemplates(0);
    navigationMenuPage.createMenuItemFromTemplate(2);
    navigationMenuPage.createMenuItemFromTemplate(3);
    navigationMenuPage.collapseTemplates(0);

    expect(count + 3).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.collapseMenuItemDropdown(navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dropdownBody(navigationMenuPage.menuItemsChilds.length - 1).scrollIntoView();
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, navigationMenuPage.menuItemsChilds.length - 1);

    expect(3).eq(navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length);

    navigationMenuPage.clickSaveMenuBtn();
  });
  it('should before deleted items from custom dropdown and items menu', function() {
    const countInDropdown = navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length;
    navigationMenuPage.deleteElementFromDropdown(navigationMenuPage.menuItemsChilds.length - 1, 0);
    navigationMenuPage.deleteElementFromDropdown(navigationMenuPage.menuItemsChilds.length - 1, 0);
    navigationMenuPage.deleteElementFromDropdown(navigationMenuPage.menuItemsChilds.length - 1, 0);
    navigationMenuPage.clickSaveMenuBtn();
    expect(countInDropdown - 3).eq(navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length);

    const countInMenuItems = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.deleteElementFromMenuItems(0);
    navigationMenuPage.deleteElementFromMenuItems(0);
    navigationMenuPage.deleteElementFromMenuItems(navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.clickSaveMenuBtn();
    expect(countInMenuItems - 3).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.resetMenu();
  });
});
