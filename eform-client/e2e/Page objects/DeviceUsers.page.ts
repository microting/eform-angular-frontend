import { PageWithNavbarPage } from './PageWithNavbar.page';
import { expect } from 'chai';

class DeviceUsersPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async newDeviceUserBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#newDeviceUserBtn');
    await ele.waitForDisplayed({ timeout: 40100 });
    await ele.waitForClickable({ timeout: 40200 });
    return ele;
  }

  public async createFirstNameInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#firstName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async createLastNameInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#lastName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  async getFirstRowObject(): Promise<DeviceUsersRowObject> {
    const result = new DeviceUsersRowObject();
    return await result.getRow(1);
  }

  public async saveCreateBtn(): Promise<WebdriverIO.Element> {
    return $('#saveCreateBtn');
  }

  public async cancelCreateBtn(): Promise<WebdriverIO.Element> {
    return $('#cancelCreateBtn');
  }

  public async editFirstNameInput(): Promise<WebdriverIO.Element> {
    return $('#editFirstNameInput');
  }

  public async editLastNameInput(): Promise<WebdriverIO.Element> {
    return $('#editLastNameInput');
  }

  public async saveEditBtn(): Promise<WebdriverIO.Element> {
    return $('#saveEditBtn');
  }

  public async cancelEditBtn(): Promise<WebdriverIO.Element> {
    return $('#cancelEditBtn');
  }

  public async saveDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#saveDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelDeleteBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#cancelDeleteBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('#tableBody > tr')).length;
  }

  async getDeviceUser(num): Promise<DeviceUsersRowObject> {
    const result = new DeviceUsersRowObject();
    return await result.getRow(num);
  }

  async getDeviceUserByName(name: string): Promise<DeviceUsersRowObject> {
    for (let i = 1; i < (await this.rowNum()) + 1; i++) {
      const deviceUser = await this.getDeviceUser(i);
      if (deviceUser.firstName === name) {
        return deviceUser;
      }
    }
    return null;
  }

  async getDeviceUsersList(maxNum): Promise<DeviceUsersRowObject[]> {
    const users: DeviceUsersRowObject[] = [];
    for (let i = 1; i <= maxNum; i++) {
      const result = new DeviceUsersRowObject();
      users[i - 1] = await result.getRow(i);
    }
    return users;
  }

  public async createNewDeviceUser(firstName: string, lastName: string) {
    await (await this.newDeviceUserBtn()).click();
    await (await this.createFirstNameInput()).setValue(firstName);
    await (await this.createLastNameInput()).setValue(lastName);
    await (await this.saveCreateBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({
      timeout: 90000,
      reverse: true,
    });
    await (await this.newDeviceUserBtn()).waitForDisplayed({ timeout: 40000 });
  }

  public async createDeviceUserFromScratch(name: string, surname: string) {
    await this.Navbar.goToDeviceUsersPage();
    await (await this.newDeviceUserBtn()).waitForDisplayed({ timeout: 40000 });
    const rowCountBeforeCreation = await deviceUsersPage.rowNum();
    // browser.pause(2000);
    await deviceUsersPage.createNewDeviceUser(name, surname);
    const rowCountAfterCreation = await deviceUsersPage.rowNum();
    expect(
      rowCountAfterCreation,
      `Number of rows hasn't changed after creating new user`
    ).equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = await deviceUsersPage.getDeviceUser(
      await deviceUsersPage.rowNum()
    );
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').equal(
      name
    );
    expect(
      lastDeviceUser.lastName,
      'Last name of created user is incorrect'
    ).equal(surname);
  }

  public async editDeviceUser(
    deviceUser: DeviceUsersRowObject,
    name = '',
    surname = ''
  ) {
    deviceUser.editBtn.click();
    // browser.pause(5000);
    await (await $('#editFirstNameInput')).waitForDisplayed({ timeout: 40000 });
    if (name != null) {
      await (await this.editFirstNameInput()).click();
      await (await this.editFirstNameInput()).clearValue();
      await (await this.editFirstNameInput()).setValue(name);
    }
    if (surname != null) {
      await (await this.editLastNameInput()).click();
      await (await this.editLastNameInput()).clearValue();
      await (await this.editLastNameInput()).setValue(surname);
    }
    await (await this.saveEditBtn()).click();
    // browser.pause(12000);
    await (await this.newDeviceUserBtn()).waitForDisplayed({ timeout: 40000 });
  }
}

const deviceUsersPage = new DeviceUsersPage();
export default deviceUsersPage;

export class DeviceUsersRowObject {
  constructor() {}

  siteId: number;
  firstName: string;
  lastName: string;
  editBtn;
  deleteBtn;

  async getRow(rowNum: number) {
    if ((await $$('#deviceUserId'))[rowNum - 1]) {
      this.siteId = +(await (await $$('#deviceUserId')[rowNum - 1]).getText());
      try {
        this.firstName = await (
          await $$('#deviceUserFirstName')[rowNum - 1]
        ).getText();
      } catch (e) {}
      try {
        this.lastName = await (
          await $$('#deviceUserLastName')[rowNum - 1]
        ).getText();
      } catch (e) {}
      this.editBtn = (await $$('#editDeviceUserBtn'))[rowNum - 1];
      this.deleteBtn = (await $$('#deleteDeviceUserBtn'))[rowNum - 1];
    }
    return this;
  }

  async delete() {
    this.deleteBtn.waitForClickable({ timeout: 40000 });
    this.deleteBtn.click();
    await (await deviceUsersPage.saveDeleteBtn()).waitForClickable({
      timeout: 40000,
    });
    await (await deviceUsersPage.saveDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({
      timeout: 40000,
      reverse: true,
    });
    await (await deviceUsersPage.newDeviceUserBtn()).waitForDisplayed();
  }
}
