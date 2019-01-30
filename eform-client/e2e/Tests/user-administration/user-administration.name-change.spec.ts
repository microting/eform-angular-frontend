import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import userAdministration from '../../Page objects/UserAdministration.page';

const expect = require('chai').expect;

describe('User administration settings', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToUserAdministration();
  });

  it('should set name to Foo Bar', function () {
    userAdministration.setNewName('Foo', 'Bar');
    browser.pause(2000);
    expect(browser.getText(`//*[contains(@class, 'table')]//*[contains(text(), 'Foo Bar')]`)).equal('Foo Bar');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Device Users')).equal('Device Users');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Advanced')).equal('Advanced');
  });
  it('should revert to old name', function () {
    userAdministration.revertToOldName('John', 'Smith');
    browser.pause(2000);
    expect(browser.getText(`//*[contains(@class, 'table')]//*[contains(text(), 'John Smith')]`)).equal('John Smith');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Gerätebenutzer')).equal('Gerätebenutzer');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Fortgeschritten')).equal('Fortgeschritten');
  });
});
