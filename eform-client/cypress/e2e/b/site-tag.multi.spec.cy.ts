import loginPage from '../Login.page';
import {myEformsPage} from '../MyEforms.page';
import deviceUsersPage from '../DeviceUsers.page';
import { generateRandmString } from '../helper-functions';
import sitesPage from '../Sites.page';

const expect = require('chai').expect;
const tagName = generateRandmString();

describe('Site tags', function () {
  // before(() => {
  //   cy.visit('http://localhost:4200');
  //   loginPage.login();
  //   myEformsPage.Navbar.goToDeviceUsersPage();
  //   ($('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
  //   deviceUsersPage.createDeviceUserFromScratch('John', 'Doe');
  //   myEformsPage.Navbar.goToSites();
  // });
  // it('should create new tag', () => {
  //   $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  //   sitesPage.createTag([tagName]);
  // });
  // it('should assign tag', () => {
  //   browser.pause(500);
  //   let site = sitesPage.getFirstRowObject();
  //   site.edit({ tags: [tagName] });
  //   site = sitesPage.getFirstRowObject();
  //   expect(site.tags.includes(tagName)).eq(true);
  // });
  // it('should cancel assign tag', () => {
  //   let site = sitesPage.getFirstRowObject();
  //   site.edit({ tags: [tagName] });
  //   site = sitesPage.getFirstRowObject();
  //   expect(site.tags.includes(tagName)).eq(false);
  // });
  // it('should delete tag', () => {
  //   sitesPage.removeTags([tagName]);
  // });
  // it('should delete user', () => {
  //   myEformsPage.Navbar.goToDeviceUsersPage();
  //   const rowNumBeforeDelete = deviceUsersPage.rowNum();
  //   (deviceUsersPage.getDeviceUser(rowNumBeforeDelete)).delete();
  // });
});
