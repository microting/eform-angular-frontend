import {PageWithNavbarPage} from './PageWithNavbar.page';
import myEformsPage from './MyEforms.page';
import {Guid} from 'guid-typescript';
import {expect} from 'chai';

class DeviceUsersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get newDeviceUserBtn() {
    const ele = $('#newDeviceUserBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get createFirstNameInput() {
    const ele = $('#firstName');
    ele.waitForDisplayed({timeout: 20000});
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get createLastNameInput() {
    const ele = $('#lastName');
    ele.waitForDisplayed({timeout: 20000});
    // ele.waitForClickable({timeout: 20000});
    return ele;
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
    const ele = $('#saveDeleteBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }

  public get cancelDeleteBtn() {
    const ele = $('#cancelDeleteBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({ timeout: 20000});
    return ele;
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }

  getDeviceUser(num): DeviceUsersRowObject {
    return new DeviceUsersRowObject(num);
  }

  getDeviceUserByName(name: string): DeviceUsersRowObject {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const deviceUser = this.getDeviceUser(i);
      if (deviceUser.firstName === name) {
        return deviceUser;
      }
    }
    return null;
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
    this.createFirstNameInput.setValue(firstName);
    this.createLastNameInput.setValue(lastName);
    this.saveCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.newDeviceUserBtn.waitForDisplayed({timeout: 20000});
  }

  public createDeviceUserFromScratch(name: string, surname: string) {
    myEformsPage.Navbar.goToDeviceUsersPage();
    this.newDeviceUserBtn.waitForDisplayed({timeout: 20000});
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    // browser.pause(2000);
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
    $('#editFirstNameInput').waitForDisplayed({timeout: 20000});
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
    this.newDeviceUserBtn.waitForDisplayed({timeout: 20000});
  }
}

const deviceUsersPage = new DeviceUsersPage();
export default deviceUsersPage;

export class DeviceUsersRowObject {
  constructor(rowNum) {
    if ($$('#deviceUserId')[rowNum - 1]) {
      this.siteId = +$$('#deviceUserId')[rowNum - 1].getText();
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

  siteId: number;
  firstName: string;
  lastName: string;
  editBtn;
  deleteBtn;

  delete () {
    this.deleteBtn.waitForClickable({ timeout: 20000});
    this.deleteBtn.click();
    deviceUsersPage.saveDeleteBtn.waitForClickable({ timeout: 20000});
    deviceUsersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 20000, reverse: true});
    deviceUsersPage.newDeviceUserBtn.waitForDisplayed();
  }
}
