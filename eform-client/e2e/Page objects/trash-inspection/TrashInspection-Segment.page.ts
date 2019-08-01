import Page from '../Page';

export class TrashInspectionSegemtnsPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get segmentnBtn() {
    return browser.element('#trash-inspection-pn-segments');
  }
  public get createSegmentBtn() {
    return browser.element('#createSegmentBtn');
  }
  public get segmentCreateNameBox() {
    return browser.element('#createSegmentName');
  }
  public get segmentCreateDescriptionBox() {
    return browser.element('#createSegmentDescription');
  }
  public get segmentCreateSDKFolderId() {
    return browser.element('#createSegmentSdkFolderId');
  }
  public get segmentCreateSaveBtn() {
    return browser.element('#segmentCreateSaveBtn');
  }
  public get segmentCreateCancelBtn() {
    return browser.element('#segmentCreateCancelBtn');
  }
  public get editSegmentBtn() {
    return browser.element('#editSegmentBtn');
  }
  public get segmentUpdateNameBox() {
    return browser.element('#updateSegmentName');
  }
  public get segmentUpdateDesciptionBox() {
    return browser.element('#updateSegmentDescription');
  }
  public get segmentUpdateSDKFolderId() {
    return browser.element('#updateSegmentSdkFolderId');
  }
  public get segmentUpdateSaveBtn() {
    return browser.element('#segmentUpdateSaveBtn');
  }
  public get segmentUpdateCancelBtn() {
    return browser.element('#segmentUpdateCancelBtn');
  }
  public get deleteSegmentBtn() {
    return browser.element('#deleteSegmentBtn');
  }
  public get segmentDeleteId() {
    return browser.element('#selectedSegmentId');
  }
  public get segmentDelteCreatedDate() {
    return browser.element('#selectedSegmentCreatedDate');
  }
  public get segmentDeleteName() {
    return browser.element('#selectedSegmentName');
  }
  public get segmentDeleteDeleteBtn() {
    return browser.element('#segmentDeleteDeleteBtn');
  }
  public get segmentDeleteCancelBtn() {
    return browser.element('#segmentDeleteCancelBtn');
  }
  goToSegmentsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.segmentnBtn.click();
    browser.pause(8000);
  }
  createSegment(name: string, description?: any, sdkFolderId?: any) {
    this.createSegmentBtn.click();
    browser.pause(10000);
    this.segmentCreateNameBox.addValue(name);
    browser.pause(1000);
    if (description != null) {
      this.segmentCreateDescriptionBox.addValue(description);
    }
    browser.pause(1000);
    if (sdkFolderId != null) {
      this.segmentCreateSDKFolderId.addValue(sdkFolderId);
    }
    browser.pause(1000);
    this.segmentCreateSaveBtn.click();
    browser.pause(8000);
  }
  editSegment(newName: string, newDescription?: string, newSDKFolderId?: any) {
    this.editSegmentBtn.click();
    browser.pause(10000);
    this.segmentUpdateNameBox.clearElement();
    this.segmentUpdateNameBox.addValue(newName);
    browser.pause(1000);
    if (newDescription != null) {
      this.segmentUpdateDesciptionBox.clearElement();
      this.segmentUpdateDesciptionBox.addValue(newDescription);
    }
    browser.pause(1000);
    if (newSDKFolderId != null) {
      this.segmentUpdateSDKFolderId.clearElement();
      this.segmentUpdateSDKFolderId.addValue(newSDKFolderId);
    }
    browser.pause(1000);
    this.segmentUpdateSaveBtn.click();
    browser.pause(8000);
  }
  deleteSegment() {
    const segmentForDelete = this.getFirstRowObject();
    segmentForDelete.deleteBtn.click();
    browser.pause(4000);
    this.segmentDeleteDeleteBtn.click();
    browser.pause(8000);
    browser.refresh();
    browser.pause(10000);
  }
  getFirstRowObject(): SegmentsRowObject {
    return new SegmentsRowObject(1);
  }
  getRowObject(rowNum): SegmentsRowObject {
    return new SegmentsRowObject(rowNum);
  }
}

const segmentsPage = new TrashInspectionSegemtnsPage();
export default segmentsPage;

export class SegmentsRowObject {
  constructor(rowNum) {
    if ($$('#segmentId')[rowNum - 1]) {
      this.id = +$$('#segmentId')[rowNum - 1];
      try {
        this.name = $$('#segmentName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.description = $$('#segmentDescription')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.sdkFolderId = $$('#segmentSDKFolderID')[rowNum - 1].getText();
      } catch (e) {}
      this.editBtn = $$('#editSegmentBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteSegmentBtn')[rowNum - 1];
    }
  }
  id;
  name;
  description;
  sdkFolderId;
  editBtn;
  deleteBtn;
}
