import Page from '../Page';
import XMLForEformRentableItems from '../../Constants/XMLForEform';
import {trackByHourSegment} from 'angular-calendar/modules/common/util';

export class RentableItemRentableItemPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    browser.pause(500);
    return $$('#tableBody > tr').length;
  }
  public get newEformBtn() {
    $('#newEFormBtn').waitForDisplayed({timeout: 20000});
    $('#newEFormBtn').waitForClickable({timeout: 20000});
    return $('#newEFormBtn');
  }
  public get xmlTextArea() {
    $('#eFormXml').waitForDisplayed({timeout: 20000});
    $('#eFormXml').waitForClickable({timeout: 20000});
    return $('#eFormXml');
  }
  public get createEformBtn() {
    $('#createEformBtn').waitForDisplayed({timeout: 20000});
    $('#createEformBtn').waitForClickable({timeout: 20000});
    return $('#createEformBtn');
  }
  public get createEformTagSelector() {
    $('#createEFormMultiSelector').waitForDisplayed({timeout: 20000});
    $('#createEFormMultiSelector').waitForClickable({timeout: 20000});
    return $('#createEFormMultiSelector');
  }
  public get createEformNewTagInput() {
    $('#addTagInput').waitForDisplayed({timeout: 20000});
    $('#addTagInput').waitForClickable({timeout: 20000});
    return $('#addTagInput');
  }
  public get rentableItemDropdownName() {
    const ele = $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Udlejning')]`).$('..');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public rentableItemDropdown() {
    const ele = $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Udlejning')]`);
    ele.waitForDisplayed({timeout: 20000});
    //ele.waitForClickable({timeout: 20000});
    ele.click();
  }
  public rentableItemDropdownItemName(name) {
    const ele = $(`//*[contains(@class, 'dropdown')]//div//*[contains(text(), "${name}")]`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public get rentableItemCreateBtn() {
    $('#rentableItemCreateBtn').waitForDisplayed({timeout: 20000});
    $('#rentableItemCreateBtn').waitForClickable({timeout: 20000});
    return $('#rentableItemCreateBtn');
  }
  public getBtnTxt(text: string) {
    return $(`//*[contains(@class, 'p-3')]//*[text()="${text}"]`);
  }
  public get rentableItemCreateBrandBox() {
    $('#createBrand').waitForDisplayed({timeout: 20000});
    $('#createBrand').waitForClickable({timeout: 20000});
    return $('#createBrand');
  }
  public get rentableItemCreateModelBox() {
    $('#createRentableItemModel').waitForDisplayed({timeout: 20000});
    $('#createRentableItemModel').waitForClickable({timeout: 20000});
    return $('#createRentableItemModel');
  }
  public rentableItemCreateReistrationDate() {
    return $(`//*[contains(@class, 'form')]//*[contains(text(), 'Registration date')]`);
  }
  public get rentableItemCreateVinNumberBox() {
    $('#createVINNumber').waitForDisplayed({timeout: 20000});
    //$('#createVINNumber').waitForClickable({timeout: 20000});
    return $('#createVINNumber');
  }
  public get rentableItemCreateSerialNumberBox() {
    $('#createSerialNumber').waitForDisplayed({timeout: 20000});
    //$('#createSerialNumber').waitForClickable({timeout: 20000});
    return $('#createSerialNumber');
  }
  public get rentableItemCreatePlateNumberBox() {
    $('#createPlateNumber').waitForDisplayed({timeout: 20000});
    //$('#createPlateNumber').waitForClickable({timeout: 20000});
    return $('#createPlateNumber');
  }
  public get eFormSelector() {
    return $(`//*[@id= 'eFormId']//input`);
  }
  public get rentableItemCreateSaveBtn() {
    $('#rentableItemCreateSaveBtn').waitForDisplayed({timeout: 20000});
    $('#rentableItemCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#rentableItemCreateSaveBtn');
  }
  public get rentableItemEditBrandBox() {
    $('#editBrand').waitForDisplayed({timeout: 20000});
    $('#editBrand').waitForClickable({timeout: 20000});
    return $('#editBrand');
  }
  public get rentableItemEditModelBox() {
    $('#editRentableItemModel').waitForDisplayed({timeout: 20000});
    $('#editRentableItemModel').waitForClickable({timeout: 20000});
    return $('#editRentableItemModel');
  }
  public rentableItemEditReistrationDate() {
    // return $(`//*[contains(@class, 'form')]//*[contains(text(), 'Registration date')]`);
    $('#editRegistrationDate').waitForDisplayed({timeout: 20000});
    $('#editRegistrationDate').waitForClickable({timeout: 20000});
    return $('#editRegistrationDate');
  }
  public get rentableItemEditVinNumberBox() {
    $('#editVINNumber').waitForDisplayed({timeout: 20000});
    $('#editVINNumber').waitForClickable({timeout: 20000});
    return $('#editVINNumber');
  }
  public get rentableItemEditSerialNumberBox() {
    $('#editSerialNumber').waitForDisplayed({timeout: 20000});
    $('#editSerialNumber').waitForClickable({timeout: 20000});
    return $('#editSerialNumber');
  }
  public get rentableItemEditPlateNumberBox() {
    $('#editPlateNumber').waitForDisplayed({timeout: 20000});
    $('#editPlateNumber').waitForClickable({timeout: 20000});
    return $('#editPlateNumber');
  }
  public clickDate(date) {
    const ele = $(`//span[text()=" ${date} "]/..`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    ele.click();
  }
  public selectOption(name) {
    const ele = $(`//*[text()="${name}"]/..`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    ele.click();
  }
  public get rentableItemDeleteBtn() {
    $('#rentableItemDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
    $('#rentableItemDeleteDeleteBtn').waitForClickable({timeout: 20000});
    return $('#rentableItemDeleteDeleteBtn');
  }
  public get rentableItemEditSaveBtn() {
    $('#rentableItemEditSaveBtn').waitForDisplayed({timeout: 20000});
    $('#rentableItemEditSaveBtn').waitForClickable({timeout: 20000});
    return $('#rentableItemEditSaveBtn');
  }
  goToRentableItemsPage() {
    this.rentableItemDropdown();
    //$('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemDropdownItemName('Udlejning').click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  createRentableItem(brand: string, model: string, date: number, eFormName: string, serialNumber?: string,
                     VINNumber?: string, plateNumber?: string) {
    this.rentableItemCreateBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemCreateBrandBox.addValue(brand);
    //browser.pause(500);
    this.rentableItemCreateModelBox.addValue(model);
    //browser.pause(500);
    this.eFormSelector.addValue(eFormName);
    this.selectOption(eFormName);
    //browser.pause(500);
    //console.log(serialNumber);
    this.rentableItemCreateSerialNumberBox.addValue(serialNumber);
    //browser.pause(500);
    this.rentableItemCreateVinNumberBox.addValue(VINNumber);
    //browser.pause(500);
    this.rentableItemCreatePlateNumberBox.addValue(plateNumber);
    //browser.pause(500);
    this.rentableItemCreateReistrationDate().click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    browser.pause(500);
    this.clickDate(date);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemCreateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  deleteRentableItem() {
    const rentableItemForDelete = this.getFirstRowObject();
    rentableItemForDelete.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  editRentableItem(newBrand: string, newModel: string, newSerial: string, newVin: string, newPlate: string, newDate: number) {
    const rentableItemForEdit = this.getFirstRowObject();
    rentableItemForEdit.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditBrandBox.clearValue();
    this.rentableItemEditBrandBox.addValue(newBrand);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditModelBox.clearValue();
    this.rentableItemEditModelBox.addValue(newModel);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditSerialNumberBox.clearValue();
    this.rentableItemEditSerialNumberBox.addValue(newSerial);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditVinNumberBox.clearValue();
    this.rentableItemEditVinNumberBox.addValue(newVin);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditPlateNumberBox.clearValue();
    this.rentableItemEditPlateNumberBox.addValue(newPlate);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditReistrationDate().click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.clickDate(newDate);
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.rentableItemEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  cleanup() {
    const rentableItem = this.getFirstRowObject();
    if (rentableItem.deleteBtn.waitForDisplayed({timeout: 20000})) {
      rentableItem.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.rentableItemDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }
  getFirstRowObject(): RentableItemsRowObject {
    browser.pause(500);
    return new RentableItemsRowObject(1);
  }
  createNewEform(eFormLabel, newTagsList = [], tagAddedNum = 0) {
    this.newEformBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    // Create replaced xml and insert it in textarea
    const xml = XMLForEformRentableItems.XML.replace('TEST_LABEL', eFormLabel);
    browser.execute(function (xmlText) {
      (<HTMLInputElement>document.getElementById('eFormXml')).value = xmlText;
    }, xml);
    this.xmlTextArea.addValue(' ');
    // Create new tags
    const addedTags: string[] = newTagsList;
    if (newTagsList.length > 0) {
      this.createEformNewTagInput.setValue(newTagsList.join(','));
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
    // Add existing tags
    const selectedTags: string[] = [];
    if (tagAddedNum > 0) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      for (let i = 0; i < tagAddedNum; i++) {
        this.createEformTagSelector.click();
        const selectedTag = $('.ng-option:not(.ng-option-selected)');
        selectedTags.push(selectedTag.getText());
        console.log('selectedTags is ' + JSON.stringify(selectedTags));
        selectedTag.click();
        $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      }
    }
    this.createEformBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    return {added: addedTags, selected: selectedTags};
  }
}


const rentableItemsPage = new RentableItemRentableItemPage();
export default rentableItemsPage;

export class RentableItemsRowObject {
  constructor(rowNum) {
    if ($$('#rentableItemId')[rowNum - 1]) {
      this.id = +$$('#rentableItemId')[rowNum - 1];
      try {
        this.brand = $$('#rentableItemBrand')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.model = $$('#rentableItemModel')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.serialNumber = $$('#rentableItemSerialNumber')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.vinNumber = $$('#rentableItemVINNumber')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.plateNumber = $$('#rentableItemPlateNumber')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.registrationDate = $$('#rentableItemRegistrationDate')[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#rentableItemDeleteBtn')[rowNum - 1];
      } catch (e) {}
      try {
        this.editBtn = $$('#rentableItemEditBtn')[rowNum - 1];
      } catch (e) {}
    }
  }
  id;
  model;
  brand;
  serialNumber;
  vinNumber;
  plateNumber;
  registrationDate;
  deleteBtn;
  editBtn;
}
