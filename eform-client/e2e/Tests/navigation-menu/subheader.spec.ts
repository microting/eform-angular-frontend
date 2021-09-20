import loginPage from '../../Page objects/Login.page';
import navigationMenuPage from '../../Page objects/NavigationMenu.page';
import myEformsPage from '../../Page objects/MyEforms.page';

let translation = '';
const expect = require('chai').expect;
describe('Subheader test', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToMenuEditorPage();
  });
  it('element must be moved from templates to list', async () => {
    const count = navigationMenuPage.menuItemsChilds.length;
    navigationMenuPage.collapseTemplates(0);
    navigationMenuPage.createMenuItemFromTemplate(0);
    navigationMenuPage.collapseTemplates(0);

    expect(count + 1).eq(navigationMenuPage.menuItemsChilds.length);
    navigationMenuPage.clickSaveMenuBtn();
    navigationMenuPage.openOnEditCreatedMenuItem(0);
    translation = navigationMenuPage.editItemTranslation(0, 0, 1).getValue();
    navigationMenuPage.editItemSaveBtn.click();
  });
  it('must navigate on create menu item and translate must be == translate', async () => {
    const spinnerAnimation = $('#spinner-animation');
    const h1 = $('eform-subheader h1');
    myEformsPage.Navbar.clickOnHeaderMenuItem2(translation).click();
    spinnerAnimation.waitForDisplayed({ timeout: 30000, reverse: true });
    expect(h1.getText()).eq(
      translation,
      'subheader text must be equal with text in translate'
    );
    myEformsPage.Navbar.goToMenuEditorPage();
    navigationMenuPage.openOnEditCreatedMenuItem(0);
    translation = 'Test translation';
    navigationMenuPage.editItemTranslation(0, 0, 1).setValue(translation);
    navigationMenuPage.editItemSaveBtn.click();
    navigationMenuPage.clickSaveMenuBtn();
    myEformsPage.Navbar.clickOnHeaderMenuItem2(translation).click();
    spinnerAnimation.waitForDisplayed({ timeout: 30000, reverse: true });
    expect(h1.getText()).eq(
      translation,
      'subheader text must be equal with text in translate'
    );
    myEformsPage.Navbar.goToMenuEditorPage();
    navigationMenuPage.resetMenu();
  });
});
