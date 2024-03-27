import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

import {expect} from 'chai';
describe('Navigation menu - Delete item', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom dropdown which elements and create templates elements', async () => {
    await browser.pause(2000);
    const count = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseTemplates(1);
    await browser.pause(1500);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);
    await browser.pause(500);
    //await navigationMenuPage.collapseMenuItemDropdown((await navigationMenuPage.menuItems()).length - 1);
    await browser.pause(500);

    // create 2 items from templates menu
    await navigationMenuPage.collapseTemplates(0);
    await browser.pause(500);
    await navigationMenuPage.createMenuItemFromTemplate(2);
    await browser.pause(500);
    await navigationMenuPage.createMenuItemFromTemplate(3);
    await browser.pause(500);
    await navigationMenuPage.collapseTemplates(0);
    await browser.pause(1500);

    // check, how match created elements
    expect(count + 3).eq((await navigationMenuPage.menuItems()).length);

    const currentDropDrownBodyCount = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseMenuItemDropdown((await navigationMenuPage.menuItems()).length - 1);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(1, currentDropDrownBodyCount - 1);
    await browser.pause(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(2, currentDropDrownBodyCount - 1);
    await browser.pause(500);
    await navigationMenuPage.dragTemplateOnElementInCreatedDropdown(3, currentDropDrownBodyCount - 1);
    await browser.pause(500);

    // check, how match created items in dropdown
    expect(3).eq(await (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1)).length);

    // save menu
    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);
  });
  it('should before deleted items from custom dropdown and items menu', async() => {
    await browser.pause(2000);
    // remember count elements in dropdown
    // tslint:disable-next-line:max-line-length
    const countInDropdown = await (await navigationMenuPage.dropdownBodyChilds((await navigationMenuPage.menuItems()).length - 1)).length;

    // delete elements in dropdown
    await navigationMenuPage.deleteElementFromDropdown((await navigationMenuPage.menuItems()).length - 1, 0);
    await browser.pause(500);
    await navigationMenuPage.deleteElementFromDropdown((await navigationMenuPage.menuItems()).length - 1, 0);
    await browser.pause(500);
    await navigationMenuPage.deleteElementFromDropdown((await navigationMenuPage.menuItems()).length - 1, 0);
    await browser.pause(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);

    // check how many items are left in the dropdown
    expect(countInDropdown - 3).eq(await (await navigationMenuPage.dropdownBodyChilds(
      (await (await navigationMenuPage.menuItems()).length - 1))).length);

    // remember count elements in menu items
    const countInMenuItems = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.deleteElementFromMenuItems(0);
    await browser.pause(500);
    await navigationMenuPage.deleteElementFromMenuItems(0); // delete 2 template elements
    await browser.pause(500);
    await navigationMenuPage.deleteElementFromMenuItems((await navigationMenuPage.menuItems()).length - 1); // delete created dropdown
    await browser.pause(500);
    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);

    // check how many items are left in the menu items
    expect(countInMenuItems - 3).eq((await navigationMenuPage.menuItems()).length);

    await navigationMenuPage.resetMenu();
    await browser.pause(1500);
  });
});
