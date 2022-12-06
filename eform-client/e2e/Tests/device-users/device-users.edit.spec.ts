import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';
import { Guid } from 'guid-typescript';

const expect = require('chai').expect;

describe('Device users page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const firstName = Guid.create().toString();
    const lastName = Guid.create().toString();
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    await deviceUsersPage.createNewDeviceUser(firstName, lastName);
  });
  it('should change first name', async () => {
    const newName = Guid.create().toString();
    await (await $('#deviceUserFirstName')).waitForDisplayed({ timeout: 40000 });
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, newName, null);
    await browser.pause(2000);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    expect(
      lastDeviceUserAfterEdit.firstName,
      'First name has changed incorrectly'
    ).equal(newName);
    expect(
      lastDeviceUserAfterEdit.lastName,
      'Last name has changed after changing only first name'
    ).equal(lastDeviceUserBeforeEdit.lastName);
  });
  it('should change last name', async () => {
    const newSurname = Guid.create().toString();
    await (await $('#deviceUserFirstName')).waitForDisplayed({ timeout: 40000 });
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, null, newSurname);
    await browser.pause(2000);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    expect(
      lastDeviceUserAfterEdit.lastName,
      'Last name has changed incorrectly'
    ).equal(newSurname);
    expect(
      lastDeviceUserAfterEdit.firstName,
      'First name has changed after changing only last name'
    ).equal(lastDeviceUserBeforeEdit.firstName);
  });
  it('should change first name and last name', async () => {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    await (await $('#deviceUserFirstName')).waitForDisplayed({ timeout: 40000 });
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await deviceUsersPage.editDeviceUser(
      lastDeviceUserBeforeEdit,
      newName,
      newSurname
    );
    await browser.pause(2000);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    expect(
      lastDeviceUserAfterEdit.firstName,
      'First name has changed incorrectly'
    ).equal(newName);
    expect(
      lastDeviceUserAfterEdit.lastName,
      'Last name has changed incorrectly'
    ).equal(newSurname);
  });
  it('should not change first name and last name if cancel was clicked', async () => {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    const rowNumBeforeEdit = await deviceUsersPage.rowNum();
    const lastDeviceUserBeforeEdit = await deviceUsersPage.getDeviceUser(
      rowNumBeforeEdit
    );
    await lastDeviceUserBeforeEdit.editBtn.click();
    // browser.pause(4000);
    await (await $('#firstName')).waitForDisplayed({ timeout: 10000 });
    await (await deviceUsersPage.editFirstNameInput()).click();
    await (await deviceUsersPage.editFirstNameInput()).clearValue();
    await (await deviceUsersPage.editFirstNameInput()).setValue(newName);
    await (await deviceUsersPage.editLastNameInput()).click();
    await (await deviceUsersPage.editLastNameInput()).clearValue();
    await (await deviceUsersPage.editLastNameInput()).setValue(newSurname);
    await (await deviceUsersPage.cancelEditBtn()).click();
    // browser.pause(12000);
    await (await $('#newDeviceUserBtn')).waitForDisplayed({ timeout: 40000 });
    const rowNumAfterEdit = await deviceUsersPage.rowNum();
    expect(rowNumBeforeEdit).equal(rowNumAfterEdit);
    const lastDeviceUserAfterEdit = await deviceUsersPage.getDeviceUser(
      rowNumAfterEdit
    );
    expect(lastDeviceUserAfterEdit.firstName, 'First name has changed').equal(
      lastDeviceUserAfterEdit.firstName
    );
    expect(lastDeviceUserAfterEdit.lastName, 'Last name has changed').equal(
      lastDeviceUserAfterEdit.lastName
    );
  });
});
