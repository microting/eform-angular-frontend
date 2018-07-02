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
  beforeAll(async () => {
    await goToDeviceUsersPage();
  });
  afterAll(async () => {
    await signOut();
  });
  describe('User edit button', function () {
    beforeEach(async () => {
      console.log('Adding person');
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.fillFirstNameInput();
      await deviceUsersPage.addNewUserModal.fillLastNameInput();
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
    });
    it('should edit first and last names', async () => {
      const user = await getRowObject(await deviceUsersPage.getRowsNumber());
      await user.editButton.click();
      await editUserPage.fillInputs();
      await editUserPage.save();
      await browser.wait(ExpectedConditions.elementToBeClickable(deviceUsersPage.newDeviceUserButton));
      const changedUser = await getRowObject(await deviceUsersPage.getRowsNumber());
      expect(changedUser.firstName).toBe(data.DeviceUsersPage.sampleEditFistName);
      expect(changedUser.lastName).toBe(data.DeviceUsersPage.sampleEditLastName);
    });
  });
});
