import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {DeviceUsersRowObject} from '../../Page objects/DeviceUsers.page';
import {generateRandmString} from '../../Helpers/helper-functions';
import {Guid} from 'guid-typescript';
import sitesPage from '../../Page objects/Sites.page';

const expect = require('chai').expect;
const tagName = generateRandmString();

describe('Site tags', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    deviceUsersPage.createDeviceUserFromScratch('John', 'Smith');
  });
  it('should create new tag', function () {
    loginPage.open('/advanced/sites');
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#editSiteTagsBtn_0').waitForDisplayed({timeout: 20000});
    const site = sitesPage.getFirstRowObject();
    sitesPage.createTag(site, tagName);
    const tagExist = sitesPage.tagExists(tagName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(tagExist, true);
  });
  it('should cancel assign tag', function () {
    loginPage.open('/advanced/sites');
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const site = sitesPage.getFirstRowObject();
    // browser.pause(8000);
    site.siteTagsEditBtn.click();
    $('#newTag').waitForDisplayed({timeout: 20000});
    // browser.pause(8000);
    const tagNotSelected = sitesPage.tagNotSelected(tagName);
    // browser.pause(4000);
    expect(tagNotSelected, true);
  });
  it('should assign tag', function () {
    loginPage.open('/advanced/sites');
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    // browser.pause(5000);
    const site = sitesPage.getFirstRowObject();
    // browser.pause(8000);
    site.siteTagsEditBtn.click();
    $('#newTag').waitForDisplayed({timeout: 20000});
    const firstTag = sitesPage.getFirstAvailableTag;
    firstTag.click();
    sitesPage.updateTagsBtn.click();
    expect(site.assignedTag, tagName);
  });
  it('should delete tag', function () {
    loginPage.open('/advanced/sites');
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#editSiteTagsBtn_0').waitForDisplayed({timeout: 20000});
    const site = sitesPage.getFirstRowObject();
    // browser.pause(8000);
    site.siteTagsEditBtn.click();
    $('#newTag').waitForDisplayed({timeout: 20000});
    sitesPage.tagRemovalSelector.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const tagsForRemoval = sitesPage.siteTagRemovalListOfOptions();
    tagsForRemoval[0].click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    sitesPage.removeTagBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const tagExist = sitesPage.tagExists(tagName);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(tagExist, false);
  });
  it('should delete user', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    $('#deviceUserId').waitForDisplayed({timeout: 20000});
    const lastDeviceUser = deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    lastDeviceUser.deleteBtn.waitForDisplayed({timeout: 5000});
    lastDeviceUser.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    deviceUsersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
});
