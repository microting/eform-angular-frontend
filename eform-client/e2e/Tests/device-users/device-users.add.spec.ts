import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../Helpers/helper-functions';

import {expect} from 'chai';
const nameDeviceUser = generateRandmString();
let countDeviceUsersBeforeCreating = 0;

describe('Device users page should add new device user', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 41000 });
    // browser.pause(8000);
  });
  it('with first name and last name', async () => {
    const surname = generateRandmString();
    const rowCountBeforeCreation = await deviceUsersPage.rowNum();
    // browser.pause(2000);
    countDeviceUsersBeforeCreating = rowCountBeforeCreation;
    await deviceUsersPage.createNewDeviceUser(nameDeviceUser, surname);
    const rowCountAfterCreation = await deviceUsersPage.rowNum();
    expect(
      rowCountAfterCreation,
      'Number of rows hasn\'t changed after creating new user'
    ).equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').equal(
      nameDeviceUser
    );
    expect(
      lastDeviceUser.lastName,
      'Last name of created user is incorrect'
    ).equal(surname);
  });
});
describe('Device users page should not add new device user', async () => {
  it('with only first name', async () => {
    // $('#newDeviceUserBtn').waitForDisplayed({timeout: 40000});
    const name = generateRandmString();
    // browser.refresh();
    // browser.pause(8000);
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await (await $('#newDeviceUserBtn')).waitForClickable({ timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await $('#firstName').waitForDisplayed({ timeout: 10000 });
    await (await deviceUsersPage.createFirstNameInput()).setValue(name);
    expect(
      await (await deviceUsersPage.saveCreateBtn()).isEnabled(),
      'Create button in modal window while creating new device user is active when only name is provided'
    ).equal(false);

    await (await deviceUsersPage.cancelCreateBtn()).click();
    await browser.pause(500);
  });
  it('with only last name', async () => {
    // browser.waitForEnabled('#newDeviceUserBtn', 20000);
    const lastName = generateRandmString();
    // browser.refresh();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await $('#firstName').waitForDisplayed({ timeout: 10000 });
    await (await deviceUsersPage.createLastNameInput()).setValue(lastName);
    expect(
      await (await deviceUsersPage.saveCreateBtn()).isEnabled(),
      'Create button in modal window while creating new device user is active when only last name is provided'
    ).equal(false);

    await (await deviceUsersPage.cancelCreateBtn()).click();
    await browser.pause(500);
    // browser.refresh();
  });
  it('without first and last names', async () => {
    // browser.refresh();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await browser.pause(500);
    await $('#firstName').waitForDisplayed({ timeout: 10000 });
    expect(
      await (await deviceUsersPage.saveCreateBtn()).isEnabled(),
      'Create button in modal window while creating new device user is active when both first name and last name are not provided'
    ).equal(false);
    await (await deviceUsersPage.cancelCreateBtn()).click();
    await browser.pause(500);
    // browser.refresh();
  });
  it('if cancel was clicked', async () => {
    const rowCountBeforeCreation = await deviceUsersPage.rowNum();
    // browser.refresh();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await (await deviceUsersPage.newDeviceUserBtn()).click();
    await $('#firstName').waitForDisplayed({ timeout: 10000 });
    await browser.pause(500);
    await (await deviceUsersPage.cancelCreateBtn()).click();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await browser.pause(500);
    const rowCountAfterCreation = await deviceUsersPage.rowNum();
    expect(
      rowCountAfterCreation,
      'Number of rows has changed after cancel'
    ).equal(rowCountBeforeCreation);
    // browser.refresh();
  });
  it('should clean up', async () => {
    await (await deviceUsersPage.getDeviceUserByName(nameDeviceUser)).delete();
    await expect(await deviceUsersPage.rowNum()).equal(countDeviceUsersBeforeCreating);
  });
});
