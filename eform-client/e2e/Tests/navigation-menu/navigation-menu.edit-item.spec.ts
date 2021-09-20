import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Edit item', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom link with security group', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(1);
    const customLink = {
      securityGroups: ['eForm admins'],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    navigationMenuPage.createCustomLink(customLink);
    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);
    navigationMenuPage.clickSaveMenuBtn();
  });
  it('link with security group must be updated', async () => {
    const customLink = {
      securityGroups: ['eForm users'],
      link: 'linkTest00',
      translations: ['Test11', 'Test22', 'Test31']
    };
    navigationMenuPage.editCustomLink(customLink, navigationMenuPage.menuItemsChilds.length - 1);

    navigationMenuPage.clickSaveMenuBtn();

    navigationMenuPage.openOnEditCreatedMenuItem(navigationMenuPage.menuItemsChilds.length - 1);
    customLink.securityGroups.forEach((securityGroup, i) =>
      expect(navigationMenuPage.securityGroupsValue[i].getText(), 'SecurityGroup save is incorrect').eq(securityGroup));
    expect(navigationMenuPage.editLinkInput.getValue(), 'Link save is incorrect').contains(customLink.link);
    customLink.translations.forEach((translation, i) => {
      if (translation) {
        expect(navigationMenuPage.editItemTranslation(navigationMenuPage.menuItemsChilds.length - 1, 0, i).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    });
    navigationMenuPage.editItemSaveBtn.click();

    navigationMenuPage.resetMenu();
  });
  it('element must be created from custom dropdown with security group', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };
    navigationMenuPage.createCustomDropdown(dropdown);
    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);
    navigationMenuPage.clickSaveMenuBtn();
  });
  it('dropdown with security group must be updated', async () => {
    const dropdown = {
      securityGroups: ['eForm users'],
      translations: ['Test11', 'Test22', 'Test31']
    };
    navigationMenuPage.editCustomDropdown(dropdown, navigationMenuPage.menuItemsChilds.length - 1);

    navigationMenuPage.clickSaveMenuBtn();

    navigationMenuPage.openOnEditCreatedMenuItem(navigationMenuPage.menuItemsChilds.length - 1);
    dropdown.securityGroups.forEach((securityGroup, i) =>
      expect(navigationMenuPage.securityGroupsValue[i].getText(), 'SecurityGroup save is incorrect').eq(securityGroup));
    dropdown.translations.forEach((translation, i) => {
      if (translation) {
        expect(navigationMenuPage.editItemTranslation(navigationMenuPage.menuItemsChilds.length - 1, 0, i).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    });
    navigationMenuPage.editItemSaveBtn.click();
    navigationMenuPage.resetMenu();
  });
  it('element must be moved from templates to list', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(0);
    navigationMenuPage.createMenuItemFromTemplate(0);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);
    navigationMenuPage.clickSaveMenuBtn();
    navigationMenuPage.collapseTemplates(0);
  });
  it('element must be updated on link field', function() {

    const data = {
      link: '/device-users',
      translations: []
    };
    navigationMenuPage.editTemplateItem(data, 0);
    navigationMenuPage.openOnEditCreatedMenuItem(0);
    expect(navigationMenuPage.editLinkInput.getValue(), 'Link save is incorrect').eq(data.link);
    navigationMenuPage.editItemSaveBtn.click();
    });
  it('element must be updated on translation fields', function() {
    const data = {
      link: '',
      translations: ['translate1', 'translate21', 'translate0']
    };
    navigationMenuPage.editTemplateItem(data, 0);

    navigationMenuPage.openOnEditCreatedMenuItem(0);

    data.translations.forEach((translation, i) => {
      if (translation) {
        expect(navigationMenuPage.editItemTranslation(0, 0, i).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    });
    navigationMenuPage.editItemSaveBtn.click();
    navigationMenuPage.resetMenu();
  });
});
