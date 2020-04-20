import Page from '../Page';

export const configName = 'Test-Set';
export const dashboardName = 'NewDashboard';

export class InsightDashboardDashboardsPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }

  public get dashboardCreateBtn() {
    $('#createDashboardBtn').waitForDisplayed({timeout: 30000});
    $('#createDashboardBtn').waitForClickable({timeout: 20000});
    return $('#createDashboardBtn');
  }

  public get dashboardCreateSaveBtn() {
    $('#dashboardCreateSaveBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCreateSaveBtn');
  }

  public get dashboardCreateCancelBtn() {
    $('#dashboardCreateSaveCancelBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardCreateSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCreateSaveCancelBtn');
  }

  public get dashboardName() {
    $('#dashboardNameCreate').waitForDisplayed({timeout: 30000});
    $('#dashboardNameCreate').waitForClickable({timeout: 20000});
    return $('#dashboardNameCreate');
  }

  public get dashboardNameInput() {
    $('#dashboardNameCreate > input').waitForDisplayed({timeout: 30000});
    $('#dashboardNameCreate > input').waitForClickable({timeout: 20000});
    return $('#dashboardNameCreate > input');
  }

  public get dashboardEditSaveBtn() {
    $('#dashboardEditSaveBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardEditSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardEditSaveBtn');
  }

  public get dashboardEditCancelBtn() {
    $('#dashboardEditSaveCancelBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardEditSaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardEditSaveCancelBtn');
  }

  public get dashboardDeleteSaveBtn() {
    $('#dashboardDeleteSaveBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardDeleteSaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardDeleteSaveBtn');
  }

  public get dashboardDeleteCancelBtn() {
    $('#dashboardDeleteCancelBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardDeleteCancelBtn');
  }

  public get dashboardCopySaveBtn() {
    $('#dashboardCopySaveBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardCopySaveBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCopySaveBtn');
  }

  public get dashboardCopySaveCancelBtn() {
    $('#dashboardCopySaveCancelBtn').waitForDisplayed({timeout: 30000});
    $('#dashboardCopySaveCancelBtn').waitForClickable({timeout: 20000});
    return $('#dashboardCopySaveCancelBtn');
  }

  createDashboard() {
    this.dashboardCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardName.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardName.addValue(dashboardName);
    // Select survey
    const surveySearchField = dashboardsPage.getSurveysSearchField();
    surveySearchField.addValue(configName);
    const surveyListChoices = dashboardsPage.getSurveyListOfChoices();
    const surveyChoice = surveyListChoices[0];
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    surveyChoice.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  createDashboard_Cancels() {
    this.dashboardCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  deleteDashboard(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardDeleteSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  deleteDashboard_Cancels(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardDeleteCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  copyDashboard(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardCopyBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardCopySaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  copyDashboard_Cancel(rowObject: DashboardsPageRowObject) {
    rowObject.dashboardCopyBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    this.dashboardCopySaveCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }

  public getSurveysSearchField() {
    $('#selectSurveyCreate .ng-input > input').waitForDisplayed({timeout: 30000});
    $('#selectSurveyCreate .ng-input > input').waitForClickable({timeout: 20000});
    return $('#selectSurveyCreate .ng-input > input');
  }

  public getSurveyListOfChoices() {
    return $$('#selectSurveyCreate .ng-option');
  }

  getFirstRowObject(): DashboardsPageRowObject {
    return new DashboardsPageRowObject(1);
  }

  getDashboard(num): DashboardsPageRowObject {
    browser.pause(500);
    return new DashboardsPageRowObject(num);
  }
}

const dashboardsPage = new InsightDashboardDashboardsPage();
export default dashboardsPage;

export class DashboardsPageRowObject {
  constructor(rowNum) {
    if ($$('#dashboardId')[rowNum - 1]) {
      this.id = $$('#dashboardId')[rowNum - 1];
      try {
        this.dashboardName = $$('#dashboardName')[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.locations = $$('#dashboardLocation > p')[rowNum - 1];
      } catch (e) {
      }
      // this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.dashboardEditBtn = $$('#dashboardEditBtn')[rowNum - 1];
      this.dashboardViewBtn = $$('#dashboardViewBtn')[rowNum - 1];
      this.dashboardDeleteBtn = $$('#dashboardDeleteBtn')[rowNum - 1];
      this.dashboardCopyBtn = $$('#dashboardCopyBtn')[rowNum - 1];
    }
  }

  public id;
  public dashboardName;
  public locations;
  public dashboardViewBtn;
  public dashboardEditBtn;
  public dashboardDeleteBtn;
  public dashboardCopyBtn;
}
