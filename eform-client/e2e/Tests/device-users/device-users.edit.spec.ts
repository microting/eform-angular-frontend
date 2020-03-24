import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Device users page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    const firstName = Guid.create().toString();
    const lastName = Guid.create().toString();
    $('#newDeviceUserBtn').waitForDisplayed(10000);
    deviceUsersPage.createNewDeviceUser(firstName, lastName);
  });
  it('should change first name', function () {
    const newName = Guid.create().toString();
    const lastDeviceUserBeforeEdit = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, newName, null);
    browser.pause(2000);
    const lastDeviceUserAfterEdit = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    $('#newDeviceUserBtn').waitForDisplayed(20000);
    expect(lastDeviceUserAfterEdit.firstName, 'First name has changed incorrectly').equal(newName);
    expect(lastDeviceUserAfterEdit.lastName, 'Last name has changed after changing only first name').equal(lastDeviceUserBeforeEdit.lastName);
  });
  it('should change last name', function () {
    const newSurname = Guid.create().toString();
    const lastDeviceUserBeforeEdit = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, null, newSurname);
    browser.pause(2000);
    const lastDeviceUserAfterEdit = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    $('#newDeviceUserBtn').waitForDisplayed(20000);
    expect(lastDeviceUserAfterEdit.lastName, 'Last name has changed incorrectly').equal(newSurname);
    expect(lastDeviceUserAfterEdit.firstName, 'First name has changed after changing only last name').equal(lastDeviceUserBeforeEdit.firstName);
  });
  it('should change first name and last name', function () {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    const lastDeviceUserBeforeEdit = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    deviceUsersPage.editDeviceUser(lastDeviceUserBeforeEdit, newName, newSurname);
    browser.pause(2000);
    const lastDeviceUserAfterEdit = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    $('#newDeviceUserBtn').waitForDisplayed(20000);
    expect(lastDeviceUserAfterEdit.firstName, 'First name has changed incorrectly').equal(newName);
    expect(lastDeviceUserAfterEdit.lastName, 'Last name has changed incorrectly').equal(newSurname);
  });
  it('should not change first name and last name if cancel was clicked', function () {
    const newName = Guid.create().toString();
    const newSurname = Guid.create().toString();
    const rowNumBeforeEdit = deviceUsersPage.rowNum;
    const lastDeviceUserBeforeEdit = deviceUsersPage.getDeviceUser(rowNumBeforeEdit);
    lastDeviceUserBeforeEdit.editBtn.click();
    // browser.pause(4000);
    $('#editFirstNameInput').waitForDisplayed(10000);
    deviceUsersPage.editFirstNameInput.click();
    deviceUsersPage.editFirstNameInput.clearElement();
    deviceUsersPage.editFirstNameInput.setValue(newName);
    deviceUsersPage.editLastNameInput.click();
    deviceUsersPage.editLastNameInput.clearElement();
    deviceUsersPage.editLastNameInput.setValue(newSurname);
    deviceUsersPage.cancelEditBtn.click();
    // browser.pause(12000);
    $('#newDeviceUserBtn').waitForDisplayed(20000);
    const rowNumAfterEdit = deviceUsersPage.rowNum;
    expect(rowNumBeforeEdit).equal(rowNumAfterEdit);
    const lastDeviceUserAfterEdit = deviceUsersPage.getDeviceUser(rowNumAfterEdit);
    expect(lastDeviceUserAfterEdit.firstName, 'First name has changed').equal(lastDeviceUserAfterEdit.firstName);
    expect(lastDeviceUserAfterEdit.lastName, 'Last name has changed').equal(lastDeviceUserAfterEdit.lastName);
  });
})
;
