import Page from '../Page';
import { $ } from '@wdio/globals';
export const configName = 'Test-Set';

export class InsightDashboardSurveysConfigsPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    await browser.pause(1500);
    return (await $$('tbody > tr')).length;
  }

  public async surveyConfigCreateBtn() {
    const ele = await $('#createSurveyConfigBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigCreateSaveBtn() {
    const ele = await $('#surveyConfigCreateSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigCreateCancelBtn() {
    const ele = await $('#surveyConfigCreateSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigEditSaveBtn() {
    const ele = await $('#surveyConfigEditSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigEditCancelBtn() {
    const ele = await $('#surveyConfigEditSaveCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigLocationCheckbox(num: number) {
    const ele = await $(`#checkbox${num} label`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 30000});
    return ele;
  }

  public async surveyConfigDeleteSaveBtn() {
    const ele = await $('#surveyConfigDeleteSaveBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async surveyConfigDeleteCancelBtn() {
    const ele = await $('#surveyConfigDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

/*  public async installationDeleteCancelBtn() {
    const ele = await $('#surveyConfigDeleteCancelBtn');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }*/

  async createSurveyConfig(configName: string) {
    await (await this.surveyConfigCreateBtn()).click();
    const searchField = await surveyConfigsPage.getSurveysSearchField();
    await searchField.addValue(configName);
    const listChoices = await surveyConfigsPage.getSurveyListOfChoices();
    const choice = listChoices[0];
    await choice.click();
    await browser.pause(1000);
    await (await this.surveyConfigCreateSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({
      timeout: 90000,
      reverse: true,
    });
  }

  async createSurveyConfig_Cancels() {
    await (await this.surveyConfigCreateBtn()).click();
    await (await this.surveyConfigCreateCancelBtn()).click();
  }

  async updateSurveyConfig(rowNumber: number) {
    const rowObject = await this.getSurveyConfig(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.editSurveyConfigBtn.waitForClickable({ timeout: 40000 });
    await rowObject.editSurveyConfigBtn.click();
    await (await this.surveyConfigLocationCheckbox(1)).click();
    await (await this.surveyConfigLocationCheckbox(2)).click();
    await browser.pause(1000);
    await (await this.surveyConfigEditSaveBtn()).click();
    await $('#spinner-animation').waitForDisplayed({
      timeout: 90000,
      reverse: true,
    });
  }

  async updateSurveyConfig_Cancels(rowNumber: number) {
    // console.log('rowObject.row', rowObject.row);
    // const rowNum = rowObject.row ? (await $$('tbody > tr')).indexOf(rowObject.row) : 0;
    const rowObject = await this.getSurveyConfig(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.editSurveyConfigBtn.waitForClickable({ timeout: 40000 });
    await rowObject.editSurveyConfigBtn.click();
    await (await this.surveyConfigEditCancelBtn()).click();
  }


  async deleteSurveyConfig(rowNumber: number) {
    // console.log('rowObject.row', rowObject.row);
    // const rowNum = rowObject.row ? (await $$('tbody > tr')).indexOf(rowObject.row) : 0;
    const rowObject = await this.getSurveyConfig(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.surveyConfigDeleteBtn.waitForClickable({ timeout: 40000 });
    await rowObject.surveyConfigDeleteBtn.click();
    await browser.pause(1000);
    await (await this.surveyConfigDeleteSaveBtn()).click();
  }

  async deleteSurveyConfig_Cancels(rowNumber: number) {
    // console.log('rowObject.row', rowObject.row);
    // const rowNum = rowObject.row ? (await $$('tbody > tr')).indexOf(rowObject.row) : 0;
    const rowObject = await this.getSurveyConfig(rowNumber);
    await rowObject.clickActionsMenu(rowNumber - 1);
    await rowObject.surveyConfigDeleteBtn.waitForClickable({ timeout: 40000 });
    await rowObject.surveyConfigDeleteBtn.click();
    await (await this.surveyConfigDeleteCancelBtn()).click();
  }

  public async getSurveysSearchField() {
    const ele = await $('#selectSurveyCreate .ng-input > input');
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async getSurveyListOfChoices() {
    const ele = await $$('ng-dropdown-panel .ng-option');
    await ele[0].waitForDisplayed({timeout: 30000});
    await ele[0].waitForClickable({timeout: 30000});
    return ele;
  }

  async getFirstRowObject(): Promise<SurveysConfigPageRowObject> {
    await browser.pause(500);
    const obj = new SurveysConfigPageRowObject();
    return await obj.getRow(1);
  }

  async getLastRowObject(): Promise<SurveysConfigPageRowObject> {
    return await new SurveysConfigPageRowObject().getRow(await this.rowNum());
  }

  async getSurveyConfig(num): Promise<SurveysConfigPageRowObject> {
    await browser.pause(500);
    const obj = new SurveysConfigPageRowObject();
    return await obj.getRow(num);
  }

  async clickActionsMenu(rowNum: number) {
    await browser.pause(1000);
    await (await $$('#actionMenu'))[rowNum].click();
    await browser.pause(1000);
  }
}

const surveyConfigsPage = new InsightDashboardSurveysConfigsPage();
export default surveyConfigsPage;

export class SurveysConfigPageRowObject {
  constructor() {
  }

  public row: WebdriverIO.Element;
  public id: number;
  public surveyName: string;
  public locations: string[];
  public editSurveyConfigBtn;
  public surveyConfigDeleteBtn;
  public surveyConfigActivateBtn;

  async getRow(rowNum: number): Promise<SurveysConfigPageRowObject> {
    rowNum = rowNum - 1;
    this.row = (await $$('tbody > tr'))[rowNum];
    if (this.row) {
      try {
        this.id = +await (await this.row.$('.mat-column-id span')).getText();
        this.surveyName = await (await this.row.$('.mat-column-surveyName span')).getText();
        this.locations = (await (await this.row.$('.mat-column-locations')).getText()).split('\n\n');
        // await this.clickActionsMenu(rowNum - 1);
        this.editSurveyConfigBtn = await $(`#editSurveyConfigBtn-${rowNum}`);
        this.surveyConfigActivateBtn = await $(`#surveyConfigStatus-${rowNum}`);
        this.surveyConfigDeleteBtn = await $(`#surveyConfigDeleteBtn-${rowNum}`);
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
}
