import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import passwordSettings from '../../Page objects/PasswordSettings.page';

import {expect} from 'chai';

describe('Password settings', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToPasswordSettings();
  });

  it('should set password to 2Times2WillDo', async () => {
    passwordSettings.setNewPassword();
    passwordSettings.Navbar.logout();
    loginPage.open('/');
    loginPage.loginWithNewPassword();
    myEformsPage.Navbar.goToPasswordSettings();
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('My eForms')).equal('My eForms');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Device Users')).equal('Device Users');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Advanced')).equal('Advanced');
  });
  it('should revert to old password', async () => {
    passwordSettings.revertToOldPassword();
    passwordSettings.Navbar.logout();
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToPasswordSettings();
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Meine eForms')).equal('Meine eForms');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Gerätebenutzer')).equal('Gerätebenutzer');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Fortgeschritten')).equal('Fortgeschritten');
  });
});
