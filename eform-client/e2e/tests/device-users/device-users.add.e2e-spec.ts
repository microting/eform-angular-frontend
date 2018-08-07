import {Navbar} from '../../Page objects/Navbar';
import {goToDeviceUsersPage} from '../../Helper methods/go-to-pages';
import {DeviceUsersPage} from '../../Page objects/Device users/DeviceUsersPage';
import {browser, ExpectedConditions} from 'protractor';
import {signOut} from '../../Helper methods/other-helper-methods';
import {getRowObject} from '../../Page objects/Device users/row-object';
import data from '../../data';

const deviceUsersPage: DeviceUsersPage = new DeviceUsersPage();

describe('Tests for adding users', function () {

  afterAll(async () => {
    await signOut();
  });

  describe('Should add new device user', function () {
    beforeAll(async () => {
      await goToDeviceUsersPage();
    });
    afterAll(async () => {
      console.log('Cleanup began');
      await deviceUsersPage.usersCleanup();
      console.log('Cleanup finished');
    });
    it('with first name and last name', async () => {
      const initialrowNumber = await deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.fillFirstNameInput();
      await deviceUsersPage.addNewUserModal.fillLastNameInput();
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = await deviceUsersPage.getRowsNumber();
      const lastUser = await getRowObject(finalRowsNumber);
      expect(initialrowNumber + 1).toEqual(finalRowsNumber);
      expect(lastUser.firstName).toBe(data.DeviceUsersPage.sampleFirstName);
      expect(lastUser.lastName).toBe(data.DeviceUsersPage.sampleLastName);
    });
    it('with only first name', async () => {
      const initialrowNumber = await deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.fillFirstNameInput();
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = await deviceUsersPage.getRowsNumber();
      const lastUser = await getRowObject(finalRowsNumber);
      expect(initialrowNumber + 1).toEqual(finalRowsNumber);
      expect(lastUser.firstName).toBe(data.DeviceUsersPage.sampleFirstName);
      expect(lastUser.lastName).toBe(data.DeviceUsersPage.notAvaliableName);

    });
    it('with only last name', async () => {
      const initialRowsNumber = await deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.fillLastNameInput();
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = await deviceUsersPage.getRowsNumber();
      const lastUser = await getRowObject(finalRowsNumber);
      expect(initialRowsNumber + 1).toEqual(finalRowsNumber);
      expect(lastUser.firstName).toBe(data.DeviceUsersPage.notAvaliableName);
      expect(lastUser.lastName).toBe(data.DeviceUsersPage.sampleLastName);
    });

  });

  describe('Should not add add new device user', function () {
    it('without first and last names', async () => {
      const initialRowsNumber = deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await deviceUsersPage.addNewUserModal.save();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = await deviceUsersPage.getRowsNumber();
      expect(initialRowsNumber).toEqual(finalRowsNumber);
    });
    it('if cancel was clicked', async () => {
      const initialRowsNumber = await deviceUsersPage.getRowsNumber();
      await deviceUsersPage.newDeviceUserButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      await browser.sleep(4000);
      await deviceUsersPage.addNewUserModal.cancelButton.click();
      await browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = await deviceUsersPage.getRowsNumber();
      expect(initialRowsNumber).toEqual(finalRowsNumber);
    });
  });
});


