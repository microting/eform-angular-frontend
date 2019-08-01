import Page from '../Page';

export class TrashInspectionInstallationPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  // public get paginationElement() {
  //   return browser.element(`//*[contains`)
  // }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get installationBtn() {
    return browser.element('#trash-inspection-pn-installations');
  }
  public get installationCreateBtn() {
    return browser.element('#createInstallationBtn');
  }
  public get installationEditBtn() {
    return browser.element('#updateInstallationBtn');
  }
  public get installationDeleteBtn() {
    return browser.element('#deleteInstallationBtn');
  }
  public get installationCreateNameBox() {
    return browser.element('#createInstallationName');
  }
  public get installationCreateSiteCheckbox() {
    return browser.element('#checkbox');
  }
  public get installationCreateSaveBtn() {
    return browser.element('#installationCreateSaveBtn');
  }
  public get installationCreateCancelBtn() {
    return browser.element('#installationCreateSaveBtn');
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
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.installationBtn.click();
    browser.pause(30000);
  }
  createInstallation_AddSite(name: string) {
    this.installationCreateBtn.click();
    browser.pause(8000);
    this.installationCreateNameBox.addValue(name);
    this.installationCreateSiteCheckbox.click();
    browser.pause(1000);
    this.installationCreateSaveBtn.click();
    browser.pause(8000);
  }
  createInstallation_DoesntAddSite(name: string) {
    this.installationCreateBtn.click();
    browser.pause(10000);
    this.installationCreateNameBox.addValue(name);
    browser.pause(1000);
    this.installationCreateSaveBtn.click();
    browser.pause(16000);
  }
  createInstallation_AddSite_Cancels(name: string) {
    this.installationCreateBtn.click();
    browser.pause(8000);
    this.installationCreateNameBox.addValue(name);
    this.installationCreateSiteCheckbox.click();
    browser.pause(1000);
    this.installationCreateCancelBtn.click();
    browser.pause(8000);
  }
  createInstallation_DoesntAddSite_Cancels(name: string) {
    this.installationCreateBtn.click();
    browser.pause(8000);
    this.installationCreateNameBox.addValue(name);
    browser.pause(1000);
    this.installationCreateCancelBtn.click();
    browser.pause(8000);
  }
  createInstallation_cancels() {
    this.installationCreateBtn.click();
    browser.pause(8000);
    this.installationCreateCancelBtn.click();
    browser.pause(8000);
  }

  editInstallation_AddSite(name: string) {
    this.installationEditBtn.click();
    browser.pause(8000);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    browser.pause(1000);
    this.installationUpdateSaveBtn.click();
    browser.pause(8000);
  }
  editInstallation_RemovesSite(name: string) {
    this.installationEditBtn.click();
    browser.pause(8000);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    browser.pause(1000);
    this.installationUpdateSaveBtn.click();
    browser.pause(8000);
  }editInstallation_OnlyEditsName(name: string) {
    this.installationEditBtn.click();
    browser.pause(10000);
    this.installationUpdateNameBox.clearElement();
    this.installationUpdateNameBox.addValue(name);
    browser.pause(1000);
    this.installationUpdateSaveBtn.click();
    browser.pause(16000);
  }
  editInstallation_AddSite_Cancels(name: string) {
    this.installationEditBtn.click();
    browser.pause(8000);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    browser.pause(1000);
    this.installationUpdateCancelBtn.click();
    browser.pause(8000);
  }
  editInstallation_RemovesSite_Cancels(name: string) {
    this.installationEditBtn.click();
    browser.pause(8000);
    this.installationUpdateNameBox.addValue(name);
    this.installationUpdateSiteCheckbox.click();
    browser.pause(1000);
    this.installationUpdateCancelBtn.click();
    browser.pause(8000);
  }

  deleteInstallation_Deletes() {
    this.installationDeleteBtn.click();
    browser.pause(8000);
    this.installationDeleteDeleteBtn.click();
  }
  deleteInstallation_Cancels() {
    this.installationDeleteBtn.click();
    browser.pause(8000);
    this.installationDeleteCancelBtn.click();
  }
  getFirstRowObject(): InstallationPageRowObject {
    return new InstallationPageRowObject(1);
  }
  getInstallation(num): InstallationPageRowObject {
    return new InstallationPageRowObject(num);
  }
}

const installationPage = new TrashInspectionInstallationPage();
export default installationPage;

export class InstallationPageRowObject {
  constructor(rowNum) {
    if ($$('#installationId')[rowNum - 1]) {
      this.id = $$('#installationId')[rowNum - 1];
      try {
        this.name = $$('#installationName')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#updateInstallationBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteInstallationBtn')[rowNum - 1];
    }
  }

  id;
  name;
  editBtn;
  deleteBtn;
}
