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
    await browser.pause(1000);
    const count = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);
    await browser.pause(500);

    expect(count + 1).eq((await navigationMenuPage.menuItems()).length);
    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    await browser.pause(500);
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'link field must = \' / \' ').eq('/');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 0)).getValue(),
      'english field must = \'My eForms\'').eq('My eForms');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 1)).getValue(),
      'danish field must = \'Mine eForms\'').eq('Mine eForms');
    expect(await (await navigationMenuPage.editItemTranslation(0, 0, 2)).getValue(),
      'german field must = \'Meine eForms\'').eq('Meine eForms');
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await browser.pause(500);
    await navigationMenuPage.collapseTemplates(0);
    await browser.pause(500);
    await navigationMenuPage.resetMenu();
    await browser.pause(2000);
  });
  it('element must be created from custom link', async () => {
    await browser.pause(1500);
    const count = (await navigationMenuPage.menuItems()).length;
    const customLink = {
      securityGroups: [],
      link: 'test0',
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomLink(customLink);

    await browser.pause(1000);
    expect(count + 1).eq((await navigationMenuPage.menuItems()).length);

    await navigationMenuPage.clickSaveMenuBtn();

    await browser.pause(500);
    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItems()).length - 1);
    await browser.pause(500);
    expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'Link save is incorrect').eq(customLink.link);
    for (const translation of customLink.translations) {
      const i = customLink.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItems()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }}

    await browser.pause(500);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await browser.pause(500);
    await navigationMenuPage.resetMenu();
    await browser.pause(2000);
  });
  it('element must be created from custom dropdown', async () => {
    await browser.pause(1500);
    const count = (await navigationMenuPage.menuItems()).length;
    // navigationMenuPage.clickOnTemplatesDropDown(2);
    const dropdown = {
      securityGroups: [],
      translations: ['test1', 'test2', 'test3']
    };
    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomDropdown(dropdown);
    await browser.pause(1500);

    expect(count + 1).eq((await navigationMenuPage.menuItems()).length);

    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItems()).length - 1);
    await browser.pause(500);

    for (const translation of dropdown.translations) {
      const i = dropdown.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
          (await navigationMenuPage.menuItems()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    }

    await (await navigationMenuPage.editItemSaveBtn()).click();
    await browser.pause(500);
    await navigationMenuPage.resetMenu();
    await browser.pause(2000);
  });
  it('element must be created from custom dropdown with security group', async () => {
    await browser.pause(1500);
    const count = (await navigationMenuPage.menuItems()).length;
    const dropdown = {
      securityGroups: ['eForm admins'],
      translations: ['test1', 'test2', 'test3']
    };

    await navigationMenuPage.collapseTemplates(1);
    await navigationMenuPage.createCustomDropdown(dropdown);
    await browser.pause(500);

    expect(count + 1).eq((await navigationMenuPage.menuItems()).length);

    await navigationMenuPage.clickSaveMenuBtn();
    await browser.pause(500);

    await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItems()).length - 1);
    await browser.pause(500);

    dropdown.securityGroups.forEach(async (securityGroup, i) =>
      expect(await (await navigationMenuPage.securityGroupsValue())[i].getText(), 'SecurityGroup save is incorrect')
        .eq(securityGroup));
    for (const translation of dropdown.translations) {
      const i = dropdown.translations.indexOf(translation);
      if (translation) {
        expect(await (await navigationMenuPage.editItemTranslation(
            await (await navigationMenuPage.menuItems()).length - 1, 0, i)).getValue(),
          `Translation field [${i}] save is incorrect`).eq(translation);
      }
    }

    await (await navigationMenuPage.editItemSaveBtn()).click();
    await browser.pause(500);
    await navigationMenuPage.resetMenu();
    await browser.pause(500);
  });
  // it('element must be created from custom link with security group', async () => {
  //   const count = (await navigationMenuPage.menuItems()).length;
  //   const customLink = {
  //     securityGroups: ['eForm admins'],
  //     link: 'test0',
  //     translations: ['test1', 'test2', 'test3']
  //   };
  //   await navigationMenuPage.collapseTemplates(1);
  //   await navigationMenuPage.createCustomLink(customLink);
  //   await browser.pause(500);
  //
  //   expect(count + 1).eq((await navigationMenuPage.menuItems()).length);
  //
  //   await navigationMenuPage.clickSaveMenuBtn();
  //   await browser.pause(500);
  //
  //   await navigationMenuPage.openOnEditCreatedMenuItem((await navigationMenuPage.menuItems()).length - 1);
  //   await browser.pause(500);
  //   customLink.securityGroups.forEach(async (securityGroup, i) =>
  //     expect(await (await navigationMenuPage.securityGroupsValue())[i].getText(), 'SecurityGroup save is incorrect')
  //       .eq(securityGroup));
  //   expect(await (await navigationMenuPage.editLinkInput()).getValue(), 'Link save is incorrect').contains(customLink.link);
  //   for (const translation of customLink.translations) {
  //     const i = customLink.translations.indexOf(translation);
  //     if (translation) {
  //       expect(await (await navigationMenuPage.editItemTranslation(
  //           await (await navigationMenuPage.menuItems()).length - 1, 0, i)).getValue(),
  //         `Translation field [${i}] save is incorrect`).eq(translation);
  //     }
  //   }
  //
  //   await (await navigationMenuPage.editItemSaveBtn()).click();
  //   await browser.pause(500);
  //   await navigationMenuPage.resetMenu();
  // });
});
