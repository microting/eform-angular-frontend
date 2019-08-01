import Page from '../Page';
import XMLForEformFractions from '../../Constants/XMLForEformFractions';


export class TrashInspectionFractionPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }
  public get newEformBtn() {
    return browser.element('#newEFormBtn');
  }
  public get xmlTextArea() {
    return browser.element('#eFormXml');
  }
  public get createEformBtn() {
    return browser.element('#createEformBtn');
  }
  public get createEformTagSelector() {
    return browser.element('#createEFormMultiSelector');
  }
  public get createEformNewTagInput() {
    return browser.element('#addTagInput');
  }
  public trashInspectionDropDown() {
    browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).click();
  }
  public get trashInspectionDropdownName() {
    return browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Affaldsinspektion')]`).element('..');
  }
  public get trashInspectionDropdownItemName() {
    return browser.element(`//*[contains(text(), 'Fraktioner')]`);
  }
  public get fractionBtn() {
    return browser.element(`//*[contains(text(), 'Fraktioner')]`);
  }
  public  fractionCreateBtn() {
    browser.element('#fractionCreateBtn').click();
  }
  public getBtnTxt(text: string) {
    return browser.element(`//*[contains(@class, 'p-3')]//*[text()="${text}"]`);
  }
  public get fractionCreateNameBox() {
    return browser.element('#createFractionName');
  }
  public get fractionCreateDescriptionBox() {
    return browser.element('#createFractionDescription');
  }
  public get fractionCreateSelectorBox() {
    return browser.element(`//*[contains(@id, 'createFractionSelector')]//input`);
  }
  public get fractionCreateOption() {
    return browser.element(`//*[contains(@class, 'ng-option-label')]`);
  }
  public get createSaveBtn() {
    return browser.element('#fractionCreateSaveBtn');
  }
  public get fractionEditBtn() {
    return browser.element('#updateFractionBtn');
  }
  public get fractionUpdateNameBox() {
    return browser.element('#updateFractionName');
  }
  public get fractionUpdateDescriptionBox() {
    return browser.element('#editFractionDescription');
  }
  public get fractionUpdateSelecterBox() {
    return browser.element('#fractionUpdateSelector');
  }
  public get fractionUpdateSaveBtn() {
    return browser.element('#fractionUpdateSaveBtn');
  }
  public get fractionUpdateCancelBtn() {
    return browser.element('#fractionUpdateCancelBtn');
  }
  public get fractionDeleteBtn() {
    return browser.element('#deleteFractionBtn');
  }
  public get fractionDeleteId() {
    return browser.element('#selectedFractionId');
  }
  public get fractionDeleteName() {
    return browser.element('#selectedFractionName');
  }
  public get fractionDeleteDeleteBtn() {
    return browser.element('#fractionDeleteDeleteBtn');
  }
  public get fractionDelteCancelBtn() {
    return browser.element('#fractionDeleteCancelBtn');
  }
  goToFractionsPage() {
    this.trashInspectionDropDown();
    browser.pause(1000);
    this.fractionBtn.click();
    browser.pause(8000);
  }
  createFraction(name: string, description: string) {
    this.fractionCreateBtn();
    browser.pause(8000);
    this.fractionCreateNameBox.addValue(name);
    this.fractionCreateDescriptionBox.addValue(description);
    browser.pause(3000);
    this.fractionCreateSelectorBox.addValue('Number');
    browser.pause(3000);
    this.fractionCreateOption.click();
    browser.pause(1000);
    this.createSaveBtn.click();
    browser.pause(6000);
    browser.refresh();
    browser.pause(14000);
  }
  editFraction(newName: string, newDescription: string) {
    this.fractionEditBtn.click();
    browser.pause(8000);
    this.fractionUpdateNameBox.clearElement();
    this.fractionUpdateNameBox.addValue(newName);
    this.fractionUpdateDescriptionBox.clearElement();
    this.fractionUpdateDescriptionBox.addValue(newDescription);
    this.fractionUpdateSaveBtn.click();
    browser.pause(8000);
  }
  cancelEditFraction(newName: string, newDescription: string){
    this.fractionEditBtn.click();
    browser.pause(8000);
    this.fractionUpdateNameBox.clearElement();
    this.fractionUpdateNameBox.addValue(newName);
    this.fractionUpdateDescriptionBox.clearElement();
    this.fractionUpdateDescriptionBox.addValue(newDescription);
    this.fractionUpdateCancelBtn.click();
    browser.pause(8000);
  }
  deleteFraction() {
  const fractionForDelete = this.getFirstRowObject();
  fractionForDelete.deleteBtn.click();
  browser.pause(4000);
  this.fractionDeleteDeleteBtn.click();
  browser.pause(8000);
  browser.refresh();
  }
  getFirstRowObject(): FractionsRowObject {
    return new FractionsRowObject(1);
  }
  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    this.newEformBtn.click();
    browser.pause(5000);
    // Create replaced xml and insert it in textarea
    const xml = XMLForEformFractions.XML.replace('TEST_LABEL', eFormLabel);
    browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    this.xmlTextArea.addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      this.createEformNewTagInput.setValue(newTagsList.join(','));
      browser.pause(5000);
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      browser.pause(5000);
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        browser.pause(5000);
      }
    }
    this.createEformBtn.click();
    browser.pause(14000);
    return {added: addedTags, selected: selectedTags};
  }
}

const fractionsPage = new TrashInspectionFractionPage();
export default fractionsPage;

export class FractionsRowObject {
  constructor(rowNum) {
     if ($$('#fractionId')[rowNum - 1]) {
       this.id = +$$('#fractionId')[rowNum - 1];
       try {
         this.name = $$('#fractionName')[rowNum - 1].getText();
       } catch (e) {}
       try {
        this.description = $$('#fractionDescription')[rowNum - 1].getText();
       } catch (e) {}
       try {
        this.eForm = $$('#fractionSelectedeForm')[rowNum - 1].getText();
       } catch (e) {}
      this.editBtn = $$('#updateFractionBtn')[rowNum - 1];
      this.deleteBtn = $$('#deleteFractionBtn')[rowNum - 1];
     }
  }
  id;
  name;
  description;
  eForm;
  editBtn;
  deleteBtn;
}
