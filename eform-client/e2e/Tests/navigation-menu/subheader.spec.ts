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
    const count = navigationMenuPage.menuItemsChilds.length;
    await navigationMenuPage.collapseTemplates(0);
    await navigationMenuPage.createMenuItemFromTemplate(0);
    await navigationMenuPage.collapseTemplates(0);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);
    await navigationMenuPage.clickSaveMenuBtn();
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    translation = await (await navigationMenuPage.editItemTranslation(0, 0, 1)).getValue();
    await (await navigationMenuPage.editItemSaveBtn()).click();
  });
  it('must navigate on create menu item and translate must be == translate', async () => {
    const spinnerAnimation = $('#spinner-animation');
    const h1 = $('eform-subheader h1');
    await (await myEformsPage.Navbar.clickOnHeaderMenuItem2(translation)).click();
    await spinnerAnimation.waitForDisplayed({ timeout: 30000, reverse: true });
    expect(h1.getText()).eq(
      translation,
      'subheader text must be equal with text in translate'
    );
    await myEformsPage.Navbar.goToMenuEditorPage();
    await navigationMenuPage.openOnEditCreatedMenuItem(0);
    translation = 'Test translation';
    await (await navigationMenuPage.editItemTranslation(0, 0, 1)).setValue(translation);
    await (await navigationMenuPage.editItemSaveBtn()).click();
    await navigationMenuPage.clickSaveMenuBtn();
    await (await myEformsPage.Navbar.clickOnHeaderMenuItem2(translation)).click();
    await spinnerAnimation.waitForDisplayed({ timeout: 30000, reverse: true });
    expect(h1.getText()).eq(
      translation,
      'subheader text must be equal with text in translate'
    );
    await myEformsPage.Navbar.goToMenuEditorPage();
    await navigationMenuPage.resetMenu();
  });
});
