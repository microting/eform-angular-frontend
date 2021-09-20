import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage, {
  DeviceUsersRowObject,
} from '../../Page objects/DeviceUsers.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameDeviceUser = generateRandmString();
let countDeviceUsersBeforeCreating = 0;

describe('Device users page should add new device user', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 40000 });
    // browser.pause(8000);
  });
  it('with first name and last name', async () => {
    const surname = generateRandmString();
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    // browser.pause(2000);
    countDeviceUsersBeforeCreating = rowCountBeforeCreation;
    deviceUsersPage.createNewDeviceUser(nameDeviceUser, surname);
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(
      rowCountAfterCreation,
      "Number of rows hasn't changed after creating new user"
    ).equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = deviceUsersPage.getDeviceUser(
      deviceUsersPage.rowNum
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
  afterEach(async () => {
    // browser.refresh();
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    // browser.pause(8000);
    // $('#newDeviceUserBtn').waitForDisplayed({timeout: 40000});
  });
  it('with only first name', async () => {
    // $('#newDeviceUserBtn').waitForDisplayed({timeout: 40000});
    const name = generateRandmString();
    // browser.refresh();
    // browser.pause(8000);
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 40000 });
    $('#newDeviceUserBtn').waitForClickable({ timeout: 40000 });
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({ timeout: 10000 });
    deviceUsersPage.createFirstNameInput.setValue(name);
    expect(
      deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when only name is provided'
    ).equal(false);
    // browser.refresh();
  });
  it('with only last name', async () => {
    // browser.waitForEnabled('#newDeviceUserBtn', 20000);
    const lastName = generateRandmString();
    // browser.refresh();
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 40000 });
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({ timeout: 10000 });
    deviceUsersPage.createLastNameInput.setValue(lastName);
    expect(
      deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when only last name is provided'
    ).equal(false);
    // browser.refresh();
  });
  it('without first and last names', async () => {
    // browser.refresh();
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 40000 });
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({ timeout: 10000 });
    expect(
      deviceUsersPage.saveCreateBtn.isEnabled(),
      'Create button in modal window while creating new device user is active when both first name and last name are not provided'
    ).equal(false);
    // browser.refresh();
  });
  it('if cancel was clicked', async () => {
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    // browser.refresh();
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 40000 });
    deviceUsersPage.newDeviceUserBtn.click();
    $('#firstName').waitForDisplayed({ timeout: 10000 });
    deviceUsersPage.cancelCreateBtn.click();
    $('#newDeviceUserBtn').waitForDisplayed({ timeout: 40000 });
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(
      rowCountAfterCreation,
      'Number of rows has changed after cancel'
    ).equal(rowCountBeforeCreation);
    // browser.refresh();
  });
  it('should clean up', async () => {
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    deviceUsersPage.getDeviceUserByName(nameDeviceUser).delete();
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    // browser.refresh();
    expect(deviceUsersPage.rowNum).equal(countDeviceUsersBeforeCreating);
  });
});
