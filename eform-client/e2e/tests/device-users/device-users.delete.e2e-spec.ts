import {goToDeviceUsersPage} from '../../Helper methods/go-to-pages';
import {signOut, waitTillVisibleAndClick} from '../../Helper methods/other-helper-methods';
import {DeviceUsersPage} from '../../Page objects/Device users/DeviceUsersPage';
import {browser, ExpectedConditions} from 'protractor';
import {getMainPageRowObject} from '../../Page objects/Main Page/mainPage.row-object';
import {getRowObject} from '../../Page objects/Device users/row-object';

const deviceUsersPage: DeviceUsersPage = new DeviceUsersPage();

describe('Tests for user deletion', function () {
  beforeEach(async () => {
    await goToDeviceUsersPage();
  });
  afterEach(async () => {
    await signOut();
  });

  describe('Device user delete button', function() {
    it('should delete user', async  () => {
      const initialrowNumber = await deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.fillFirstNameInput();
      await deviceUsersPage.addNewUserModal.fillLastNameInput();
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = deviceUsersPage.getRowsNumber();
      expect(initialrowNumber + 1).toEqual(finalRowSnumber, 'User was not added!');
      await waitTillVisibleAndClick(deviceUsersPage.deleteUserButton);
      await deviceUsersPage.deleteModal.okButton.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const afterDeleteRowCount = deviceUsersPage.getRowsNumber();
      expect(afterDeleteRowCount).toEqual(initialrowNumber);
    });
  });

  describe('Cancel button in delete modal', function () {
    it('should not delete user', async  () => {
      const initialrowNumber = await deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.fillFirstNameInput();
      await deviceUsersPage.addNewUserModal.fillLastNameInput();
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = await deviceUsersPage.getRowsNumber();
      const userAdded: boolean = initialrowNumber + 1 === finalRowSnumber;
      expect(userAdded).toBeTruthy('User was not added! -- It doesn\'t mean that deletion does not work,' +
        ' but there\'s trouble with adding person');
      await waitTillVisibleAndClick(deviceUsersPage.deleteUserButton);
      await deviceUsersPage.deleteModal.cancelButton.click();
      await browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const afterDeleteCancel = await deviceUsersPage.getRowsNumber();
      expect(afterDeleteCancel).toEqual(finalRowSnumber, 'User was deleted');
    });
  });
});

