import Page from '../Page';

export class TrashInspectionSettingsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get trashInspectionSettingsBtn() {
    return browser.element('#trash-inspection-pn-settings');
  }
  goToTrashInspectionSettignsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.trashInspectionSettingsBtn.click();
    browser.pause(8000);
  }
}
