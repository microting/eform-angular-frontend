import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe('Navigation menu - Delete item', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom dropdown which elements and create templates elements', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    await navigationMenuPage.collapseTemplates(1);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);

    // create 2 items from templates menu
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(2);
    await navigationMenuPage.createMenuItemFromTemplate(3);
    await navigationMenuPage.collapseTemplates(0);

    // check, how match created elements
    expect(count + 3).eq((await navigationMenuPage.menuItemsChilds()).length);

    navigationMenuPage.collapseMenuItemDropdown((await navigationMenuPage.menuItemsChilds()).length - 1); // open dropdown in menu items
    await (await navigationMenuPage.dropdownBody(
      (await navigationMenuPage.menuItemsChilds()).length - 1)).scrollIntoView(); // scroll to dropdown body
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, (await navigationMenuPage.menuItemsChilds()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, (await navigationMenuPage.menuItemsChilds()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, (await navigationMenuPage.menuItemsChilds()).length - 1);

    // check, how match created items in dropdown
    expect(3).eq(await (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItemsChilds()).length - 1)).length);

    // save menu
    await navigationMenuPage.clickSaveMenuBtn();
  });
  it('should before deleted items from custom dropdown and items menu', async() => {
    // remember count elements in dropdown
    // tslint:disable-next-line:max-line-length
    const countInDropdown = await (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItemsChilds()).length - 1)).length;

    // delete elements in dropdown
    await navigationMenuPage.deleteElementFromDropdown((await navigationMenuPage.menuItemsChilds()).length - 1, 0);
    await navigationMenuPage.deleteElementFromDropdown((await navigationMenuPage.menuItemsChilds()).length - 1, 0);
    await navigationMenuPage.deleteElementFromDropdown((await navigationMenuPage.menuItemsChilds()).length - 1, 0);
    await navigationMenuPage.clickSaveMenuBtn();

    // check how many items are left in the dropdown
    expect(countInDropdown - 3).eq(await (await navigationMenuPage.dropdownBodyChilds(
      (await (await navigationMenuPage.menuItemsChilds()).length - 1))).length);

    // remember count elements in menu items
    const countInMenuItems = (await navigationMenuPage.menuItemsChilds()).length;
    await navigationMenuPage.deleteElementFromMenuItems(0);
    await navigationMenuPage.deleteElementFromMenuItems(0); // delete 2 template elements
    await navigationMenuPage.deleteElementFromMenuItems((await navigationMenuPage.menuItemsChilds()).length - 1); // delete created dropdown
    await navigationMenuPage.clickSaveMenuBtn();

    // check how many items are left in the menu items
    expect(countInMenuItems - 3).eq((await navigationMenuPage.menuItemsChilds()).length);

    await navigationMenuPage.resetMenu();
  });
});
