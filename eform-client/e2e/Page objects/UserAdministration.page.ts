import { PageWithNavbarPage } from './PageWithNavbar.page';
import loginPage from './Login.page';
import myEformsPage from './MyEforms.page';

export class UserAdministration extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    return (await (await this.userInfoTable()).$$('tr')).length;
  }

  public async userInfoTable(): Promise<WebdriverIO.Element> {
    return $('#userInfoTable');
  }

  public async editLastName(): Promise<WebdriverIO.Element> {
    const ele = await $('#editLastName');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editUserSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editUserSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editFirstName(): Promise<WebdriverIO.Element> {
    const ele = await $('#editFirstName');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editEmail(): Promise<WebdriverIO.Element> {
    const ele = await $('#emailEdit');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editRole(): Promise<WebdriverIO.Element> {
    const ele = await $('#editRole');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editGroup(): Promise<WebdriverIO.Element> {
    const ele = await $('#editGroup');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async editUserCancelSaveBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#editUserCancelSaveBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createNewUserBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createNewUserBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async userDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#userDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async userDeleteCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#userDeleteCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createFirstName(): Promise<WebdriverIO.Element> {
    const ele = await $('#createFirstName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createLastName(): Promise<WebdriverIO.Element> {
    const ele = await $('#createLastName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createEmail(): Promise<WebdriverIO.Element> {
    const ele = await $('#createEmail');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createPassword(): Promise<WebdriverIO.Element> {
    const ele = await $('#createPassword');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createRole(): Promise<WebdriverIO.Element> {
    const ele = await $('#createRole');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createGroup(): Promise<WebdriverIO.Element> {
    const ele = await $('#createGroup');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createAdministrationUserBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createAdministrationUserBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async createAdministrationUserCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#createAdministrationUserCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async getUserByNumber(i = 1): Promise<UserAdministrationRowObject> {
    const obj = new UserAdministrationRowObject();
    return await obj.getRow(i);
  }

  public async getUserByFullName(fullName: string): Promise<UserAdministrationRowObject> {
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const userObj = new UserAdministrationRowObject();
      const user = await userObj.getRow(i);
      if (user.fullName === fullName) {
        return user;
      }
    }
    return null;
  }

  public async openCreateNewUser(user: UserAdministrationObject) {
    await (await this.createNewUserBtn()).click();
    await (await this.createAdministrationUserCancelBtn()).waitForDisplayed({ timeout: 40000 });
    await (await this.createFirstName()).setValue(user.firstName);
    await (await this.createLastName()).setValue(user.lastName);
    await (await this.createEmail()).setValue(user.email);
    await (await this.createPassword()).setValue(user.password);
    await (await this.createRole()).click();
    await (await (await this.createRole()).$('input')).setValue(user.role);
    await browser.keys(['Return']);
    await (await this.createGroup()).click();
    await ((await this.createGroup()).$('input')).setValue(user.group);
    await browser.keys(['Return']);
  }

  public async closeCreateNewUser(clickCancel = false) {
    if (clickCancel) {
      await (await this.createAdministrationUserCancelBtn()).click();
    } else {
      await (await this.createAdministrationUserBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    await (await this.createNewUserBtn()).waitForClickable({ timeout: 40000 });
  }

  public async createNewUser(user: UserAdministrationObject, clickCancel = false) {
    await this.openCreateNewUser(user);
    await this.closeCreateNewUser(clickCancel);
  }
}

const userAdministration = new UserAdministration();
export default userAdministration;

export class UserAdministrationRowObject {
  constructor() {}

  element;
  id: number;
  email: string;
  fullName: string;
  role: string;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number): Promise<UserAdministrationRowObject> {
    this.element = (await (await userAdministration.userInfoTable()).$$('tr'))[rowNum - 1];
    if (this.element) {
      this.id = +await (await this.element.$('#userAdministrationId')).getText();
      this.email = await (await this.element.$('#userAdministrationEmail')).getText();
      this.fullName = await (await this.element.$('#userAdministrationFullName')).getText();
      this.role = await (await this.element.$('#userAdministrationRole')).getText();
      this.editBtn = await this.element.$('#userAdministrationEditBtn');
      this.deleteBtn = await this.element.$('#userAdministrationDeleteBtn');
    }
    return this;
  }

  public async openEdit(user: UserAdministrationObject) {
    await this.editBtn.click();
    await (await userAdministration.editFirstName()).waitForDisplayed({ timeout: 40000 });
    if (user.firstName) {
      await (await userAdministration.editFirstName()).setValue(user.firstName);
    }
    if (user.lastName) {
      await (await userAdministration.editLastName()).setValue(user.lastName);
    }
    if (user.email) {
      await (await userAdministration.editEmail()).setValue(user.email);
    }
    if (user.role) {
      await (await userAdministration.editRole()).click();
      await (await userAdministration.editRole()).$('input').setValue(user.role);
      await browser.keys(['Return']);
    }
    if (user.group) {
      await (await userAdministration.editGroup()).click();
      await (await (await userAdministration.editGroup()).$('input')).setValue(user.group);
      await browser.keys(['Return']);
    }
  }

  public async closeEdit(clickCancel = false) {
    if (clickCancel) {
      await (await userAdministration.editUserCancelSaveBtn()).click();
    } else {
      await (await userAdministration.editUserSaveBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }

    await loginPage.open('/');
    await myEformsPage.Navbar.goToUserAdministration();
    await (await userAdministration.createNewUserBtn()).waitForClickable({ timeout: 40000 });
  }

  public async edit(user: UserAdministrationObject, clickCancel = false) {
    await this.openEdit(user);
    await this.closeEdit(clickCancel);
  }

  public async openDelete() {
    await this.deleteBtn.click();
    await (await userAdministration.userDeleteCancelBtn()).waitForDisplayed({ timeout: 40000 });
  }

  public async closeDelete(clickCancel = false) {
    if (clickCancel) {
      await (await userAdministration.userDeleteCancelBtn()).click();
    } else {
      await (await userAdministration.userDeleteBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({
        timeout: 90000,
        reverse: true,
      });
    }
    await (await userAdministration.createNewUserBtn()).waitForClickable({ timeout: 40000 });
  }

  public async delete(clickCancel = false) {
    await this.openDelete();
    await this.closeDelete(clickCancel);
    await (await userAdministration.createNewUserBtn()).waitForClickable({ timeout: 40000 });
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
