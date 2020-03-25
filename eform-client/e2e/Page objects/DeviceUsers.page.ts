import {PageWithNavbarPage} from './PageWithNavbar.page';
import myEformsPage from './MyEforms.page';
import {Guid} from 'guid-typescript';
import {expect} from 'chai';

class DeviceUsersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newDeviceUserBtn() {
    return $('#newDeviceUserBtn');
  }

  public get createFirstNameInput() {
    return $('#firstName');
  }

  public get createLastNameInput() {
    return $('#lastName');
  }

  getFirstRowObject(): DeviceUsersRowObject {
    return new DeviceUsersRowObject(1);
  }

  public get saveCreateBtn() {
    return $('#saveCreateBtn');
  }

  public get cancelCreateBtn() {
    return $('#cancelCreateBtn');
  }

  public get editFirstNameInput() {
    return $('#editFirstNameInput');
  }

  public get editLastNameInput() {
    return $('#editLastNameInput');
  }

  public get saveEditBtn() {
    return $('#saveEditBtn');
  }

  public get cancelEditBtn() {
    return $('#cancelEditBtn');
  }

  public get saveDeleteBtn() {
    $('#saveDeleteBtn').waitForDisplayed(20000);
    $('#saveDeleteBtn').waitForClickable({ timeout: 20000});
    return $('#saveDeleteBtn');
  }

  public get cancelDeleteBtn() {
    $('#cancelDeleteBtn').waitForDisplayed(20000);
    $('#cancelDeleteBtn').waitForClickable({ timeout: 20000});
    return $('#cancelDeleteBtn');
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
    $('#firstName').waitForDisplayed(10000);
    this.createFirstNameInput.setValue(firstName);
    this.createLastNameInput.setValue(lastName);
    this.saveCreateBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    $('#newDeviceUserBtn').waitForDisplayed(20000);
  }

  public createDeviceUserFromScratch(name: string, surname: string) {
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed(20000);
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    //browser.pause(2000);
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
    $('#editFirstNameInput').waitForDisplayed(10000);
    if (name != null) {
      this.editFirstNameInput.click();
      this.editFirstNameInput.clearValue();
      this.editFirstNameInput.setValue(name);
    }
    if (surname != null) {
      this.editLastNameInput.click();
      this.editLastNameInput.clearValue();
      this.editLastNameInput.setValue(surname);
    }
    this.saveEditBtn.click();
    // browser.pause(12000);
    $('#newDeviceUserBtn').waitForDisplayed(20000);
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
