import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {DeviceUsersRowObject} from '../../Page objects/DeviceUsers.page';
import foldersPage, {FoldersRowObject} from '../../Page objects/Folders.page';

const expect = require('chai').expect;
const users = new Array<DeviceUsersRowObject>();
const folders = new Array<FoldersRowObject>();
describe('Main page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    // Create 2 device users
    deviceUsersPage.createNewDeviceUser('testName1', 'testLastName1');
    deviceUsersPage.createNewDeviceUser('testName2', 'testLastName2');
    for (let i = 1; i < deviceUsersPage.rowNum + 1; i++) {
      const deviceUser = deviceUsersPage.getDeviceUser(i);
      if (deviceUser && (deviceUser.firstName === 'testName1' || deviceUser.firstName === 'testName2')
        && (deviceUser.lastName === 'testLastName1' || deviceUser.lastName === 'testLastName2')) {
        users.push(deviceUser);
      }
    }
    myEformsPage.Navbar.goToFolderPage();
    // Create folder
    foldersPage.createNewFolder('test folder', 'desc');
    for (let i = 1; i < foldersPage.rowNum + 1; i++) {
      const folder = foldersPage.getFolder(i);
      if (folder && (folder.name === 'test folder')) {
        folders.push(folder);
      }
    }
    myEformsPage.Navbar.goToMyEForms();
    // Create e-form
    myEformsPage.createNewEform('test Eform');
  });
  it('should pair several device users', function () {
    myEformsPage.idSortBtn.click();
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    browser.pause(1000);
    myEformsPage.getFirstMyEformsRowObj().pair(folders[0], users);
    myEformsPage.getFirstMyEformsRowObj().editPairEformBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    myEformsPage.cancelParingBtn.waitForDisplayed({timeout: 20000});
    browser.pause(1000);
    expect($('tree-node .node-content-wrapper-active').getText(),
      'Wrong folder selected')
      .eq(`${folders[0].name}`);
    const siteIds = $$('#microtingId');
    for (let i = 0; i < siteIds.length; i++) {
      const index = users.findIndex(user => user.siteId === +siteIds[i].getText());
      if (index !== -1) {
        expect($(`#checkbox${users[index].siteId}`).getValue(),
          `User ${users[index].siteId} not paired`).eq('true');
      }
    }
    myEformsPage.cancelParingBtn.click();
    browser.pause(1000);
  });
  it('should unpair one', function () {
    myEformsPage.getFirstMyEformsRowObj().unPair([users[1]]);
    const spinnerAnimation = $('#spinner-animation');
    myEformsPage.getFirstMyEformsRowObj().editPairEformBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 20000, reverse: true});
    $('#microtingId').waitForDisplayed({timeout: 20000});
    browser.pause(1000);
    const siteIds = $$('#microtingId');
    for (let i = 0; i < siteIds.length; i++) {
      if (users[1].siteId === +siteIds[i].getText()) {
        expect($(`#checkbox${users[1].siteId}`).getValue(),
          `User ${users[1].siteId} paired`).eq('false');
      }
      if (users[0].siteId === +siteIds[i].getText()) {
        expect($(`#checkbox${users[0].siteId}`).getValue(),
          `User ${users[0].siteId} not paired`).eq('true');
      }
    }
    myEformsPage.cancelParingBtn.click();
  });
  after(function () {
    myEformsPage.getFirstMyEformsRowObj().deleteEForm();
    myEformsPage.Navbar.goToDeviceUsersPage();
    for (let i = deviceUsersPage.rowNum; i > 0; i--) {
      const deviceUser = deviceUsersPage.getDeviceUser(i);
      if (deviceUser && (deviceUser.firstName === 'testName1' || deviceUser.firstName === 'testName2')
        && (deviceUser.lastName === 'testLastName1' || deviceUser.lastName === 'testLastName2')) {
        deviceUser.delete();
        browser.pause(1000);
      }
    }
    myEformsPage.Navbar.goToFolderPage();
    for (let i = 1; i < foldersPage.rowNum + 1; i++) {
      const folder = foldersPage.getFolder(i);
      if (folder && (folder.name === 'test folder')) {
        folder.delete();
        browser.pause(1000);
      }
    }
  });
});
