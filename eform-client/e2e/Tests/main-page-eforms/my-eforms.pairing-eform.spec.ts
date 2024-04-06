import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../../Page objects/DeviceUsers.page';
import foldersPage, { FoldersRowObject } from '../../Page objects/Folders.page';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
const users = new Array<DeviceUsersRowObject>();
const folders = new Array<FoldersRowObject>();
describe('Main page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    // Create 2 device users
    await deviceUsersPage.createNewDeviceUser('testName1', 'testLastName1');
    await deviceUsersPage.createNewDeviceUser('testName2', 'testLastName2');
    users.push(await deviceUsersPage.getDeviceUserByName('testName1'));
    users.push(await deviceUsersPage.getDeviceUserByName('testName2'));
    await myEformsPage.Navbar.goToFolderPage();
    // Create folder
    await foldersPage.createNewFolder('test folder', 'desc');
    folders.push(await foldersPage.getFolderByName('test folder'));
    await myEformsPage.Navbar.goToMyEForms();
    // Create e-form
    await myEformsPage.createNewEform('test Eform');
  });
  it('should pair several device users', async () => {
    await (await myEformsPage.idSortBtn()).click();
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await browser.pause(1000);
    let eform = await myEformsPage.getFirstMyEformsRowObj();
    await eform.pair(folders[0], users);
    //await (await myEformsPage.getFirstMyEformsRowObj()).pair(folders[0], users);
    eform = await myEformsPage.getFirstMyEformsRowObj();
    await eform.editPairEformBtn.click();
    //await (await myEformsPage.getFirstMyEformsRowObj()).editPairEformBtn.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await browser.pause(1000);
    await (await myEformsPage.cancelParingBtn()).waitForDisplayed({ timeout: 40000 });
    expect(
      await (await $('mat-tree-node > .selected-folder > div')).getText(),
      'Wrong folder selected'
    ).contain(`${folders[0].name}`);
    //const siteIds = await $$('td.cdk-column-siteUId > mtx-grid-cell > span');
    const siteIds = await $$('#microtingId');
    for (let i = 0; i < siteIds.length; i++) {
      const index = users.findIndex(
        (user) => user.siteId === +siteIds[i].getText()
      );
      if (index !== -1) {
        expect(
          await (await $(`#mat-checkbox-${index}`)).getValue(),
          `User ${users[index].siteId} not paired`
        ).eq('true');
      }
    }
    await (await myEformsPage.cancelParingBtn()).click();
    await browser.pause(1000);
  });
  it('should unpair one', async () => {
    await (await myEformsPage.getFirstMyEformsRowObj()).unPair([users[1]]);
    await browser.pause(1000);
    const spinnerAnimation = await $('#spinner-animation');
    (await myEformsPage.getFirstMyEformsRowObj()).editPairEformBtn.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    //await (await $('td.cdk-column-siteUId > mtx-grid-cell > span')).waitForDisplayed({ timeout: 40000 });
    //await browser.pause(1000);
    //const siteIds = await $$('td.cdk-column-siteUId > mtx-grid-cell > span');
    const siteIds = await $$('#microtingId');
    for (let i = 0; i < siteIds.length; i++) {
      if (users[1].siteId === +(await siteIds[i].getText())) {
        expect(
          await (await $(`#checkbox${users[1].siteId}-input`)).getProperty('checked'),
          `User ${users[1].siteId} paired`
        ).eq(false);
      }
      if (users[0].siteId === +siteIds[i].getText()) {
        expect(
          await (await $(`#checkbox${users[0].siteId}-input`)).getProperty('checked'),
          `User ${users[0].siteId} not paired`
        ).eq(true);
      }
    }
    await (await myEformsPage.cancelParingBtn()).click();
  });
  after(async () => {
    await browser.pause(1000);
    //await loginPage.open('/');
    //const newEFormBtn = await $('#newEFormBtn');
    //await newEFormBtn.waitForDisplayed({timeout: 60000});
    //await newEFormBtn.waitForClickable({timeout: 60000});
    //await myEformsPage.Navbar.goToMyEForms();
    await (await myEformsPage.getEformsRowObjByNameEForm('test Eform')).deleteEForm();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    for (let i = 0; i < users.length; i++) {
      await (await deviceUsersPage.getDeviceUserByName(users[i].firstName)).delete();
    }
    await myEformsPage.Navbar.goToFolderPage();
    for (let i = 0; i < folders.length; i++) {
      await (await foldersPage.getFolderByName(folders[i].name)).delete();
    }
  });
});
