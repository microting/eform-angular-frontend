import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Edit item', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be created from custom link with security group', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    await navigationMenuPage.collapseTemplates(1);
    const customLink = {
      securityGroups: ['eForm admins'],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.createCustomLink(customLink);
    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);
    await navigationMenuPage.clickSaveMenuBtn();
  });
  it('link with security group must be updated', async () => {
    const customLink = {
      securityGroups: ['eForm users'],
      link: 'linkTest00',
      translations: ['Test11', 'Test22', 'Test31']
    };
    await navigationMenuPage.editCustomLink(customLink, (await navigationMenuPage.menuItemsChilds()).length - 1);

    await navigationMenuPage.clickSaveMenuBtn();

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItemsChilds()).length - 1);
    for (const securityGroup of customLink.securityGroups) {
      const i = customLink.securityGroups.indexOf(securityGroup);
      expect(await (await navigationMenuPage.securityGroupsValue())[i].getText(), 'SecurityGroup save is incorrect').eq(securityGroup);
    }
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'Link save is incorrect').contains(customLink.link);
    customLink.translations.forEach(async (translation, i) => {
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItemsChilds()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    });
    await (await navigationMenuPage.editItemSaveBtn()).click();

    await navigationMenuPage.resetMenu();
  });
  it('element must be created from custom dropdown with security group', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.createCustomDropdown(dropdown);
    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);
    await navigationMenuPage.clickSaveMenuBtn();
  });
  it('dropdown with security group must be updated', async () => {
    const dropdown = {
      securityGroups: ['eForm users'],
      translations: ['Test11', 'Test22', 'Test31']
    };
    await navigationMenuPage.editCustomDropdown(dropdown, (await navigationMenuPage.menuItemsChilds()).length - 1);

    await navigationMenuPage.clickSaveMenuBtn();

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItemsChilds()).length - 1);
    for (const securityGroup of dropdown.securityGroups) {
      const i = dropdown.securityGroups.indexOf(securityGroup);
      expect(await (await navigationMenuPage.securityGroupsValue())[i].getText(), 'SecurityGroup save is incorrect').eq(securityGroup);
    }
    for (const translation of dropdown.translations) {
      const i = dropdown.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItemsChilds()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    }
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.resetMenu();
  });
  it('element must be moved from templates to list', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);

    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);
    await navigationMenuPage.clickSaveMenuBtn();
    await navigationMenuPage.collapseTemplates(0);
  });
  it('element must be updated on link field', async() => {

    const data = {
      link: '/device-users',
      translations: []
    };
    await navigationMenuPage.editTemplateItem(data, 0);
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'Link save is incorrect').eq(data.link);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    });
  it('element must be updated on translation fields', async() => {
    const data = {
      link: '',
      translations: ['translate1', 'translate21', 'translate0']
    };
    await navigationMenuPage.editTemplateItem(data, 0);

    await navigationMenuPage.openOnEditCreatedMenuItem(0);

    for (const translation of data.translations) {
      const i = data.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(0, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    }
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.resetMenu();
  });
});
