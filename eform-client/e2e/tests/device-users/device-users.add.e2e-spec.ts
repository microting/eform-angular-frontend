import {Navbar} from '../../Page objects/Navbar';
import {goToDeviceUsersPage} from '../../Helper methods/go-to-pages';
import {DeviceUsersPage} from '../../Page objects/Device users/DeviceUsersPage';
import {browser, ExpectedConditions} from 'protractor';
import {signOut} from '../../Helper methods/other-helper-methods';
import {getRowObject} from '../../Page objects/Device users/row-object';
import data from '../../data';

const navbar: Navbar = new Navbar();
const deviceUsersPage: DeviceUsersPage = new DeviceUsersPage();

describe('Tests for adding users', function () {

  afterAll((done) => {
    signOut();
    done();
  });

  describe('Should add new device user', function () {
    beforeAll(function () {
      goToDeviceUsersPage();
    });
    afterAll(async function (done) {
      console.log('Cleanup began');
      await deviceUsersPage.usersCleanup();
      console.log('Cleanup finished');
      done();
    });
    it('with first name and last name', async function (done) {
      const initialrowNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowSnumber = deviceUsersPage.getRowsNumber();
      const lastUser = getRowObject(await finalRowSnumber);
      expect(await initialrowNumber + 1).toEqual(await finalRowSnumber);
      expect(lastUser.firstName).toBe(data.DeviceUsersPage.sampleFirstName);
      expect(lastUser.lastName).toBe(data.DeviceUsersPage.sampleLastName);
      done();
    });
    it('with only first name', async function (done) {
      const initialrowNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillFirstNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = deviceUsersPage.getRowsNumber();
      const lastUser = getRowObject(await finalRowsNumber);
      expect(await initialrowNumber + 1).toEqual(await finalRowsNumber);
      expect(lastUser.firstName).toBe(data.DeviceUsersPage.sampleFirstName);
      expect(lastUser.lastName).toBe(data.DeviceUsersPage.notAvaliableName);
      done();

    });
    it('with only last name', async function (done) {
      const initialRowsNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.fillLastNameInput();
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = deviceUsersPage.getRowsNumber();
      const lastUser = getRowObject(await finalRowsNumber);
      expect(await initialRowsNumber + 1).toEqual(await finalRowsNumber);
      expect(lastUser.firstName).toBe(data.DeviceUsersPage.notAvaliableName);
      expect(lastUser.lastName).toBe(data.DeviceUsersPage.sampleLastName);
      done();
    });

  });

  describe('Should not add add new device user', function () {
    it('without first and last names', async function (done) {
      const initialRowsNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.save();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = deviceUsersPage.getRowsNumber();
      expect(await initialRowsNumber).toEqual(await finalRowsNumber);
      done();
    });
    it('if cancel was clicked', async function (done) {
      const initialRowsNumber = deviceUsersPage.getRowsNumber();
      deviceUsersPage.newDeviceUserButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.addNewUserModal.saveButton));
      deviceUsersPage.addNewUserModal.cancelButton.click();
      browser.wait(ExpectedConditions.visibilityOf(deviceUsersPage.newDeviceUserButton));
      const finalRowsNumber = deviceUsersPage.getRowsNumber();
      expect(await initialRowsNumber).toEqual(await finalRowsNumber);
      done();
    });
  });
});


