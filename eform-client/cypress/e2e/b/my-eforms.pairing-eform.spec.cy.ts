import loginPage from '../Login.page';
import {myEformsPage} from '../MyEforms.page';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../DeviceUsers.page';
//import foldersPage, { FoldersRowObject } from '../Folders.page';

const expect = require('chai').expect;
const users = new Array<DeviceUsersRowObject>();
//const folders = new Array<FoldersRowObject>();
describe('Main page', function () {
  // before(() => {
  //   cy.visit('http://localhost:4200');
  //   loginPage.login();
  //   myEformsPage.Navbar.goToDeviceUsersPage();
  //   // Create 2 device users
  //   deviceUsersPage.createNewDeviceUser('testName1', 'testLastName1');
  //   deviceUsersPage.createNewDeviceUser('testName2', 'testLastName2');
  //   users.push(deviceUsersPage.getDeviceUserByName('testName1'));
  //   users.push(deviceUsersPage.getDeviceUserByName('testName2'));
  //   myEformsPage.Navbar.goToFolderPage();
  //   // Create folder
  //   foldersPage.createNewFolder('test folder', 'desc');
  //   folders.push(foldersPage.getFolderByName('test folder'));
  //   myEformsPage.Navbar.goToMyEForms();
  //   // Create e-form
  //   myEformsPage.createNewEform('test Eform');
  // });
  // it('should pair several device users', () => {
  //   console.log('Pairing several device users');
  //   (myEformsPage.idSortBtn()).click();
  //   console.log('Clicking on eform sort id');
  //   const spinnerAnimation = $('#spinner-animation');
  //   spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
  //   browser.pause(1000);
  //   console.log('Getting first eform');
  //   let eform = myEformsPage.getFirstMyEformsRowObj();
  //   console.log('Got first eform');
  //   console.log('Pairing eform');
  //   eform.pair(folders[0], users);
  //   console.log('Paired eform');
  //   //(myEformsPage.getFirstMyEformsRowObj()).pair(folders[0], users);
  //   console.log('Getting first eform');
  //   eform = myEformsPage.getFirstMyEformsRowObj();
  //   console.log('Got first eform');
  //   console.log('Checking if eform is paired');
  //   eform.editPairEformBtn.click();
  //   //(myEformsPage.getFirstMyEformsRowObj()).editPairEformBtn.click();
  //   spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
  //   browser.pause(1000);
  //   (myEformsPage.cancelParingBtn()).waitForDisplayed({ timeout: 40000 });
  //   expect(
  //     ($('mat-tree-node > .selected-folder > div')).getText(),
  //     'Wrong folder selected'
  //   ).contain(`${folders[0].name}`);
  //   //const siteIds = $$('td.cdk-column-siteUId > mtx-grid-cell > span');
  //   const siteIds = $$('#microtingId');
  //   for (let i = 0; i < siteIds.length; i++) {
  //     const index = users.findIndex(
  //       (user) => user.siteId === +siteIds[i].getText()
  //     );
  //     if (index !== -1) {
  //       expect(
  //         ($(`#mat-checkbox-${index}`)).getValue(),
  //         `User ${users[index].siteId} not paired`
  //       ).eq('true');
  //     }
  //   }
  //   (myEformsPage.cancelParingBtn()).click();
  //   browser.pause(1000);
  // });
  // it('should unpair one', () => {
  //   (myEformsPage.getFirstMyEformsRowObj()).unPair([users[1]]);
  //   browser.pause(1000);
  //   const spinnerAnimation = $('#spinner-animation');
  //   (myEformsPage.getFirstMyEformsRowObj()).editPairEformBtn.click();
  //   spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
  //   //($('td.cdk-column-siteUId > mtx-grid-cell > span')).waitForDisplayed({ timeout: 40000 });
  //   //browser.pause(1000);
  //   //const siteIds = $$('td.cdk-column-siteUId > mtx-grid-cell > span');
  //   const siteIds = $$('#microtingId');
  //   for (let i = 0; i < siteIds.length; i++) {
  //     if (users[1].siteId === +(siteIds[i].getText())) {
  //       expect(
  //         ($(`#checkbox${users[1].siteId}-input`)).getAttribute('aria-checked'),
  //         `User ${users[1].siteId} paired`
  //       ).eq('false');
  //     }
  //     if (users[0].siteId === +siteIds[i].getText()) {
  //       expect(
  //         ($(`#checkbox${users[0].siteId}-input`)).getAttribute('aria-checked'),
  //         `User ${users[0].siteId} not paired`
  //       ).eq('true');
  //     }
  //   }
  //   (myEformsPage.cancelParingBtn()).click();
  // });
  // after(() => {
  //   loginPage.open('/');
  //   myEformsPage.Navbar.goToMyEForms();
  //   (myEformsPage.getEformsRowObjByNameEForm('test Eform')).deleteEForm();
  //   myEformsPage.Navbar.goToDeviceUsersPage();
  //   for (let i = 0; i < users.length; i++) {
  //     (deviceUsersPage.getDeviceUserByName(users[i].firstName)).delete();
  //   }
  //   myEformsPage.Navbar.goToFolderPage();
  //   for (let i = 0; i < folders.length; i++) {
  //     (foldersPage.getFolderByName(folders[i].name)).delete();
  //   }
  // });
});
