import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe('Navigation menu - Delete item', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom dropdown which elements and create templates elements', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    navigationMenuPage.createCustomDropdown(dropdown);

    // create 2 items from templates menu
    navigationMenuPage.collapseTemplates(0);
    navigationMenuPage.createMenuItemFromTemplate(2);
    navigationMenuPage.createMenuItemFromTemplate(3);
    navigationMenuPage.collapseTemplates(0);

    // check, how match created elements
    expect(count + 3).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.collapseMenuItemDropdown(navigationMenuPage.menuItemsChilds.length - 1); // open dropdown in menu items
    navigationMenuPage.dropdownBody(navigationMenuPage.menuItemsChilds.length - 1).scrollIntoView(); // scroll to dropdown body
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, navigationMenuPage.menuItemsChilds.length - 1);
    navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, navigationMenuPage.menuItemsChilds.length - 1);

    // check, how match created items in dropdown
    expect(3).eq(navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length);

    // save menu
    navigationMenuPage.clickSaveMenuBtn();
  });
  it('should before deleted items from custom dropdown and items menu', function() {
    // remember count elements in dropdown
    const countInDropdown = navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length;

    // delete elements in dropdown
    navigationMenuPage.deleteElementFromDropdown(navigationMenuPage.menuItemsChilds.length - 1, 0);
    navigationMenuPage.deleteElementFromDropdown(navigationMenuPage.menuItemsChilds.length - 1, 0);
    navigationMenuPage.deleteElementFromDropdown(navigationMenuPage.menuItemsChilds.length - 1, 0);
    navigationMenuPage.clickSaveMenuBtn();

    // check how many items are left in the dropdown
    expect(countInDropdown - 3).eq(navigationMenuPage.dropdownBodyChilds(navigationMenuPage.menuItemsChilds.length - 1).length);

    // remember count elements in menu items
    const countInMenuItems = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.deleteElementFromMenuItems(0);
    navigationMenuPage.deleteElementFromMenuItems(0); // delete 2 template elements
    navigationMenuPage.deleteElementFromMenuItems(navigationMenuPage.menuItemsChilds.length - 1); // delete created dropdown
    navigationMenuPage.clickSaveMenuBtn();

    // check how many items are left in the menu items
    expect(countInMenuItems - 3).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.resetMenu();
  });
});
