import {PageWithNavbarPage} from './PageWithNavbar.page';
import myEformsPage from './MyEforms.page';
import {Guid} from 'guid-typescript';
import {expect} from 'chai';

class DeviceUsersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newDeviceUserBtn() {
    return browser.element('#newDeviceUserBtn');
  }

  public get createFirstNameInput() {
    return browser.element('#firstName');
  }

  public get createLastNameInput() {
    return browser.element('#lastName');
  }

  getFirstRowObject(): DeviceUsersRowObject {
    return new DeviceUsersRowObject(1);
  }

  public get saveCreateBtn() {
    return browser.element('#saveCreateBtn');
  }

  public get cancelCreateBtn() {
    return browser.element('#cancelCreateBtn');
  }

  public get editFirstNameInput() {
    return browser.element('#editFirstNameInput');
  }

  public get editLastNameInput() {
    return browser.element('#editLastNameInput');
  }

  public get saveEditBtn() {
    return browser.element('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return browser.element('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    return browser.element('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    return browser.element('#cancelDeleteBtn');
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  getDeviceUser(num): DeviceUsersRowObject {
    return new DeviceUsersRowObject(num);
  }

  getDeviceUsersList(maxNum): DeviceUsersRowObject[] {
    const users: DeviceUsersRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      users[i - 1] = new DeviceUsersRowObject(i);
    }
    return users;
  }

  public createNewDeviceUser(firstName: string, lastName: string) {
    this.newDeviceUserBtn.click();
    // browser.pause(6000);
    browser.waitForVisible('#firstName', 10000);
    this.createFirstNameInput.setValue(firstName);
    this.createLastNameInput.setValue(lastName);
    this.saveCreateBtn.click();
    browser.pause(16000);
  }

  public createDeviceUserFromScratch(name: string, surname: string) {
    myEformsPage.Navbar.goToDeviceUsersPage();
    browser.waitForVisible('#newDeviceUserBtn', 20000);;
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    browser.pause(2000);
    deviceUsersPage.createNewDeviceUser(name, surname);
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new user').equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').equal(name);
    expect(lastDeviceUser.lastName, 'Last name of created user is incorrect').equal(surname);
  }

  public editDeviceUser(deviceUser: DeviceUsersRowObject, name = '', surname = '') {
    deviceUser.editBtn.click();
    // browser.pause(5000);
    browser.waitForVisible('#editFirstNameInput', 10000);
    if (name != null) {
      this.editFirstNameInput.click();
      this.editFirstNameInput.clearElement();
      this.editFirstNameInput.setValue(name);
    }
    if (surname != null) {
      this.editLastNameInput.click();
      this.editLastNameInput.clearElement();
      this.editLastNameInput.setValue(surname);
    }
    this.saveEditBtn.click();
    // browser.pause(12000);
    browser.waitForVisible('#newDeviceUserBtn', 20000);
  }
}

const deviceUsersPage = new DeviceUsersPage();
export default deviceUsersPage;

export class DeviceUsersRowObject {
  constructor(rowNum) {
    if ($$('#deviceUserId')[rowNum - 1]) {
      this.siteId = $$('#deviceUserId')[rowNum - 1];
      try {
        this.firstName = $$('#deviceUserFirstName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.lastName = $$('#deviceUserLastName')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#editDeviceUserBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteDeviceUserBtn')[rowNum - 1];
    }
  }

  siteId;
  firstName;
  lastName;
  editBtn;
  deleteBtn;
}
