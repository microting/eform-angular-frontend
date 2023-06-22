import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

let translation = '';
const expect = require('chai').expect;
describe('Subheader test', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be moved from templates to list', async () => {
    const count = (await navigationMenuPage.menuItems()).length;
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);
    await navigationMenuPage.collapseTemplates(0);

    expect(count + 1).eq((await navigationMenuPage.menuItems()).length);
    await navigationMenuPage.clickSaveMenuBtn();
    // await browser.pause(500);
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    // await browser.pause(500);
    translation = await (await navigationMenuPage.editItemTranslation(0, 0, 1)).getValue();
    // await browser.pause(500);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    // await browser.pause(500);
  });
  it('must navigate on create menu item and translate must be == translate', async () => {
    const spinnerAnimation = $('#spinner-animation');
    await (await myEformsPage.Navbar.clickOnHeaderMenuItem2(translation)).click();
    // await browser.pause(500);
    // await spinnerAnimation.waitForDisplayed({ timeout: 30000, reverse: true });
    const h1 = $('eform-new-subheader h2');
    expect(await h1.getText()).eq(
      translation,
      'subheader text must be equal with text in translate'
    );
    await myEformsPage.Navbar.goToMenuEditorPage();
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    // await browser.pause(500);
    translation = 'Test translation';
    await (await navigationMenuPage.editItemTranslation(0, 0, 1)).setValue(translation);
    // await browser.pause(500);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    // await browser.pause(500);
    await navigationMenuPage.clickSaveMenuBtn();
    // await browser.pause(500);
    await (await myEformsPage.Navbar.clickOnHeaderMenuItem2(translation)).click();
    // await browser.pause(500);
    // await spinnerAnimation.waitForDisplayed({ timeout: 30000, reverse: true });
    expect(await h1.getText()).eq(
      translation,
      'subheader text must be equal with text in translate'
    );
    await myEformsPage.Navbar.goToMenuEditorPage();
    // await browser.pause(500);
    await navigationMenuPage.resetMenu();
    // await browser.pause(500);
  });
});
