import {goToDeviceUsersPage} from '../Helper methods/go-to-pages';
import {signOut} from '../Helper methods/other-helper-methods';
import {DeviceUsersPage} from '../Page objects/Device users/DeviceUsersPage';
import {browser, ExpectedConditions} from 'protractor';


const deviceUsersPage: DeviceUsersPage = new DeviceUsersPage();

describe('Tests for user deletion', function () {
  beforeAll((done) => {
    goToDeviceUsersPage();
    done();
  });
  afterAll((done) => {
    signOut();
    done();
  });

  describe('Device user delete button', function () {
    it('should delete user', async function (done) {
      console.log('Adding person');
      const initialrowNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = deviceUsersPage.getRowsNumber();
      expect(await initialrowNumber + 1).toEqual(await finalRowSnumber, 'User was not added!');
      deviceUsersPage.deleteUserButton.click();
      deviceUsersPage.deleteModal.okButton.click();
      browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const afterDeleteRowCount = deviceUsersPage.getRowsNumber();
      expect(await afterDeleteRowCount).toEqual(await initialrowNumber);
      done();
    });
  });

  describe('Cancel button in delete modal', function () {
    it('should not delete user', async function (done) {
      console.log('Adding person');
      const initialrowNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = deviceUsersPage.getRowsNumber();
      expect(await initialrowNumber + 1).toEqual(await finalRowSnumber, 'User was not added!');
      deviceUsersPage.deleteUserButton.click();
      deviceUsersPage.deleteModal.cancelButton.click();
      browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const afterDeleteCancel = deviceUsersPage.getRowsNumber();
      expect(await afterDeleteCancel).toEqual(await initialrowNumber + 1);
      done();
    });
  });
});

