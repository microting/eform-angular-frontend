import Page from '../Page';
import XMLForEformRentableItems from '../../Constants/XMLForEform';
import {trackByHourSegment} from 'angular-calendar/modules/common/util';
import {timeout} from 'rxjs/operators';

export class RentableItemContractPage extends Page {
  constructor() {
    super();
  }
  public get rowNum(): number {
    browser.pause(500);
    return $$(`//*[@id= 'tableBody']//tr`).length;
  }
  public get rentableItemListonContract(): number {
    return $$(`//*[@id= 'tableBody']//tr//*[@id= 'rentableItemId']`).length;
  }
  public rentableItemDropdownItemName(name) {
    const ele = $(`//*[contains(@class, 'dropdown')]//div//*[contains(text(), "${name}")]`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }
  public rentableItemDropdown() {
    const ele = $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Udlejning')]`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    ele.click();
  }
  public get newContractBtn() {
    $('#contractCreateBtn').waitForDisplayed({timeout: 20000});
    $('#contractCreateBtn').waitForClickable({timeout: 20000});
    return $('#contractCreateBtn');
  }
  public get startDateSelector() {
    $('#startDate').waitForDisplayed({timeout: 20000});
    $('#startDate').waitForClickable({timeout: 20000});
    return $('#startDate');
  }
  public get editStartDateSelector() {
    $('#editStartDate').waitForDisplayed({timeout: 20000});
    $('#editStartDate').waitForClickable({timeout: 20000});
    return $('#editStartDate');
  }
  public get endDateSelector() {
    $('#endDate').waitForDisplayed({timeout: 20000});
    $('#endDate').waitForClickable({timeout: 20000});
    return $('#endDate');
  }
  public get editEndDateSelector() {
    $('#editEndDate').waitForDisplayed({timeout: 20000});
    $('#editEndDate').waitForClickable({timeout: 20000});
    return $('#editEndDate');
  }
  public get contractNumberField() {
    $('#contractNumber').waitForDisplayed({timeout: 20000});
    //$('#contractNumber').waitForClickable({timeout: 20000});
    return $('#contractNumber');
  }
  public get editContractNumberField() {
    $('#editContractNr').waitForDisplayed({timeout: 20000});
    //$('#editContractNr').waitForClickable({timeout: 20000});
    return $('#editContractNr');
  }
  public get customerSelector() {
    return $(`//*[@id= 'customerSelector']//input`);
  }
  public get editCustomerSelector() {
    return $(`//*[@id= 'editCustomerIdSelector']//input`);
  }
  public get rentableItemSelector() {
    return $(`//*[@id= 'rentableItemSelector']//input`);
  }
  public get editRentableItemSelector() {
    return $(`//*[@id= 'editRentableItemSelector']//input`);
  }
  public get contractCreateSaveBtn() {
    $('#contractCreateSaveBtn').waitForDisplayed({timeout: 20000});
    $('#contractCreateSaveBtn').waitForClickable({timeout: 20000});
    return $('#contractCreateSaveBtn');
  }
  public get contractCreateCancelBtn() {
    $('#contractCreateDeleteBtn').waitForDisplayed({timeout: 20000});
    $('#contractCreateDeleteBtn').waitForClickable({timeout: 20000});
    return $('#contractCreateDeleteBtn');
  }
  public get contractEditSaveBtn() {
    $('#contractEditSaveBtn').waitForDisplayed({timeout: 20000});
    $('#contractEditSaveBtn').waitForClickable({timeout: 20000});
    return $('#contractEditSaveBtn');
  }
  public get contractEditCancelBtn() {
    $('#contractEditCancelBtn').waitForDisplayed({timeout: 20000});
    $('#contractEditCancelBtn').waitForClickable({timeout: 20000});
    return $('#contractEditCancelBtn');
  }
  public get selectedContractId() {
    $('#selectedContractId').waitForDisplayed({timeout: 20000});
    $('#selectedContractId').waitForClickable({timeout: 20000});
    return $('#selectedContractId');
  }
  public get selectedContractNumber() {
    $('#selectedContractNr').waitForDisplayed({timeout: 20000});
    $('#selectedContractNr').waitForClickable({timeout: 20000});
    return $('#selectedContractNr');
  }
  public get selectedContractCustomerId() {
    $('#selectedContractCustomerId').waitForDisplayed({timeout: 20000});
    $('#selectedContractCustomerId').waitForClickable({timeout: 20000});
    return $('#selectedContractCustomerId');
  }
  public get contractDeleteDeleteBtn() {
    $('#contractDeleteDeleteBtn').waitForDisplayed({timeout: 20000});
    $('#contractDeleteDeleteBtn').waitForClickable({timeout: 20000});
    return $('#contractDeleteDeleteBtn');
  }
  public get contractDeleteCancelBtn() {
    $('#contractDeleteCancelBtn').waitForDisplayed({timeout: 20000});
    $('#contractDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#contractDeleteCancelBtn');
  }
  public clickDate(date) {
    const ele = $(`//*[text()=" ${date} "]/..`);
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    ele.click();
  }
  public selectOption(name) {
    browser.pause(500);
    const ele = $(`//span[text()="${name}"]/..`);
    ele.waitForDisplayed({timeout: 20000});
    ele.click();
  }
  public createContract(startDate: number, endDate: number, contractNumber: number, customer: string, rentableItem: string,
                        customerFullName: string, rentableItemFullName: string) {
    this.newContractBtn.click();
    $('#startDate').waitForDisplayed({timeout: 20000});
    this.startDateSelector.click();
    browser.pause(500);
    this.clickDate(startDate);
    this.endDateSelector.click();
    browser.pause(500);
    this.clickDate(endDate);
    this.contractNumberField.addValue(contractNumber);
    this.customerSelector.addValue(customer);
    this.selectOption(customerFullName);
    this.rentableItemSelector.addValue(rentableItem);
    this.selectOption(rentableItemFullName);
    this.contractCreateSaveBtn.click();
  }
  public createContractCancel(startDate: number, endDate: number, contractNumber: number, customer: string, rentableItem: string,
                              customerFullName: string, rentableItemFullName: string) {
    this.newContractBtn.click();
    $('#startDate').waitForDisplayed({timeout: 20000});
    this.startDateSelector.click();
    browser.pause(500);
    this.clickDate(startDate);
    this.endDateSelector.click();
    browser.pause(500);
    this.clickDate(endDate);
    this.contractNumberField.addValue(contractNumber);
    this.customerSelector.addValue(customer);
    this.selectOption(customerFullName);
    this.rentableItemSelector.addValue(rentableItem);
    this.selectOption(rentableItemFullName);
    this.contractCreateCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public editContract(startDate: number, endDate: number, contractNumber: number, newCustomer: string, newItem: string,
                      customerFullName: string, rentableItemFullName: string) {
    const contractForEdit = this.getFirstContractObject();
    contractForEdit.editBtn.click();
    $('#editStartDate').waitForDisplayed({timeout: 20000});
    this.editStartDateSelector.click();
    browser.pause(500);
    this.clickDate(startDate);
    this.editEndDateSelector.click();
    browser.pause(500);
    this.clickDate(endDate);
    this.editContractNumberField.clearValue();
    this.editContractNumberField.addValue(contractNumber);
    this.editCustomerSelector.addValue(newCustomer);
    this.selectOption(customerFullName);
    this.editRentableItemSelector.addValue(newItem);
    this.selectOption(rentableItemFullName);
    this.contractEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editContractCancel(startDate: number, endDate: number, contractNumber: number, newCustomer: string, newItem: string,
                            customerFullName: string, rentableItemFullName: string) {
    const contractForEdit = this.getFirstContractObject();
    contractForEdit.editBtn.click();
    $('#editStartDate').waitForDisplayed({timeout: 20000});
    this.editStartDateSelector.click();
    browser.pause(500);
    this.clickDate(startDate);
    this.editEndDateSelector.click();
    browser.pause(500);
    this.clickDate(endDate);
    this.editContractNumberField.clearValue();
    this.editContractNumberField.addValue(contractNumber);
    this.editCustomerSelector.addValue(newCustomer);
    this.selectOption(customerFullName);
    this.editRentableItemSelector.addValue(newItem);
    this.selectOption(rentableItemFullName);
    this.contractEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public editContractDeleteRentableItem() {
    const contractForEdit = this.getFirstContractObject();
    contractForEdit.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const rentableItemToDelete = this.getFirstRentableItemObject();
    rentableItemToDelete.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    this.contractEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public deleteContract() {
    const deleteObject = this.getFirstContractObject();
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.contractDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }
  public deleteContractCancel() {
    const deleteObject = this.getFirstContractObject();
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.contractDeleteCancelBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }

  public getFirstRentableItemObject(): RentableItemRowObject {
    browser.pause(500);
    return new RentableItemRowObject(1);
  }

  public getFirstContractObject(): ContractsRowObject {
    browser.pause(500);
    return new ContractsRowObject(1);
  }

  public cleanup() {
    const deleteObject = this.getFirstContractObject();
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.contractDeleteDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }
}

const contractsPage = new RentableItemContractPage();
export default contractsPage;

export class ContractsRowObject {
  constructor(rowNum) {
    if ($$('#contractId')[rowNum - 1]) {
      this.id = +$$('#contractId')[rowNum - 1];
      try {
        this.startDate = +$$('#contractStartDate')[rowNum - 1];
      } catch (e) {}
      try {
        this.endDate = +$$('#contractEndData')[rowNum - 1];
      } catch (e) {}
      try {
        this.contractCustomer = +$$('#contractCustomer')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.contractNumber = +$$('#contractNumber')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.editBtn = $$('#contractEditBtn')[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#contractDeleteBtn')[rowNum - 1];
      } catch (e) {}
      try {
        this.inspectionBtn = $$('#createInspectionBtn')[rowNum - 1];
      } catch (e) {}
    }
  }

  id;
  startDate;
  endDate;
  contractCustomer;
  contractNumber;
  inspectionBtn;
  deleteBtn;
  editBtn;
}

export class RentableItemRowObject {
  constructor(rowNum) {
    if ($$('#rentableItemId')[rowNum - 1]) {
      try {
        this.modelName = $$('#rentableItemModelName')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.brand = $$('#rentableItemBrand')[rowNum - 1].getText();
      } catch (e) {}
      try {
        this.serialNumber = +$$('#rentableItemSerialNumber')[rowNum - 1];
      } catch (e) {}
      try {
        this.deleteBtn = $$('#removeRentableItemBtn')[rowNum - 1];
      } catch (e) {}
    }
  }
  id;
  modelName;
  brand;
  serialNumber;
  deleteBtn;
}
