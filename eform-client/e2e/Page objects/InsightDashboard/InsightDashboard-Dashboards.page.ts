import Page from '../Page';
import { $ } from '@wdio/globals';
import {selectValueInNgSelector} from '../../Helpers/helper-functions';
import loginPage from "../Login.page";

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';

export class InsightDashboardDashboardsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(500);
    return (await $$('tbody > tr')).length;
  }

  public async dashboardCreateBtn() {
    const ele = await $('#createDashboardBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCreateSaveBtn() {
    const ele = await $('#dashboardCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCreateCancelBtn() {
    const ele = await $('#dashboardCreateSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardName() {
    const ele = await $('#dashboardNameCreate');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardNameInput() {
    const ele = await (await this.dashboardName()).$('input');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardEditSaveBtn() {
    const ele = await $('#dashboardEditSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardEditCancelBtn() {
    const ele = await $('#dashboardEditSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardDeleteSaveBtn() {
    const ele = await $('#dashboardDeleteSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardDeleteCancelBtn() {
    const ele = await $('#dashboardDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCopySaveBtn() {
    const ele = await $('#dashboardCopySaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async dashboardCopySaveCancelBtn() {
    const ele = $('#dashboardCopySaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  async createDashboard(name: string = 'NewDashboard') {
    await (await this.dashboardCreateBtn()).click();
    await (await this.dashboardName()).click();
    await (await this.dashboardName()).addValue(name);
    // Select survey
    await selectValueInNgSelector(await this.getSurveysSearchField(), configName, true);
    await (await this.dashboardCreateSaveBtn()).click();
  }

  async createDashboard_Cancels() {
    await (await this.dashboardCreateBtn()).click();
    await (await this.dashboardCreateCancelBtn()).click();
  }

  async deleteDashboard(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardDeleteBtn.waitForClickable({ timeout: 40000 });
    await rowObject.dashboardDeleteBtn.click();
    await (await this.dashboardDeleteSaveBtn()).click();
  }

  async deleteDashboard_Cancels(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardDeleteBtn.waitForClickable({ timeout: 40000 });
    await rowObject.dashboardDeleteBtn.click();
    await (await this.dashboardDeleteCancelBtn()).click();
  }

  async copyDashboard(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardCopyBtn.waitForClickable({ timeout: 40000 });
    await rowObject.dashboardCopyBtn.click();
    await (await this.dashboardCopySaveBtn()).click();
  }

  async copyDashboard_Cancel(rowNumber: number) {
    const rowObject = await this.getDashboard(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.dashboardCopyBtn.waitForClickable({ timeout: 40000 });
    await rowObject.dashboardCopyBtn.click();
    await (await this.dashboardCopySaveCancelBtn()).click();
  }

  public async getSurveysSearchField() {
    const ele = await $('#selectSurveyCreate');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getSurveyListOfChoices() {
    return $$('.ng-option');
  }

  async getLastRowObject(): Promise<DashboardsPageRowObject> {
    return await new DashboardsPageRowObject().getRow(await this.rowNum());
  }

  async getFirstRowObject(): Promise<DashboardsPageRowObject> {
    return await new DashboardsPageRowObject().getRow(1);
  }

  public async clearTable() {
    await browser.pause(1000);
    const rowCount = await this.rowNum();
    for (let i = 0; i < rowCount; i++) {
      await (await this.getFirstRowObject()).delete(0);
      await loginPage.waitForSpinnerHide(40000);
    }
  }

  async getDashboard(num: number): Promise<DashboardsPageRowObject> {
    await browser.pause(1000);
    return await new DashboardsPageRowObject().getRow(num);
  }
}

const dashboardsPage = new InsightDashboardDashboardsPage();
export default dashboardsPage;

export class DashboardsPageRowObject {
  constructor() {}

  public row: WebdriverIO.Element;
  public rowNum: number;
  public id: number;
  public dashboardName: string;
  public locations;
  public dashboardViewBtn: WebdriverIO.Element;
  public dashboardEditBtn: WebdriverIO.Element;
  public dashboardCopyBtn: WebdriverIO.Element;
  public dashboardDeleteBtn: WebdriverIO.Element;


  async getRow(rowNum: number): Promise<DashboardsPageRowObject> {
    rowNum = rowNum - 1;
    this.rowNum = rowNum;
    this.row = (await $$('tbody > tr'))[rowNum];
    if (this.row) {
      try {
        this.id = +await (await this.row.$('.mat-column-id span')).getText();
        this.dashboardName = await (await this.row.$('.mat-column-dashboardName span')).getText();
        // this.locations = (await (await this.row.$('.mat-column-locations')).getText()).split('\n\n');
        this.dashboardViewBtn = await $(`#dashboardViewBtn-${rowNum}`);
        this.dashboardEditBtn = await $(`#dashboardEditBtn-${rowNum}`);
        this.dashboardCopyBtn = await $(`#dashboardCopyBtn-${rowNum}`);
        this.dashboardDeleteBtn = await $(`#dashboardDeleteBtn-${rowNum}`);
      } catch (e) {
      }
    }
    return this;
  }

  async clickActionsMenu(rowNum: number) {
    await browser.pause(1000);
    await (await $$('#actionMenu'))[rowNum].click();
    await browser.pause(1000);
  }

  async edit() {
    const rowNum = this.row ? (await $$('tbody > tr')).indexOf(this.row) : 0;
    await this.clickActionsMenu(rowNum);
    await this.dashboardEditBtn.waitForClickable({ timeout: 40000 });
    await this.dashboardEditBtn.click();
    await browser.pause(500);
  }

  async delete(rowNum: number) {
    // const rowNum = this.row ? (await $$('tbody > tr')).indexOf(this.row) : 0;
    await this.clickActionsMenu(this.rowNum);
    await this.dashboardDeleteBtn.click();
    await browser.pause(500);
    //await (await dashboardsPage.dashboardDeleteSaveBtn()).waitForClickable();
    await (await dashboardsPage.dashboardDeleteSaveBtn()).click();
    await browser.pause(500);
    //await (await dashboardsPage.dashboardCreateBtn()).waitForClickable();
  }
}
