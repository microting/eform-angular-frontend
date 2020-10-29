import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {DeviceUsersRowObject} from '../../Page objects/DeviceUsers.page';
import {generateRandmString} from '../../Helpers/helper-functions';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;

describe('Device users page should add new device user', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    // browser.pause(8000);
  });
  it('with first name and last name', function () {
    const name = Guid.create().toString();
    const surname = Guid.create().toString();
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    //browser.pause(2000);
    deviceUsersPage.createNewDeviceUser(name, surname);
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new user').equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').equal(name);
    expect(lastDeviceUser.lastName, 'Last name of created user is incorrect').equal(surname);
  });
});
describe('Device users page should not add new device user', function () {
  afterEach(function () {
    //browser.refresh();
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    // browser.pause(8000);
    // $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
  });
  it('with only first name', function () {
    // $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    const name = generateRandmString();
    // browser.refresh();
    //browser.pause(8000);
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    $('#newDeviceUserBtn').waitForClickable({ timeout: 20000});
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({timeout: 10000});
    deviceUsersPage.createFirstNameInput.setValue(name);
    expect(deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when only name is provided').equal(false);
    //browser.refresh();
  });
  it('with only last name', function () {
    // browser.waitForEnabled('#newDeviceUserBtn', 20000);
    const lastName = generateRandmString();
    // browser.refresh();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({timeout: 10000});
    deviceUsersPage.createLastNameInput.setValue(lastName);
    expect(deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when only last name is provided').equal(false);
    //browser.refresh();
  });
  it('without first and last names', function () {
    // browser.refresh();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({timeout: 10000});
    expect(deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when both first name and last name are not provided').equal(
        false);
    //browser.refresh();
  });
  it('if cancel was clicked', function () {
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    // browser.refresh();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({timeout: 10000});
    deviceUsersPage.cancelCreateBtn.click();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 10000});
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows has changed after cancel').equal(rowCountBeforeCreation);
    //browser.refresh();
  });
  it('should clean up', function(){
    const lastDeviceUser = deviceUsersPage.getFirstRowObject();
    lastDeviceUser.deleteBtn.click();
    $('#saveDeleteBtn').waitForDisplayed({timeout: 10000});
    deviceUsersPage.saveDeleteBtn.click();
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    //browser.refresh();
    expect(deviceUsersPage.rowNum).equal(0);
  });
});
