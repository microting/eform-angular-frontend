import {PageWithNavbarPage} from './PageWithNavbar.page';

export class UserAdministration extends  PageWithNavbarPage {
  constructor() {
    super();
  }
    public get editUserBtn() {
    return $('#userAdministrationEditBtn');
    }
    public get firstNameBox() {
    return $('#editFirstName');
    }
    public get lastNameBox() {
    return $('#editLastName');
    }
    public get saveBtn() {
    return $('#editUserSaveBtn');
    }
    public setNewName(firstName: string, lastName: string) {
    this.editUserBtn.click();
    $('#editFirstName').waitForDisplayed(2000);
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
      $('#editFirstName').waitForDisplayed(2000);
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
