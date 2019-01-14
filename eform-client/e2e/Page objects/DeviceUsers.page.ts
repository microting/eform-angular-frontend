import {PageWithNavbarPage} from './PageWithNavbar.page';

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
    browser.pause(6000);
    this.createFirstNameInput.setValue(firstName);
    this.createLastNameInput.setValue(lastName);
    this.saveCreateBtn.click();
    browser.pause(16000);
  }

  public editDeviceUser(deviceUser: DeviceUsersRowObject, name = '', surname = '') {
    deviceUser.editBtn.click();
    browser.pause(5000);
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
    browser.pause(12000);
  }
}

const deviceUsersPage = new DeviceUsersPage();
export default deviceUsersPage;

export class DeviceUsersRowObject {
  constructor(rowNumber) {
    this.siteId = +$$('#deviceUserId')[rowNumber - 1].getText();
    this.firstName = $$('#deviceUserFirstName')[rowNumber - 1].getText();
    this.lastName = $$('#deviceUserLastName')[rowNumber - 1].getText();
    this.editBtn = $$('#editDeviceUserBtn')[rowNumber - 1];
    this.deleteBtn = $$('#deleteDeviceUserBtn')[rowNumber - 1];
  }

  siteId: number;
  firstName;
  lastName;
  editBtn;
  deleteBtn;
}
