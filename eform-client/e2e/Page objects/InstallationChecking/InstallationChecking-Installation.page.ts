import Page from '../Page';

export class InstallationCheckingInstallationPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public installationCheckingDropDown() {
    $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Planlægning')]`).click();
  }
  public get installationBtn() {
    return $('#installationchecking-pn-installation');
  }
  public get installationCreateBtn() {
    return $('#createInstallationBtn');
  }
  public get installationAssignBtn() {
    return $('#installationAssignBtn');
  }
  public get installationAssignBtnSave() {
    return $('#installationAssignBtnSave');
  }
  public get installationAssignBtnSaveCancel() {
    return $('#installationAssignBtnSaveCancel');
  }
  public get installationRetractBtn() {
    return $('#installationRetractBtn');
  }
  public get installationRetractSaveBtn() {
    return $('#installationRetractSaveBtn');
  }
  public get installationRetractSaveCancelBtn() {
    return $('#installationRetractSaveCancelBtn');
  }
  public get installationCreateNameBox() {
    return $('#createInstallationName');
  }
  public get installationAssignCheckbox() {
    return $('#assignCheckbox');
  }
  public get installationCreateSiteCheckbox() {
    return $('#checkbox');
  }
  public get installationCreateSaveBtn() {
    return $('#installationCreateSaveBtn');
  }
  public get installationCreateCancelBtn() {
    return $('#installationCreateCancelBtn');
  }
  public get installationUpdateNameBox() {
    return $('#updateInstallationName');
  }
  public get installationUpdateSiteCheckbox() {
    return $('#checkbox');
  }
  public get installationUpdateSaveBtn() {
    return $('#installationUpdateSaveBtn');
  }
  public get installationUpdateCancelBtn() {
    return $('#installationUpdateCancelBtn');
  }
  public get installationDeleteId() {
    return $('#selectedInstallationId');
  }
  public get installationDeleteName() {
    return $('#selectedInstallationName');
  }
  public get installationDeleteDeleteBtn() {
    return $('#installationDeleteDeleteBtn');
  }
  public get installationDeleteCancelBtn() {
    return $('#installationDeleteCancelBtn');
  }
  public get page2Object() {
    return $(`//*[div]//*[contains(@class, 'd-flex justify-content-center')]//*[ul]//*[contains(@class, 'page-item')]//*[contains(text(), '2')]`);
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
    return $('#selectCustomer .ng-input > input');
  }
  public getCustomerListOfChoices() {
    return browser.$$('#selectCustomer .ng-option');
  }
  public  selectedListField() {
    return browser.$('#selectCustomer .ng-value .ng-value-label');
  }

  public  getDeviceUserSearchField() {
    return $('#selectDeviceUser .ng-input > input');
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
