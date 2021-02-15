import { PageWithNavbarPage } from './PageWithNavbar.page';

export class UserAdministration extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public get rowNum() {
    return this.userInfoTable.$$('tr').length;
  }

  public get userInfoTable() {
    return $('#userInfoTable');
  }

  public get editLastName() {
    const ele = $('#editLastName');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editUserSaveBtn() {
    const ele = $('#editUserSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editFirstName() {
    const ele = $('#editFirstName');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editEmail() {
    const ele = $('#emailEdit');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editRole() {
    const ele = $('#editRole');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editGroup() {
    const ele = $('#editGroup');
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get editUserCancelSaveBtn() {
    const ele = $('#editUserCancelSaveBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createNewUserBtn() {
    const ele = $('#createNewUserBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get userDeleteBtn() {
    const ele = $('#userDeleteBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get userDeleteCancelBtn() {
    const ele = $('#userDeleteCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createFirstName() {
    const ele = $('#createFirstName');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createLastName() {
    const ele = $('#createLastName');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createEmail() {
    const ele = $('#createEmail');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createPassword() {
    const ele = $('#createPassword');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createRole() {
    const ele = $('#createRole');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createGroup() {
    const ele = $('#createGroup');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createAdministrationUserBtn() {
    const ele = $('#createAdministrationUserBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get createAdministrationUserCancelBtn() {
    const ele = $('#createAdministrationUserCancelBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public getUserByNumber(i = 1): UserAdministrationRowObject {
    return new UserAdministrationRowObject(i);
  }

  public getUserByFullName(fullName: string): UserAdministrationRowObject {
    for (let i = 1; i < this.rowNum + 1; i++) {
      const user = new UserAdministrationRowObject(i);
      if (user.fullName === fullName) {
        return user;
      }
    }
    return null;
  }

  public openCreateNewUser(user: UserAdministrationObject) {
    this.createNewUserBtn.click();
    this.createAdministrationUserCancelBtn.waitForDisplayed({ timeout: 20000 });
    this.createFirstName.setValue(user.firstName);
    this.createLastName.setValue(user.lastName);
    this.createEmail.setValue(user.email);
    this.createPassword.setValue(user.password);
    this.createRole.click();
    this.createRole.$('input').setValue(user.role);
    browser.keys(['Return']);
    this.createGroup.click();
    this.createGroup.$('input').setValue(user.group);
    browser.keys(['Return']);
  }

  public closeCreateNewUser(clickCancel = false) {
    if (clickCancel) {
      this.createAdministrationUserCancelBtn.click();
    } else {
      this.createAdministrationUserBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    this.createNewUserBtn.waitForClickable({ timeout: 20000 });
  }

  public createNewUser(user: UserAdministrationObject, clickCancel = false) {
    this.openCreateNewUser(user);
    this.closeCreateNewUser(clickCancel);
  }
}

const userAdministration = new UserAdministration();
export default userAdministration;

export class UserAdministrationRowObject {
  constructor(rowNum: number) {
    this.element = userAdministration.userInfoTable.$$('tr')[rowNum - 1];
    if (this.element) {
      this.id = +this.element.$('#userAdministrationId').getText();
      this.email = this.element.$('#userAdministrationEmail').getText();
      this.fullName = this.element.$('#userAdministrationFullName').getText();
      this.role = this.element.$('#userAdministrationRole').getText();
      this.editBtn = this.element.$('#userAdministrationEditBtn');
      this.deleteBtn = this.element.$('#userAdministrationDeleteBtn');
    }
  }

  element;
  id: number;
  email: string;
  fullName: string;
  role: string;
  editBtn;
  deleteBtn;

  public openEdit(user: UserAdministrationObject) {
    this.editBtn.click();
    userAdministration.editFirstName.waitForDisplayed({ timeout: 20000 });
    if (user.firstName) {
      userAdministration.editFirstName.setValue(user.firstName);
    }
    if (user.lastName) {
      userAdministration.editLastName.setValue(user.lastName);
    }
    if (user.email) {
      userAdministration.editEmail.setValue(user.email);
    }
    if (user.role) {
      userAdministration.editRole.click();
      userAdministration.editRole.$('input').setValue(user.role);
      browser.keys(['Return']);
    }
    if (user.group) {
      userAdministration.editGroup.click();
      userAdministration.editGroup.$('input').setValue(user.group);
      browser.keys(['Return']);
    }
  }

  public closeEdit(clickCancel = false) {
    if (clickCancel) {
      userAdministration.editUserCancelSaveBtn.click();
    } else {
      userAdministration.editUserSaveBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    userAdministration.createNewUserBtn.waitForClickable({ timeout: 20000 });
  }

  public edit(user: UserAdministrationObject, clickCancel = false) {
    this.openEdit(user);
    this.closeEdit(clickCancel);
  }

  public openDelete() {
    this.deleteBtn.click();
    userAdministration.userDeleteCancelBtn.waitForDisplayed({ timeout: 20000 });
  }

  public closeDelete(clickCancel = false) {
    if (clickCancel) {
      userAdministration.userDeleteCancelBtn.click();
    } else {
      userAdministration.userDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    userAdministration.createNewUserBtn.waitForClickable({ timeout: 20000 });
  }

  public delete(clickCancel = false) {
    this.openDelete();
    this.closeDelete(clickCancel);
    userAdministration.createNewUserBtn.waitForClickable({ timeout: 20000 });
  }
}

export class UserAdministrationObject {
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  group?: string;
  password?: string;
}
