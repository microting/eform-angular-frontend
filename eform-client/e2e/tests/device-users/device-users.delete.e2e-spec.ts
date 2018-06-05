import {goToDeviceUsersPage} from '../../Helper methods/go-to-pages';
import {signOut, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import {DeviceUsersPage} from '../../Page objects/Device users/DeviceUsersPage';
import {browser, ExpectedConditions} from 'protractor';
import {getMainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {getRowObject} from '../../Page objects/Device users/row-object';


const deviceUsersPage: DeviceUsersPage = new DeviceUsersPage();

describe('Tests for user deletion', function () {
  beforeEach((done) => {
    goToDeviceUsersPage();
    done();
  });
  afterEach((done) => {
    signOut();
    done();
  });

  xdescribe('Device user delete button', function () {
    it('should delete user', async function (done) {
      const initialrowNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = deviceUsersPage.getRowsNumber();
      expect(await initialrowNumber + 1).toEqual(await finalRowSnumber, 'User was not added!');
      waitTillVisibleAndClick(deviceUsersPage.deleteUserButton);
      deviceUsersPage.deleteModal.okButton.click();
      browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const afterDeleteRowCount = deviceUsersPage.getRowsNumber();
      expect(afterDeleteRowCount).toEqual(initialrowNumber);
      done();
    });
  });

  describe('Cancel button in delete modal', function () {
    it('should not delete user', async function (done) {
      const initialrowNumber = await deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = await deviceUsersPage.getRowsNumber();
      const userAdded: boolean = initialrowNumber + 1 === finalRowSnumber;
      expect(userAdded).toBeTruthy('User was not added! -- It doesn\'t mean that deletion does not work,' +
        ' but there\'s trouble with adding person');
      waitTillVisibleAndClick(deviceUsersPage.deleteUserButton);
      deviceUsersPage.deleteModal.cancelButton.click();
      browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const afterDeleteCancel = await deviceUsersPage.getRowsNumber();
      expect(afterDeleteCancel).toEqual(finalRowSnumber, 'User was deleted');
      done();
    });
  });
});

