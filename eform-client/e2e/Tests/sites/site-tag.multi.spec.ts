import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import sitesPage from '../../Page objects/Sites.page';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
const aTagName = generateRandmString();
const bTagName = generateRandmString();

describe('Site tags', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await deviceUsersPage.createDeviceUserFromScratch('John', 'Doe');
    await myEformsPage.Navbar.goToSites();
  });
  it('should create new tag', async () => {
    await sitesPage.createTag([aTagName]);
  });
  it('should create new b tag', async () => {
    await sitesPage.createTag([bTagName]);
  });
  it('should assign tag', async () => {
    await browser.pause(500);
    let site = await sitesPage.getFirstRowObject();
    await site.edit({ tags: [aTagName] });
    site = await sitesPage.getFirstRowObject();
    expect(site.tags.includes(aTagName)).eq(true);
  });
  it('should cancel assign tag', async () => {
    let site = await sitesPage.getFirstRowObject();
    await site.edit({ tags: [bTagName] }, true);
    await browser.pause(1500);
    site = await sitesPage.getFirstRowObject();
    expect(site.tags.includes(bTagName)).eq(false);
    expect(site.tags.includes(aTagName)).eq(true);
  });
  it('should delete tag', async () => {
    await sitesPage.removeTags([aTagName]);
  });
  it('should delete tag', async () => {
    await sitesPage.removeTags([bTagName]);
  });
  it('should delete user', async () => {
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await (await deviceUsersPage.getDeviceUser(rowNumBeforeDelete)).delete();
  });
});
