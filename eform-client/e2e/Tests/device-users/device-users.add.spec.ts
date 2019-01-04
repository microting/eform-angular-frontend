import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {DeviceUsersRowObject} from '../../Page objects/DeviceUsers.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Device users page should add new device user', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    browser.pause(8000)
  });
  it('with first name and last name', function () {
    const name = 'John Noname';
    const surname = 'Doe';
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    deviceUsersPage.createNewDeviceUser(name, surname);
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new user').equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').equal(name);
    expect(lastDeviceUser.lastName, 'Last name of created user is incorrect').equal(surname);
    lastDeviceUser.deleteBtn.click();
  });
});
describe('Device users page should not add new device user', function () {
  afterEach(function () {
    browser.refresh();
    myEformsPage.Navbar.goToDeviceUsersPage();
  });
  // TODO fix SDK to be able to tests this!
  // it('with only first name', function () {
  //   const name = generateRandmString();
  //   deviceUsersPage.newDeviceUserBtn.click();
  //   browser.pause(4000);
  //   deviceUsersPage.createFirstNameInput.setValue(name);
  //   expect(deviceUsersPage.saveCreateBtn.isEnabled(),
  //     'Create button in modal window while creating new device user is active when only name is provided').equal(false);
  // });
  it('with only last name', function () {
    const lastName = generateRandmString();
    browser.refresh();
    browser.pause(8000);
    deviceUsersPage.newDeviceUserBtn.click();
    browser.pause(4000);
    deviceUsersPage.createLastNameInput.setValue(lastName);
    expect(deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when only last name is provided').equal(false);
  });
  it('without first and last names', function () {
    browser.refresh();
    browser.pause(8000);
    deviceUsersPage.newDeviceUserBtn.click();
    browser.pause(4000);
    expect(deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when both first name and last name are not provided').equal(
        false);
  });
  it('if cancel was clicked', function () {
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    browser.refresh();
    browser.pause(8000);
    deviceUsersPage.newDeviceUserBtn.click();
    browser.pause(4000);
    deviceUsersPage.cancelCreateBtn.click();
    browser.pause(4000);
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows has changed after cancel').equal(rowCountBeforeCreation);
  });
});
