import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import sitesPage from '../../Page objects/Sites.page';

const expect = require('chai').expect;
const tagName = generateRandmString();

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
    await sitesPage.createTag([tagName]);
  });
  it('should assign tag', async () => {
    await browser.pause(500);
    let site = await sitesPage.getFirstRowObject();
    await site.edit({ tags: [tagName] });
    site = await sitesPage.getFirstRowObject();
    expect(site.tags.includes(tagName)).eq(true);
  });
  it('should cancel assign tag', async () => {
    let site = await sitesPage.getFirstRowObject();
    await site.edit({ tags: [tagName] });
    site = await sitesPage.getFirstRowObject();
    expect(site.tags.includes(tagName)).eq(false);
  });
  it('should delete tag', async () => {
    await sitesPage.removeTags([tagName]);
  });
  it('should delete user', async () => {
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await (await deviceUsersPage.getDeviceUser(rowNumBeforeDelete)).delete();
  });
});
