import {PageWithNavbarPage} from './PageWithNavbar.page';

export class UserAdministration extends  PageWithNavbarPage {
  constructor() {
    super();
  }
    public get editUserBtn() {
    return browser.element('#userAdministrationEditBtn');
    }
    public get firstNameBox() {
    return browser.element('#editFirstName');
    }
    public get lastNameBox() {
    return browser.element('#editLastName');
    }
    public get saveBtn() {
    return browser.element('#editUserSaveBtn');
    }
    public setNewName(firstName: string, lastName: string) {
    this.editUserBtn.click();
    browser.waitForVisible('#editFirstName', 2000);
    this.firstNameBox.clearElement();
    browser.pause(500);
    this.firstNameBox.addValue(firstName);
    this.lastNameBox.clearElement();
    browser.pause(500);
    this.lastNameBox.addValue(lastName);
    browser.pause(500);
    this.saveBtn.click();
    }
    public revertToOldName(firstName: string, lastName: string) {
      this.editUserBtn.click();
      browser.waitForVisible('#editFirstName', 2000);
      this.firstNameBox.clearElement();
      browser.pause(500);
      this.firstNameBox.addValue(firstName);
      this.lastNameBox.clearElement();
      browser.pause(500);
      this.lastNameBox.addValue(lastName);
      browser.pause(500);
      this.saveBtn.click();
    }
}

const userAdministration = new UserAdministration();
export default userAdministration;
