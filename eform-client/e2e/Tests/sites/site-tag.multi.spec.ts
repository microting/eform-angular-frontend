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
    browser.waitForVisible('#newDeviceUserBtn', 20000);
    deviceUsersPage.createDeviceUserFromScratch('John', 'Smith');
    sitesPage.Navbar.goToSites();
  });
  it('should create new tag', function () {
    browser.waitForVisible('#editSiteTagsBtn', 20000);
    const site = sitesPage.getFirstRowObject();
    sitesPage.createTag(site, tagName);
    const tagExist = sitesPage.tagExists(tagName);
    browser.pause(4000);
    expect(tagExist, true);
    browser.refresh();
  });
  it('should cancel assign tag', function () {
    const site = sitesPage.getFirstRowObject();
    browser.pause(8000);
    site.siteTagsEditBtn.click();
    browser.pause(8000);
    const tagNotSelected = sitesPage.tagNotSelected(tagName);
    browser.pause(4000);
    expect(tagNotSelected, true);
    browser.refresh();
  });
  it('should assign tag', function () {
    browser.pause(5000);
    const site = sitesPage.getFirstRowObject();
    browser.pause(8000);
    site.siteTagsEditBtn.click();
    browser.pause(8000);
    const firstTag = sitesPage.getFirstAvailableTag;
    firstTag.click();
    sitesPage.updateTagsBtn.click();
    browser.pause(10000);
    expect(site.assignedTag, tagName);
    browser.refresh();
  });
  it('should delete tag', function () {
    browser.pause(5000);
    const site = sitesPage.getFirstRowObject();
    browser.pause(8000);
    site.siteTagsEditBtn.click();
    browser.pause(8000);
    sitesPage.tagRemovalSelector.click();
    browser.pause(2000);
    const tagsForRemoval = sitesPage.getTagsListOfChoises();
    tagsForRemoval[0].click();
    browser.pause(2000);
    sitesPage.removeTagBtn.click();
    browser.pause(4000);
    const tagExist = sitesPage.tagExists(tagName);
    browser.pause(4000);
    expect(tagExist, false);
    browser.refresh();
  });
});
