import {goToDeviceUsersPage} from '../../Helper methods/go-to-pages';
import {signOut} from '../../Helper methods/other-helper-methods';
import {browser, ExpectedConditions} from 'protractor';
import {DeviceUsersPage} from '../../Page objects/Device users/DeviceUsersPage';
import {getRowObject} from '../../Page objects/Device users/row-object';
import {EditUserPage} from '../../Page objects/Device users/EditUserPage';
import data from '../../data';

const deviceUsersPage = new DeviceUsersPage();
const editUserPage = new EditUserPage();

describe('Edit user tests', function () {
  beforeAll(done => {
    goToDeviceUsersPage();
    done();
  });
  afterAll(done => {
    signOut();
    done();
  });
  describe('User edit button', function () {
    beforeEach(function () {
      console.log('Adding person');
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
    });
    it('should edit first and last names', async function (done) {
      const user = getRowObject(await deviceUsersPage.getRowsNumber());
      user.editButton.click();
      editUserPage.fillInputs();
      editUserPage.save();
      browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const changedUser = getRowObject(await deviceUsersPage.getRowsNumber());
      expect(changedUser.firstName).toBe(data.DeviceUsersPage.sampleEditFistName);
      expect(changedUser.lastName).toBe(data.DeviceUsersPage.sampleEditLastName);
      done();
    });
  });
});
