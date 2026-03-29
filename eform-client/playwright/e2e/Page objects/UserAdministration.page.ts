import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';

export class UserAdministration extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public async rowNum(): Promise<number> {
    return await this.page.locator('.userAdministrationId').count();
  }

  public userInfoTable(): Locator {
    return this.page.locator('#userInfoTable');
  }

  public editLastName(): Locator {
    return this.page.locator('#editLastName');
  }

  public editUserSaveBtn(): Locator {
    return this.page.locator('#editUserSaveBtn');
  }

  public editFirstName(): Locator {
    return this.page.locator('#editFirstName');
  }

  public editEmail(): Locator {
    return this.page.locator('#emailEdit');
  }

  public editRole(): Locator {
    return this.page.locator('#editRole');
  }

  public editGroup(): Locator {
    return this.page.locator('#editGroup');
  }

  public editUserCancelSaveBtn(): Locator {
    return this.page.locator('#editUserCancelSaveBtn');
  }

  public createNewUserBtn(): Locator {
    return this.page.locator('#createNewUserBtn');
  }

  public userDeleteBtn(): Locator {
    return this.page.locator('#userDeleteBtn');
  }

  public userDeleteCancelBtn(): Locator {
    return this.page.locator('#userDeleteCancelBtn');
  }

  public createFirstName(): Locator {
    return this.page.locator('#createFirstName');
  }

  public createLastName(): Locator {
    return this.page.locator('#createLastName');
  }

  public createEmail(): Locator {
    return this.page.locator('#createEmail');
  }

  public createPassword(): Locator {
    return this.page.locator('#createPassword');
  }

  public editPassword(): Locator {
    return this.page.locator('#editPassword');
  }

  public createRole(): Locator {
    return this.page.locator('#createRole');
  }

  public createGroup(): Locator {
    return this.page.locator('#createGroup');
  }

  public createAdministrationUserBtn(): Locator {
    return this.page.locator('#createAdministrationUserBtn');
  }

  public createAdministrationUserCancelBtn(): Locator {
    return this.page.locator('#createAdministrationUserCancelBtn');
  }

  public async getUserByNumber(i = 1): Promise<UserAdministrationRowObject> {
    const obj = new UserAdministrationRowObject(this.page, this);
    return await obj.getRow(i);
  }

  public async getUserByFullName(fullName: string): Promise<UserAdministrationRowObject | null> {
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const userObj = new UserAdministrationRowObject(this.page, this);
      const user = await userObj.getRow(i);
      if (user.fullName === fullName) {
        return user;
      }
    }
    return null;
  }

  public async openCreateNewUser(user: UserAdministrationObject) {
    await this.createNewUserBtn().click();
    await this.page.waitForTimeout(500);
    await this.createAdministrationUserCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.createFirstName().fill(user.firstName || '');
    await this.createLastName().fill(user.lastName || '');
    await this.createEmail().fill(user.email || '');
    await this.createPassword().fill(user.password || '');
    await this.createRole().click();
    await this.createRole().locator('input').fill(user.role || '');
    await this.page.keyboard.press('Enter');
    await this.createGroup().click();
    await this.createGroup().locator('input').fill(user.group || '');
    await this.page.keyboard.press('Enter');
  }

  public async closeCreateNewUser(clickCancel = false) {
    if (clickCancel) {
      await this.createAdministrationUserCancelBtn().click();
    } else {
      await this.createAdministrationUserBtn().click();
    }
    await this.createNewUserBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  public async createNewUser(user: UserAdministrationObject, clickCancel = false) {
    await this.openCreateNewUser(user);
    await this.closeCreateNewUser(clickCancel);
  }
}

export class UserAdministrationRowObject {
  constructor(page: Page, userAdministration: UserAdministration) {
    this.page = page;
    this.userAdministration = userAdministration;
  }

  page: Page;
  userAdministration: UserAdministration;
  index: number;
  id: number;
  email: string;
  fullName: string;
  role: string;
  editBtn: Locator;
  deleteBtn: Locator;

