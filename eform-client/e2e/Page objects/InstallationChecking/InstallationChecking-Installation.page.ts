import Page from '../Page';

export class InstallationCheckingInstallationPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public installationCheckingDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Planlægning')]`).click();
  }
  public get installationBtn() {
    return browser.element('#installationchecking-pn-installation');
  }
  public get installationCreateBtn() {
    return browser.element('#createInstallationBtn');
  }
  public get installationAssignBtn() {
    return browser.element('#installationAssignBtn');
  }
  public get installationAssignBtnSave() {
    return browser.element('#installationAssignBtnSave');
  }
  public get installationAssignBtnSaveCancel() {
    return browser.element('#installationAssignBtnSaveCancel');
  }
  public get installationRetractBtn() {
    return browser.element('#installationRetractBtn');
  }
  public get installationRetractSaveBtn() {
    return browser.element('#installationRetractSaveBtn');
  }
  public get installationRetractSaveCancelBtn() {
    return browser.element('#installationRetractSaveCancelBtn');
  }
  public get installationCreateNameBox() {
    return browser.element('#createInstallationName');
  }
  public get installationAssignCheckbox() {
    return browser.element('#assignCheckbox');
  }
  public get installationCreateSiteCheckbox() {
    return browser.element('#checkbox');
  }
  public get installationCreateSaveBtn() {
    return browser.element('#installationCreateSaveBtn');
  }
  public get installationCreateCancelBtn() {
    return browser.element('#installationCreateCancelBtn');
  }
  public get installationUpdateNameBox() {
    return browser.element('#updateInstallationName');
  }
  public get installationUpdateSiteCheckbox() {
    return browser.element('#checkbox');
  }
  public get installationUpdateSaveBtn() {
    return browser.element('#installationUpdateSaveBtn');
  }
  public get installationUpdateCancelBtn() {
    return browser.element('#installationUpdateCancelBtn');
  }
  public get installationDeleteId() {
    return browser.element('#selectedInstallationId');
  }
  public get installationDeleteName() {
    return browser.element('#selectedInstallationName');
  }
  public get installationDeleteDeleteBtn() {
    return browser.element('#installationDeleteDeleteBtn');
  }
  public get installationDeleteCancelBtn() {
    return browser.element('#installationDeleteCancelBtn');
  }
  public get page2Object() {
    return browser.element(`//*[div]//*[contains(@class, 'd-flex justify-content-center')]//*[ul]//*[contains(@class, 'page-item')]//*[contains(text(), '2')]`);
  }
  goToInstallationsPage() {
    this.installationCheckingDropDown();
    browser.pause(1000);
    this.installationBtn.click();
    browser.pause(30000);
  }

  createInstallation(name: string) {
    this.installationCreateBtn.click();
    browser.pause(8000);
    const searchField = installationPage.getCustomerSearchField();
    searchField.addValue(name);
    const listChoices = installationPage.getCustomerListOfChoices();
    const choice = listChoices[0];
    browser.pause(8000);
    choice.click();
    browser.pause(1000);
    this.installationCreateSaveBtn.click();
    browser.pause(8000);
  }
  createInstallation_Cancels() {
    this.installationCreateBtn.click();
    browser.pause(8000);
    this.installationCreateCancelBtn.click();
    browser.pause(8000);
  }
  retractInstallation() {
    const installation = installationPage.getFirstRowObject();
    installation.retractBtn.click();
    browser.pause(5000);
    this.installationRetractSaveBtn.click();
    browser.pause(15000);
  }

  retractInstallation_Cancels() {
    const installation = installationPage.getFirstRowObject();
    installation.retractBtn.click();
    browser.pause(5000);
    this.installationRetractSaveCancelBtn.click();
    browser.pause(5000);
  }

  public  getCustomerSearchField() {
    return browser.element('#selectCustomer .ng-input > input');
  }
  public getCustomerListOfChoices() {
    return browser.$$('#selectCustomer .ng-option');
  }
  public  selectedListField() {
    return browser.$('#selectCustomer .ng-value .ng-value-label');
  }

  public  getDeviceUserSearchField() {
    return browser.element('#selectDeviceUser .ng-input > input');
  }
  public getDeviceUserListOfChoices() {
    return browser.$$('#selectDeviceUser .ng-option');
  }

  assignInstallation(deviceUserName: string) {
    const installation = installationPage.getFirstRowObject();
    installation.assignCheckbox.click();
    browser.pause(8000);
    this.installationAssignBtn.click();
    browser.pause(8000);
    const searchField = installationPage.getDeviceUserSearchField();
    searchField.addValue(deviceUserName);
    const listChoices = installationPage.getDeviceUserListOfChoices();
    const choice = listChoices[0];
    browser.pause(8000);
    choice.click();
    browser.pause(1000);
    this.installationAssignBtnSave.click();
    browser.pause(50000);
  }

  assignInstallation_Cancels() {
    const installation = installationPage.getFirstRowObject();
    installation.assignCheckbox.click();
    browser.pause(8000);
    this.installationAssignBtn.click();
    browser.pause(8000);
    this.installationAssignBtnSaveCancel.click();
    browser.pause(8000);
    installation.assignCheckbox.click();
    browser.pause(8000);
  }

  getFirstRowObject(): InstallationPageRowObject {
    return new InstallationPageRowObject(1);
  }
  getInstallation(num): InstallationPageRowObject {
    return new InstallationPageRowObject(num);
  }
}

const installationPage = new InstallationCheckingInstallationPage();
export default installationPage;

export class InstallationPageRowObject {
  constructor(rowNum) {
    if ($$('#installationId')[rowNum - 1]) {
      this.id = $$('#installationId')[rowNum - 1];
      try {
        this.companyName = $$('#installationCompanyName')[rowNum - 1].getText();
        // this.companyAddress = $$('#companyAddressTableHeader')[rowNum - 1].getText();
        // this.companyAddress2 = $$('#companyAddress2TableHeader')[rowNum - 1].getText();
        // this.zipCode = $$('#zipCodeTableHeader')[rowNum - 1].getText();
        // this.cityName = $$('#cityNameTableHeader')[rowNum - 1].getText();
        // this.countryCode = $$('#countryCodeTableHeader')[rowNum - 1].getText();
        // this.dateInstall = $$('#dateInstallTableHeader')[rowNum - 1].getText();
        this.assignedTo = $$('#installationAssignedTo')[rowNum - 1].getText();
      } catch (e) {}
      this.assignCheckbox = $$(`#assignCheckbox_${rowNum - 1}`)[rowNum - 1];
      this.retractBtn = $$('#installationRetractBtn')[rowNum - 1];
    }
  }

  public id;
  public companyName;
  public assignCheckbox;
  public retractBtn;
  public version;
  public date;
  public companyAddress;
  public companyAddress2;
  public zipCode;
  public cityName;
  public time;
  public countryCode;
  public dateInstall;
  public assignedTo;
  public name;
  public status;
}
