import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import sitesPage from '../../Page objects/Sites.page';

const expect = require('chai').expect;
const tagName = generateRandmString();

describe('Site tags', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 20000 });
    deviceUsersPage.createDeviceUserFromScratch('John', 'Smith');
    myEformsPage.Navbar.goToSites();
  });
  it('should create new tag', function () {
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    sitesPage.createTag([tagName]);
  });
  it('should assign tag', function () {
    let site = sitesPage.getFirstRowObject();
    site.edit({ tags: [tagName] });
    site = sitesPage.getFirstRowObject();
    expect(site.tags.includes(tagName)).eq(true);
  });
  it('should cancel assign tag', function () {
    let site = sitesPage.getFirstRowObject();
    site.edit({ tags: [tagName] });
    site = sitesPage.getFirstRowObject();
    expect(site.tags.includes(tagName)).eq(false);
  });
  it('should delete tag', function () {
    sitesPage.removeTags([tagName]);
  });
  it('should delete user', function () {
    myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    deviceUsersPage.getDeviceUser(rowNumBeforeDelete).delete();
  });
});