  async getRow(rowNum: number): Promise<UserAdministrationRowObject> {
    this.index = rowNum;
    rowNum = rowNum - 1;
    await this.page.locator('#userAdministrationEmail-' + rowNum).waitFor({ state: 'visible', timeout: 40000 });
    const idLocator = this.page.locator('#userAdministrationId-' + rowNum);
    this.id = (await idLocator.count()) > 0 ? +(await idLocator.textContent() || '0') : 0;
    this.email = (await this.page.locator('#userAdministrationEmail-' + rowNum).textContent() || '').trim();
    this.fullName = (await this.page.locator('#userAdministrationFullName-' + rowNum).textContent() || '').trim();
    this.role = (await this.page.locator('#userAdministrationRole-' + rowNum).textContent() || '').trim();
    this.editBtn = this.page.locator('#userAdministrationEditBtn-' + rowNum);
    this.deleteBtn = this.page.locator('#userAdministrationDeleteBtn-' + rowNum);
    return this;
  }

  async openRowMenu() {
    const index = this.index - 1;
    const menuBtn = this.page.locator(`#action-items-${index} #actionMenu`);
    await menuBtn.waitFor({ state: 'visible', timeout: 40000 });
    await menuBtn.scrollIntoViewIfNeeded();
    await menuBtn.click();
    await this.page.waitForTimeout(200);
  }

  public async openEdit(user: UserAdministrationObject) {
    await this.openRowMenu();
    const index = this.index - 1;
    const editBtn = this.page.locator(`#userAdministrationEditBtn-${index}`);
    await editBtn.waitFor({ state: 'visible', timeout: 40000 });
    await editBtn.click();
    await this.userAdministration.editFirstName().waitFor({ state: 'visible', timeout: 40000 });
    if (user.firstName) {
      await this.userAdministration.editFirstName().clear();
      await this.page.waitForTimeout(500);
      await this.userAdministration.editFirstName().fill(user.firstName);
      await this.page.waitForTimeout(500);
    }
    if (user.lastName) {
      await this.userAdministration.editLastName().clear();
      await this.page.waitForTimeout(500);
      await this.userAdministration.editLastName().fill(user.lastName);
      await this.page.waitForTimeout(500);
    }
    if (user.email) {
      await this.userAdministration.editEmail().clear();
      await this.page.waitForTimeout(500);
      await this.userAdministration.editEmail().fill(user.email);
    }
    if (user.role) {
      await this.userAdministration.editRole().click();
      await this.page.waitForTimeout(500);
      await this.userAdministration.editRole().locator('input').fill(user.role);
      await this.page.keyboard.press('Enter');
    }
    if (user.group) {
      await this.userAdministration.editGroup().click();
      await this.page.waitForTimeout(500);
      await this.userAdministration.editGroup().locator('input').fill(user.group);
      await this.page.waitForTimeout(500);
      await this.page.keyboard.press('Enter');
    }
    if (user.password) {
      await this.userAdministration.editPassword().waitFor({ state: 'visible', timeout: 40000 });
      await this.userAdministration.editPassword().clear();
      await this.page.waitForTimeout(500);
      await this.userAdministration.editPassword().fill(user.password);
      await this.page.waitForTimeout(500);
    }
  }

  public async closeEdit(clickCancel = false) {
    if (clickCancel) {
      await this.userAdministration.editUserCancelSaveBtn().click();
      await this.page.waitForTimeout(500);
    } else {
      await this.userAdministration.editUserSaveBtn().click();
      await this.page.waitForTimeout(500);
    }

    await this.page.goto('/');
    await this.page.waitForTimeout(500);
    await this.userAdministration.Navbar.goToUserAdministration();
    await this.userAdministration.createNewUserBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(500);
  }

  public async edit(user: UserAdministrationObject, clickCancel = false) {
    await this.openEdit(user);
    await this.closeEdit(clickCancel);
  }

  public async openDelete() {
    await this.openRowMenu();
    const index = this.index - 1;
    const deleteBtn = this.page.locator(`#userAdministrationDeleteBtn-${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 40000 });
    await deleteBtn.click();
    await this.userAdministration.userDeleteCancelBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  public async closeDelete(clickCancel = false) {
    if (clickCancel) {
      await this.userAdministration.userDeleteCancelBtn().click();
    } else {
      await this.userAdministration.userDeleteBtn().click();
    }
    await this.userAdministration.createNewUserBtn().waitFor({ state: 'visible', timeout: 40000 });
  }

  public async delete(clickCancel = false) {
    await this.openDelete();
    await this.closeDelete(clickCancel);
    await this.userAdministration.createNewUserBtn().waitFor({ state: 'visible', timeout: 40000 });
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
