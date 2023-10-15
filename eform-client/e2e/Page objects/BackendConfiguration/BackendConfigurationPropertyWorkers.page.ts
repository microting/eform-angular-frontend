import backendConfigurationPropertiesPage from './BackendConfigurationProperties.page';
import Page from '../Page';

class BackendConfigurationPropertyWorkersPage extends Page {
  constructor() {
    super();
  }

  public async backendConfigurationPnPropertyWorkers() {
    const ele = await $('#backend-configuration-pn-property-workers');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async goToPropertyWorkers() {
    const ele = await $('#backend-configuration-pn-property-workers');
    if (!await ele.isDisplayed()) {
      await (
        await backendConfigurationPropertiesPage.backendConfigurationPnButton()
      ).click();
    }
    await (await this.backendConfigurationPnPropertyWorkers()).click();
    await (await this.newDeviceUserBtn()).waitForClickable({ timeout: 90000 });
  }

  public async newDeviceUserBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#newDeviceUserBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
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

  async getFirstRowObject(): Promise<PropertyWorkerRowObject> {
    const result = new PropertyWorkerRowObject();
    return await result.getRow(1);
  }

  async getLastRowObject(): Promise<PropertyWorkerRowObject> {
    const result = new PropertyWorkerRowObject();
    return await result.getRow(await this.rowNum());
  }

  public async saveCreateBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#saveCreateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelCreateBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#cancelCreateBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editFirstNameInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#firstName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async editLastNameInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#lastName');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async saveEditBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#saveEditBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async cancelEditBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#cancelEditBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
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

  public async profileLanguageSelector() {
    const ele = await $('#profileLanguageSelector');
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async TaskManagementEnableToggleInput() {
    const ele = await $('#taskManagementEnabledToggle');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async profileLanguageSelectorCreate() {
    const ele = await $('#profileLanguageSelectorCreate');
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async checkboxEditAssignment(i: number) {
    const ele = await $(`#checkboxCreateAssignment${i}-input`);
    //await ele.waitForDisplayed({ timeout: 40000 });
    //await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async checkboxCreateAssignment(i: number) {
    const ele = await $(`#checkboxCreateAssignment${i}`);
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
  }

  async getDeviceUser(num): Promise<PropertyWorkerRowObject> {
    const result = new PropertyWorkerRowObject();
    return await result.getRow(num);
  }

  async getDeviceUserByName(name: string): Promise<PropertyWorkerRowObject> {
    for (let i = 1; i < (await this.rowNum()) + 1; i++) {
      const deviceUser = await this.getDeviceUser(i);
      if (deviceUser.fullName === name) {
        return deviceUser;
      }
    }
    return null;
  }

  async create(propertyWorker?: PropertyWorker, clickCancel = false) {
    await this.openCreateModal(propertyWorker);
    await this.closeCreateModal(clickCancel);
  }

  async openCreateModal(propertyWorker?: PropertyWorker) {
    await (await this.newDeviceUserBtn()).waitForClickable({ timeout: 40000 });
    await (await this.newDeviceUserBtn()).click();
    await browser.pause(500);
    await (
      await backendConfigurationPropertyWorkersPage.cancelCreateBtn()
    ).waitForClickable({
      timeout: 40000,
    });
    if (propertyWorker) {
      if (propertyWorker.name) {
        await (
          await backendConfigurationPropertyWorkersPage.createFirstNameInput()
        ).setValue(propertyWorker.name);
      }
      if (propertyWorker.surname) {
        await (
          await backendConfigurationPropertyWorkersPage.createLastNameInput()
        ).setValue(propertyWorker.surname);
      }
      if (propertyWorker.language) {
        await (
          await (
            await backendConfigurationPropertyWorkersPage.profileLanguageSelector()
          ).$('input')
        ).setValue(propertyWorker.language);
        await browser.pause(500);
        const value = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${propertyWorker.language}`);
        await value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
      }
      if (propertyWorker.properties) {
        await browser.pause(500);
        for (let i = 0; i < propertyWorker.properties.length; i++) {
          await (
            await (
              await backendConfigurationPropertyWorkersPage.checkboxCreateAssignment(
                propertyWorker.properties[i]
              )
            )
          ).click();
          await browser.pause(500);
        }
      }
      if(propertyWorker.workOrderFlow === true){
        await (await this.TaskManagementEnableToggleInput()).click();
        await browser.pause(500);
      }
    }
  }

  async closeCreateModal(clickCancel = false) {
    if (clickCancel) {
      await (await this.cancelCreateBtn()).click();
    } else {
      await (await this.saveCreateBtn()).click();
    }
    await (
      await backendConfigurationPropertyWorkersPage.newDeviceUserBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  public async clearTable() {
    await browser.pause(2000);
    const rowCount = await this.rowNum();
    for (let i = 1; i <= rowCount; i++) {
      const row = await new PropertyWorkerRowObject().getRow(1);
      if (row.fullName !== 'John Smith') {
        await row.delete();
      }
    }
  }
}

const backendConfigurationPropertyWorkersPage = new BackendConfigurationPropertyWorkersPage();
export default backendConfigurationPropertyWorkersPage;

export class PropertyWorkerRowObject {
  constructor() {}

  siteId: number;
  fullName: string;
  language: string;
  editBtn: WebdriverIO.Element;
  deleteBtn: WebdriverIO.Element;

  async getRow(rowNum: number) {
    rowNum = rowNum - 1;
    if ((await $('#deviceUserId-'+rowNum))) {
      this.siteId = +await (await $('#deviceUserId-'+rowNum)).getText();
      try {
        this.fullName = await
          (await $('#deviceUserFullName-'+rowNum)).getText();
      } catch (e) {}
      this.language = await (await $('#deviceUserLanguage-'+rowNum)).getText();
      this.editBtn = (await $('#editDeviceUserBtn-'+rowNum));
      this.deleteBtn = (await $('#deleteDeviceUserBtn-'+rowNum));
    }
    return this;
  }

  async delete(clickCancel = false) {
    await this.openDeleteModal();
    await this.closeDeleteModal(clickCancel);
  }

  async openDeleteModal() {
    this.deleteBtn.waitForClickable({ timeout: 40000 });
    this.deleteBtn.click();
    await (
      await backendConfigurationPropertyWorkersPage.saveDeleteBtn()
    ).waitForClickable({
      timeout: 40000,
    });
    await browser.pause(500);
  }

  async closeDeleteModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationPropertyWorkersPage.cancelDeleteBtn()
      ).click();
    } else {
      await (
        await backendConfigurationPropertyWorkersPage.saveDeleteBtn()
      ).click();
    }
    await browser.pause(500);
    await (
      await backendConfigurationPropertyWorkersPage.newDeviceUserBtn()
    ).waitForClickable({ timeout: 40000 });
  }

  async edit(propertyWorker?: PropertyWorker, clickCancel = false) {
    await this.openEditModal(propertyWorker);
    await this.closeEditModal(clickCancel);
  }

  async openEditModal(propertyWorker?: PropertyWorker) {
    await this.editBtn.waitForClickable({ timeout: 40000 });
    await this.editBtn.click();
    await browser.pause(500);
    await (
      await backendConfigurationPropertyWorkersPage.cancelEditBtn()
    ).waitForClickable({
      timeout: 40000,
    });
    if (propertyWorker) {
      if (propertyWorker.name) {
        await (
          await backendConfigurationPropertyWorkersPage.editFirstNameInput()
        ).setValue(propertyWorker.name);
        await browser.pause(500);
      }
      if (propertyWorker.surname) {
        await (
          await backendConfigurationPropertyWorkersPage.editLastNameInput()
        ).setValue(propertyWorker.surname);
        await browser.pause(500);
      }
      if (propertyWorker.language) {
        await (
          await (
            await backendConfigurationPropertyWorkersPage.profileLanguageSelector()
          ).$('input')
        ).setValue(propertyWorker.language);
        await browser.pause(500);
        const value = await (
          await $('ng-dropdown-panel')
        ).$(`.ng-option=${propertyWorker.language}`);
        value.waitForDisplayed({ timeout: 40000 });
        await value.click();
        await browser.pause(500);
      }
      if (propertyWorker.properties) {
        for (let i = 0; i < propertyWorker.properties.length; i++) {
          await (
            await (
              await backendConfigurationPropertyWorkersPage.checkboxEditAssignment(
                propertyWorker.properties[i]
              )
            )
          ).$('..').click();
          await browser.pause(500);
        }
      }
    }
  }

  async closeEditModal(clickCancel = false) {
    if (clickCancel) {
      await (
        await backendConfigurationPropertyWorkersPage.cancelEditBtn()
      ).click();
    } else {
      await (
        await backendConfigurationPropertyWorkersPage.saveEditBtn()
      ).click();
    }
    await browser.pause(500);
    await (
      await backendConfigurationPropertyWorkersPage.newDeviceUserBtn()
    ).waitForDisplayed();
  }

  async getAssignedProperties(): Promise<
    { propertyName: string; checked: boolean }[]
  > {
    await this.openEditModal();
    const pairingEditModalTableBody = await $('#pairingModalTableBody');
    let masForReturn: { propertyName: string; checked: boolean }[] = new Array<{
      propertyName: string;
      checked: boolean;
    }>();
    const propertyLength = await (
      await pairingEditModalTableBody.$$('.propertyName')
    ).length;
    for (let i = 0; i < propertyLength - 1; i++) {
       masForReturn = [
         ...masForReturn,
         {
           propertyName: await (
             await $$('.propertyName')
           )[i+1].getText(),
           checked:
            (await (
              await backendConfigurationPropertyWorkersPage.checkboxEditAssignment(
                i
              )
            ).getAttribute('aria-checked')) === 'true',
         },
       ];
    }
    await this.closeEditModal(true);
    return masForReturn;
  }
}

export class PropertyWorker {
  name?: string;
  surname?: string;
  language?: string;
  properties?: number[];
  workOrderFlow?: boolean
}
