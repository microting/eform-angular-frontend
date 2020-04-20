import Page from '../Page';

export const configName = 'Test-Set';

export class InsightDashboardSurveysConfigsPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }

  public get surveyConfigCreateBtn() {
    $('#createSurveyConfigBtn').waitForDisplayed({timeout: 30000});
    $('#createSurveyConfigBtn').waitForClickable({timeout: 20000});
    return $('#createSurveyConfigBtn');
  }

  public get surveyConfigCreateSaveBtn() {
    $('#surveyConfigCreateSaveBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigCreateSaveBtn');
  }

  public get surveyConfigCreateCancelBtn() {
    $('#surveyConfigCreateSaveCancelBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigCreateSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigCreateSaveCancelBtn');
  }

  public get surveyConfigEditSaveBtn() {
    $('#surveyConfigEditSaveBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigEditSaveBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigEditSaveBtn');
  }

  public get surveyConfigEditCancelBtn() {
    $('#surveyConfigEditSaveCancelBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigEditSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigEditSaveCancelBtn');
  }

  private surveyConfigLocationEditCheckbox(num: number) {
    const ele =  $(`#checkboxEdit${num}`);
    ele.waitForDisplayed({timeout: 30000});
    ele.waitForClickable({timeout: 30000});
    return ele;
  }

  private surveyConfigLocationCreateCheckbox(num: number) {
    const ele = $(`#checkboxCreate${num}`);
    ele.waitForDisplayed({timeout: 30000});
    ele.waitForClickable({timeout: 30000});
    return ele;
  }

  public get surveyConfigDeleteSaveBtn() {
    $('#surveyConfigDeleteSaveBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigDeleteSaveBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigDeleteSaveBtn');
  }

  public get surveyConfigDeleteCancelBtn() {
    $('#surveyConfigDeleteCancelBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigDeleteCancelBtn');
  }

  public get installationDeleteCancelBtn() {
    $('#surveyConfigDeleteCancelBtn').waitForDisplayed({timeout: 30000});
    $('#surveyConfigDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#surveyConfigDeleteCancelBtn');
  }

  createSurveyConfig(configName: string) {
    this.surveyConfigCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const searchField = surveyConfigsPage.getSurveysSearchField();
    searchField.addValue(configName);
    const listChoices = surveyConfigsPage.getSurveyListOfChoices();
    const choice = listChoices[0];
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    choice.click();
    browser.pause(1000);
    this.surveyConfigCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  createSurveyConfig_Cancels() {
    this.surveyConfigCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.surveyConfigCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  updateSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    rowObject.editSurveyConfigBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.surveyConfigLocationEditCheckbox(1).click();
    this.surveyConfigLocationEditCheckbox(2).click();
    browser.pause(1000);
    this.surveyConfigEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  updateSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    rowObject.editSurveyConfigBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.surveyConfigEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }


  deleteSurveyConfig(rowObject: SurveysConfigPageRowObject) {
    rowObject.surveyConfigDeleteBtn.click();
    browser.pause(1000);
    this.surveyConfigDeleteSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  deleteSurveyConfig_Cancels(rowObject: SurveysConfigPageRowObject) {
    rowObject.surveyConfigDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.surveyConfigDeleteCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  activateSurveyConfig() {
    // const installation = installationPage.getFirstRowObject();
    // installation.retractBtn.click();
    // browser.pause(5000);
    // this.installationRetractSaveBtn.click();
    // browser.pause(15000);
  }

  activateSurveyConfig__Cancels() {
    // const installation = installationPage.getFirstRowObject();
    // installation.retractBtn.click();
    // browser.pause(5000);
    // this.installationRetractSaveBtn.click();
    // browser.pause(15000);
  }

  public getSurveysSearchField() {
    $('#selectSurveyCreate .ng-input > input').waitForDisplayed({timeout: 30000});
    $('#selectSurveyCreate .ng-input > input').waitForClickable({timeout: 20000});
    return $('#selectSurveyCreate .ng-input > input');
  }

  public getSurveyListOfChoices() {
    const ele = $$('#selectSurveyCreate .ng-option');
    ele[0].waitForDisplayed({timeout: 30000});
    ele[0].waitForClickable({timeout: 30000});
    return ele;
  }

  getFirstRowObject(): SurveysConfigPageRowObject {
    browser.pause(500);
    return new SurveysConfigPageRowObject(1);
  }

  getSurveyConfig(num): SurveysConfigPageRowObject {
    browser.pause(500);
    return new SurveysConfigPageRowObject(num);
  }
}

const surveyConfigsPage = new InsightDashboardSurveysConfigsPage();
export default surveyConfigsPage;

export class SurveysConfigPageRowObject {
  constructor(rowNum) {
    if ($$('#surveyConfigId')[rowNum - 1]) {
      this.id = $$('#surveyConfigId')[rowNum - 1];
      try {
        this.surveyName = $$('#surveyConfigName')[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.locations = $$('#surveyConfigLocation > p')[rowNum - 1];
      } catch (e) {
      }
      // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.editSurveyConfigBtn = $$('#editSurveyConfigBtn')[rowNum - 1];
      this.surveyConfigDeleteBtn = $$('#surveyConfigDeleteBtn')[rowNum - 1];
      this.surveyConfigActivateBtn = $$('#surveyConfigActivateBtn')[rowNum - 1];
    }
  }

  public id;
  public surveyName;
  public locations;
  public editSurveyConfigBtn;
  public surveyConfigDeleteBtn;
  public surveyConfigActivateBtn;
}
