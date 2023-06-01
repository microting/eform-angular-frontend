import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../../Page objects/DeviceUsers.page';
import foldersPage, { FoldersRowObject } from '../../Page objects/Folders.page';

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
    console.log('Pairing several device users');
    await (await myEformsPage.idSortBtn()).click();
    console.log('Clicking on eform sort id');
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    await browser.pause(1000);
    console.log('Getting first eform');
    let eform = await myEformsPage.getFirstMyEformsRowObj();
    console.log('Got first eform');
    console.log('Pairing eform');
    await eform.pair(folders[0], users);
    console.log('Paired eform');
    //await (await myEformsPage.getFirstMyEformsRowObj()).pair(folders[0], users);
    console.log('Getting first eform');
    eform = await myEformsPage.getFirstMyEformsRowObj();
    console.log('Got first eform');
    console.log('Checking if eform is paired');
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
    await (await myEformsPage.getFirstMyEformsRowObj()).editPairEformBtn.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 40000, reverse: true });
    //await (await $('td.cdk-column-siteUId > mtx-grid-cell > span')).waitForDisplayed({ timeout: 40000 });
    //await browser.pause(1000);
    //const siteIds = await $$('td.cdk-column-siteUId > mtx-grid-cell > span');
    const siteIds = await $$('#microtingId');
    for (let i = 0; i < siteIds.length; i++) {
      if (users[1].siteId === +(await siteIds[i].getText())) {
        const checkbox = await $(`#checkbox${users[1].siteId}-input`);
        expect(await checkbox.getProperty('checked')).eq(false, {message: `User ${users[1].siteId} paired`});
      }
      if (users[0].siteId === +siteIds[i].getText()) {
        const checkbox = await $(`#checkbox${users[0].siteId}-input`);
        expect(await checkbox.getProperty('checked')).eq(true, {message: `User ${users[0].siteId} not paired`});
      }
    }
    await (await myEformsPage.cancelParingBtn()).click();
  });
  after(async () => {
    await loginPage.open('/');
    await myEformsPage.Navbar.goToMyEForms();
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
