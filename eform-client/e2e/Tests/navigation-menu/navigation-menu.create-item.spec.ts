import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Create item', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be moved from templates to list', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(0);
    navigationMenuPage.createMenuItemFromTemplate(0);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);
    navigationMenuPage.clickSaveMenuBtn();
    navigationMenuPage.openOnEditCreatedMenuItem(0);
    expect(navigationMenuPage.editLinkInput.getValue(), 'link field must = \' / \' ').eq('/');
    expect(navigationMenuPage.editItemTranslation(0, 0, 0).getValue(),
      'english field must = \'My eForms\'').eq('My eForms');
    expect(navigationMenuPage.editItemTranslation(0, 0, 1).getValue(),
      'danish field must = \'Mine eForms\'').eq('Mine eForms');
    expect(navigationMenuPage.editItemTranslation(0, 0, 2).getValue(),
      'german field must = \'Meine eForms\'').eq('Meine eForms');
    navigationMenuPage.editItemSaveBtn.click();
    navigationMenuPage.collapseTemplates(0);
    navigationMenuPage.resetMenu();
  });
  it('element must be created from custom link', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    const customLink = {
      securityGroups: [],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    navigationMenuPage.collapseTemplates(1);
    navigationMenuPage.createCustomLink(customLink);
    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.clickSaveMenuBtn();

    navigationMenuPage.openOnEditCreatedMenuItem(navigationMenuPage.menuItemsChilds.length - 1);
    expect(navigationMenuPage.editLinkInput.getValue(), 'Link save is incorrect').eq(customLink.link);
    customLink.translations.forEach((translation, i) => {
      if (translation) {
        expect(navigationMenuPage.editItemTranslation(navigationMenuPage.menuItemsChilds.length - 1, 0, i).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }});

    navigationMenuPage.editItemSaveBtn.click();
    navigationMenuPage.resetMenu();
  });
  it('element must be created from custom dropdown', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    // navigationMenuPage.clickOnTemplatesDropDown(2);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test2', 'test3']
    };

    navigationMenuPage.createCustomDropdown(dropdown);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);

    navigationMenuPage.clickSaveMenuBtn();

    navigationMenuPage.openOnEditCreatedMenuItem(navigationMenuPage.menuItemsChilds.length - 1);

    dropdown.translations.forEach((translation, i) => {
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
  it('element must be created from custom link with security group', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    const customLink = {
      securityGroups: ['eForm admins'],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    navigationMenuPage.createCustomLink(customLink);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);

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
});
