import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import profileSettings from '../../Page objects/ProfileSettings.page';

const expect = require('chai').expect;

describe('Profile Settings', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
   myEformsPage.Navbar.goToProfileSettings();
  });
  it('should set language to English', function () {
    profileSettings.chooseLanguage('English');
    profileSettings.saveProfileSettings();
    browser.refresh();
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('My eForms')).equal('My eForms');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Device Users')).equal('Device Users');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Advanced')).equal('Advanced');
  });
  it('should set language to German', function () {
    profileSettings.chooseLanguage('German');
    profileSettings.saveProfileSettings();
    browser.refresh();
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Meine eForms')).equal('Meine eForms');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Gerätebenutzer')).equal('Gerätebenutzer');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Fortgeschritten')).equal('Fortgeschritten');
  });
  it('should set language to Danish', function () {
    profileSettings.chooseLanguage('Danish');
    profileSettings.saveProfileSettings();
    browser.refresh();
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Mine eForms')).equal('Mine eForms');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Enhedsbrugere')).equal('Enhedsbrugere');
    // expect(myEformsPage.Navbar.verifyHeaderMenuItem('Avanceret')).equal('Avanceret');
  });
});
