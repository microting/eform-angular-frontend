import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';
import { expect } from '@playwright/test';

export class DeviceUsersPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public newDeviceUserBtn(): Locator {
    return this.page.locator('#newDeviceUserBtn');
  }

  public createFirstNameInput(): Locator {
    return this.page.locator('#firstName');
  }

  public createLastNameInput(): Locator {
    return this.page.locator('#lastName');
  }

  async getFirstRowObject(): Promise<DeviceUsersRowObject> {
    const result = new DeviceUsersRowObject(this.page, this);
    return await result.getRow(1);
  }

  public saveCreateBtn(): Locator {
    return this.page.locator('#saveCreateBtn');
  }

  public cancelCreateBtn(): Locator {
    return this.page.locator('#cancelCreateBtn');
  }

  public editFirstNameInput(): Locator {
    return this.page.locator('#firstName');
  }

  public editLastNameInput(): Locator {
    return this.page.locator('#lastName');
  }

  public saveEditBtn(): Locator {
    return this.page.locator('#saveEditBtn');
  }

  public cancelEditBtn(): Locator {
    return this.page.locator('#cancelEditBtn');
  }

  public saveDeleteBtn(): Locator {
    return this.page.locator('#saveDeleteBtn');
  }

  public cancelDeleteBtn(): Locator {
    return this.page.locator('#cancelDeleteBtn');
  }

  public async rowNum(): Promise<number> {
    await this.page.waitForTimeout(500);
    return await this.page.locator('tbody > tr').count();
  }

  async getDeviceUser(num: number): Promise<DeviceUsersRowObject> {
    const result = new DeviceUsersRowObject(this.page, this);
    return await result.getRow(num);
  }

  async getDeviceUserByName(name: string): Promise<DeviceUsersRowObject | null> {
    for (let i = 1; i < (await this.rowNum()) + 1; i++) {
      const deviceUser = await this.getDeviceUser(i);
      if (deviceUser.firstName === name) {
        return deviceUser;
      }
    }
    return null;
  }

  async getDeviceUsersList(maxNum: number): Promise<DeviceUsersRowObject[]> {
    const users: DeviceUsersRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      const result = new DeviceUsersRowObject(this.page, this);
      users[i - 1] = await result.getRow(i);
    }
    return users;
  }

  public async createNewDeviceUser(firstName: string, lastName: string) {
    await this.newDeviceUserBtn().click();
    await this.page.waitForTimeout(500);
    await this.createFirstNameInput().waitFor({ state: 'visible', timeout: 40000 });
    await this.createFirstNameInput().fill(firstName);
    await this.page.waitForTimeout(500);
    await this.createLastNameInput().fill(lastName);
    await this.page.waitForTimeout(500);
    const [response] = await Promise.all([
      this.page.waitForResponse(resp => resp.url().includes('/api/device-users') && resp.status() === 200, { timeout: 40000 }),
      this.saveCreateBtn().click(),
    ]);
    await this.newDeviceUserBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(1000);
  }

  public async createDeviceUserFromScratch(name: string, surname: string) {
    await this.Navbar.goToDeviceUsersPage();
    await this.newDeviceUserBtn().waitFor({ state: 'visible', timeout: 40000 });
    const rowCountBeforeCreation = await this.rowNum();
    await this.createNewDeviceUser(name, surname);
    const rowCountAfterCreation = await this.rowNum();
    expect(
      rowCountAfterCreation,
      `Number of rows hasn't changed after creating new user`
    ).toEqual(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = await this.getDeviceUser(
      await this.rowNum()
    );
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').toEqual(
      name
    );
    expect(
      lastDeviceUser.lastName,
      'Last name of created user is incorrect'
    ).toEqual(surname);
  }

  public async editDeviceUser(
    deviceUser: DeviceUsersRowObject,
    name = '',
    surname = ''
  ) {
    await deviceUser.openRowMenu();
    const index = deviceUser.index - 1;
    const editBtn = this.page.locator(`#editDeviceUserBtn${index}`);
    await editBtn.waitFor({ state: 'visible', timeout: 5000 });
    await editBtn.click();
    await this.page.locator('#firstName').waitFor({ state: 'visible', timeout: 40000 });
    if (name != null) {
      await this.editFirstNameInput().click();
      await this.editFirstNameInput().clear();
      await this.editFirstNameInput().fill(name);
    }
    if (surname != null) {
      await this.editLastNameInput().click();
      await this.editLastNameInput().clear();
      await this.editLastNameInput().fill(surname);
    }
    await this.saveEditBtn().click();
    await this.newDeviceUserBtn().waitFor({ state: 'visible', timeout: 40000 });
  }
}

export class DeviceUsersRowObject {
  constructor(page: Page, deviceUsersPage: DeviceUsersPage) {
    this.page = page;
    this.deviceUsersPage = deviceUsersPage;
  }

  page: Page;
  deviceUsersPage: DeviceUsersPage;
  index: number;
  siteId: number;
  firstName: string;
  lastName: string;
  editBtn: Locator;
  deleteBtn: Locator;

  async getRow(rowNum: number) {
    this.index = rowNum;
    const i = rowNum - 1;
    if ((await this.page.locator(`#deviceUserId-${i}`).count()) >= 1) {
      this.siteId = +(await this.page.locator(`#deviceUserId-${i}`).textContent() || '0');
      try {
        this.firstName = await this.page.locator(`#deviceUserFirstName-${i}`).textContent() || '';
      } catch (e) {}
      try {
        this.lastName = await this.page.locator(`#deviceUserLastName-${i}`).textContent() || '';
      } catch (e) {}
      this.editBtn = this.page.locator(`#editDeviceUserBtn${i}`);
      this.deleteBtn = this.page.locator(`#deleteDeviceUserBtn${i}`);
    }
    return this;
  }

  async openRowMenu() {
    const index = this.index - 1;
    const menuBtn = this.page.locator(`#actionMenu${index}`);
    await menuBtn.waitFor({ state: 'visible', timeout: 5000 });
    await menuBtn.scrollIntoViewIfNeeded();
    await menuBtn.click();
    await this.page.waitForTimeout(200);
  }

  async delete() {
    const index = this.index - 1;
    await this.openRowMenu();
    const deleteBtn = this.page.locator(`#deleteDeviceUserBtn${index}`);
    await deleteBtn.waitFor({ state: 'visible', timeout: 5000 });
    await deleteBtn.click();
    await this.deviceUsersPage.saveDeleteBtn().waitFor({ state: 'visible', timeout: 40000 });
    await this.deviceUsersPage.saveDeleteBtn().click();
    await this.deviceUsersPage.newDeviceUserBtn().waitFor({ state: 'visible' });
  }
}
