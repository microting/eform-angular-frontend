import Page from '../Page';

export class TrashInspectionsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get trashInspectionBtn() {
    return browser.element('#trash-inspection-pn-trash-inspection');
  }
  goToTrashInspectionPage() {
  this.trashInspectionDropDown();
  browser.pause(1000);
  this.trashInspectionBtn.click();
  browser.pause(8000);
  }
}

const trashInspectionsPage = new TrashInspectionsPage();
export default trashInspectionsPage;

export class TrashInspectionsRowObject {
  constructor(rowNumber) {
    this.id = $$('#idTableHeader')[rowNumber - 1].getText();
    this.date = $$('#dateTableHeader')[rowNumber - 1].getText();
    this.eakCode = $$('#eakCodeTableHeader')[rowNumber - 1].getText();
    this.installationId = $$('#installationIdTableHeader')[rowNumber - 1].getText();
    this.mustBeInspected = $$('#mustBeInspectedTableHeader')[rowNumber - 1].getText();
    this.producer = $$('#producerTableHeader')[rowNumber - 1].getText();
    this.registrationNumber = $$('#registrationNumberTableHeader')[rowNumber - 1].getText();
    this.time = $$('#timeTableHeader')[rowNumber - 1].getText();
    this.transporter = $$('#transporterTableHeader')[rowNumber - 1].getText();
    this.trashFraction = $$('#trashFractionTableHeader')[rowNumber - 1].getText();
    this.weighingNumber = $$('#weighingNumberTableHeader')[rowNumber - 1].getText();
    this.name = $$('#nameTableHeader')[rowNumber - 1].getText();
    this.status = $$('#statusTableHeader')[rowNumber - 1].getText();
  }
  public id;
  public version;
  public updatedByUserId;
  public createdBy;
  public date;
  public eakCode;
  public installationId;
  public mustBeInspected;
  public producer;
  public registrationNumber;
  public time;
  public transporter;
  public trashFraction;
  public weighingNumber;
  public name;
  public status;
}
