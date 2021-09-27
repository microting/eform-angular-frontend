import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;
describe(' Navigation menu - Create item', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be moved from templates to list', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);

    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);
    await navigationMenuPage.clickSaveMenuBtn();
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'link field must = \' / \' ').eq('/');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 0)).getValue(),
      'english field must = \'My eForms\'').eq('My eForms');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 1)).getValue(),
      'danish field must = \'Mine eForms\'').eq('Mine eForms');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 2)).getValue(),
      'german field must = \'Meine eForms\'').eq('Meine eForms');
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.resetMenu();
  });
  it('element must be created from custom link', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    const customLink = {
      securityGroups: [],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomLink(customLink);
    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);

    await navigationMenuPage.clickSaveMenuBtn();

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItemsChilds()).length - 1);
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'Link save is incorrect').eq(customLink.link);
    for (const translation of customLink.translations) {
      const i = customLink.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItemsChilds()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }}

    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.resetMenu();
  });
  it('element must be created from custom dropdown', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    // navigationMenuPage.clickOnTemplatesDropDown(2);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test2', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);

    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);

    await navigationMenuPage.clickSaveMenuBtn();

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItemsChilds()).length - 1);

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
  it('element must be created from custom dropdown with security group', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };

    await navigationMenuPage.createCustomDropdown(dropdown);

    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);

    await navigationMenuPage.clickSaveMenuBtn();

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItemsChilds()).length - 1);

    dropdown.securityGroups.forEach(async (securityGroup, i) =>
      expect(await (await navigationMenuPage.securityGroupsValue())[i].getText(), 'SecurityGroup save is incorrect')
        .eq(securityGroup));
    for (const translation of dropdown.translations) {
      const i = dropdown.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
            await (await navigationMenuPage.menuItemsChilds()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    }

    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.resetMenu();
  });
  it('element must be created from custom link with security group', async () => {
    const count = (await navigationMenuPage.menuItemsChilds()).length;
    const customLink = {
      securityGroups: ['eForm admins'],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.createCustomLink(customLink);

    expect(count + 1).eq((await navigationMenuPage.menuItemsChilds()).length);

    await navigationMenuPage.clickSaveMenuBtn();

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItemsChilds()).length - 1);
    customLink.securityGroups.forEach(async (securityGroup, i) =>
      expect(await (await navigationMenuPage.securityGroupsValue())[i].getText(), 'SecurityGroup save is incorrect')
        .eq(securityGroup));
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'Link save is incorrect').contains(customLink.link);
    for (const translation of customLink.translations) {
      const i = customLink.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
            await (await navigationMenuPage.menuItemsChilds()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    }

    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.resetMenu();
  });
});
