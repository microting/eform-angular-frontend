import Page from '../Page';
import customersPage from './Customers.page';

export class CustomersModalPage extends Page {
  constructor() {
    super();
  }

  public get createBtn() {
    $('#createCustomerBtn').waitForDisplayed({timeout: 20000});
    $('#createCustomerBtn').waitForClickable({timeout: 20000});
    return $('#createCustomerBtn');
  }

  public get cancelCreateBtn() {
    $('#cancelCreateCustomerBtn').waitForDisplayed({timeout: 20000});
    $('#cancelCreateCustomerBtn').waitForClickable({timeout: 20000});
    return $('#cancelCreateCustomerBtn');
  }
  public get saveEditBtn() {
    $('#saveEditBtn').waitForDisplayed({timeout: 20000});
    $('#saveEditBtn').waitForClickable({timeout: 20000});
    return $('#saveEditBtn');
  }
  public get cancelEditBtn() {
    $('#cancelEditBtn').waitForDisplayed({timeout: 20000});
    $('#cancelEditBtn').waitForClickable({timeout: 20000});
    return $('#cancelEditBtn');
  }
  public get saveDeleteBtn() {
    $('#customerSaveDeleteBtn').waitForDisplayed({timeout: 20000});
    $('#customerSaveDeleteBtn').waitForClickable({timeout: 20000});
    return $('#customerSaveDeleteBtn');
  }
  public get cancelDeleteBtn() {
    $('#customerDeleteCancelBtn').waitForDisplayed({timeout: 20000});
    $('#customerDeleteCancelBtn').waitForClickable({timeout: 20000});
    return $('#customerDeleteCancelBtn');
  }
  public get createCreatedByInput() {
    $('#createCreatedBy').waitForDisplayed({timeout: 20000});
    $('#createCreatedBy').waitForClickable({timeout: 20000});
    return $('#createCreatedBy');
  }
  public get editCreatedByInput() {
    $('#editCreatedBy').waitForDisplayed({timeout: 20000});
    $('#editCreatedBy').waitForClickable({timeout: 20000});
    return $('#editCreatedBy');
  }
  public get createCustomerNo() {
    $('#createCustomerNo').waitForDisplayed({timeout: 20000});
    $('#createCustomerNo').waitForClickable({timeout: 20000});
    return $('#createCustomerNo');
  }
  public get editCustomerNo() {
    $('#editCustomerNo').waitForDisplayed({timeout: 20000});
    $('#editCustomerNo').waitForClickable({timeout: 20000});
    return $('#editCustomerNo');
  }
  public get createContactPerson() {
    $('#createContactPerson').waitForDisplayed({timeout: 20000});
    $('#createContactPerson').waitForClickable({timeout: 20000});
    return $('#createContactPerson');
  }
  public get editContactPerson() {
    $('#editContactPerson').waitForDisplayed({timeout: 20000});
    $('#editContactPerson').waitForClickable({timeout: 20000});
    return $('#editContactPerson');
  }
  public get createCompanyName() {
    $('#createCompanyName').waitForDisplayed({timeout: 20000});
    $('#createCompanyName').waitForClickable({timeout: 20000});
    return $('#createCompanyName');
  }
  public get editCompanyName() {
    $('#editCompanyName').waitForDisplayed({timeout: 20000});
    $('#editCompanyName').waitForClickable({timeout: 20000});
    return $('#editCompanyName');
  }
  public get createCompanyAddress() {
    $('#createCompanyAddress').waitForDisplayed({timeout: 20000});
    //$('#createCompanyAddress').waitForClickable({timeout: 20000});
    return $('#createCompanyAddress');
  }
  public get editCompanyAddress() {
    $('#editCompanyAddress').waitForDisplayed({timeout: 20000});
    $('#editCompanyAddress').waitForClickable({timeout: 20000});
    return $('#editCompanyAddress');
  }
  public get createCompanyAddress2() {
    $('#createCompanyAddress2').waitForDisplayed({timeout: 20000});
    $('#createCompanyAddress2').waitForClickable({timeout: 20000});
    return $('#createCompanyAddress2');
  }
  public get editCompanyAddress2() {
    $('#editCompanyAddress2').waitForDisplayed({timeout: 20000});
    $('#editCompanyAddress2').waitForClickable({timeout: 20000});
    return $('#editCompanyAddress2');
  }
  public get createZipCode() {
    $('#createZipCode').waitForDisplayed({timeout: 20000});
    $('#createZipCode').waitForClickable({timeout: 20000});
    return $('#createZipCode');
  }
  public get editZipCode() {
    $('#editZipCode').waitForDisplayed({timeout: 20000});
    $('#editZipCode').waitForClickable({timeout: 20000});
    return $('#editZipCode');
  }
  public get createCityName() {
    $('#createCityName').waitForDisplayed({timeout: 20000});
    $('#createCityName').waitForClickable({timeout: 20000});
    return $('#createCityName');
  }
  public get editCityName() {
    $('#editCityName').waitForDisplayed({timeout: 20000});
    $('#editCityName').waitForClickable({timeout: 20000});
    return $('#editCityName');
  }
  public get createPhone() {
    $('#createPhone').waitForDisplayed({timeout: 20000});
    $('#createPhone').waitForClickable({timeout: 20000});
    return $('#createPhone');
  }
  public get editPhone() {
    $('#editPhone').waitForDisplayed({timeout: 20000});
    $('#editPhone').waitForClickable({timeout: 20000});
    return $('#editPhone');
  }
  public get createEmail() {
    $('#createEmail').waitForDisplayed({timeout: 20000});
    $('#createEmail').waitForClickable({timeout: 20000});
    return $('#createEmail');
  }
  public get editEmail() {
    $('#editEmail').waitForDisplayed({timeout: 20000});
    $('#editEmail').waitForClickable({timeout: 20000});
    return $('#editEmail');
  }
  public get createEanCode() {
    $('#createEanCode').waitForDisplayed({timeout: 20000});
    $('#createEanCode').waitForClickable({timeout: 20000});
    return $('#createEanCode');
  }
  public get editEanCode() {
    $('#editEanCode').waitForDisplayed({timeout: 20000});
    $('#editEanCode').waitForClickable({timeout: 20000});
    return $('#editEanCode');
  }
  public get createVatNumber() {
    $('#createVatNumber').waitForDisplayed({timeout: 20000});
    $('#createVatNumber').waitForClickable({timeout: 20000});
    return $('#createVatNumber');
  }
  public get editVatNumber() {
    $('#editVatNumber').waitForDisplayed({timeout: 20000});
    $('#editVatNumber').waitForClickable({timeout: 20000});
    return $('#editVatNumber');
  }
  public get createCountryCode() {
    $('#createCountryCode').waitForDisplayed({timeout: 20000});
    $('#createCountryCode').waitForClickable({timeout: 20000});
    return $('#createCountryCode');
  }
  public get editCountryCode() {
    $('#editCountryCode').waitForDisplayed({timeout: 20000});
    $('#editCountryCode').waitForClickable({timeout: 20000});
    return $('#editCountryCode');
  }
  public get createCrmId() {
    $('#createCrmId').waitForDisplayed({timeout: 20000});
    $('#createCrmId').waitForClickable({timeout: 20000});
    return $('#createCrmId');
  }
  public get editCrmId() {
    $('#editCrmId').waitForDisplayed({timeout: 20000});
    $('#editCrmId').waitForClickable({timeout: 20000});
    return $('#editCrmId');
  }
  public get createCadastralNumber() {
    $('#createCadastralNumber').waitForDisplayed({timeout: 20000});
    //$('#createCadastralNumber').waitForClickable({timeout: 20000});
    return $('#createCadastralNumber');
  }
  public get editCadastralNumber() {
    $('#editCadastralNumber').waitForDisplayed({timeout: 20000});
    //$('#editCadastralNumber').waitForClickable({timeout: 20000});
    return $('#editCadastralNumber');
  }
  public get createPropertyNumber() {
    $('#createPropertyNumber').waitForDisplayed({timeout: 20000});
    $('#createPropertyNumber').waitForClickable({timeout: 20000});
    return $('#createPropertyNumber');
  }
  public get editPropertyNumber() {
    $('#editPropertyNumber').waitForDisplayed({timeout: 20000});
    $('#editPropertyNumber').waitForClickable({timeout: 20000});
    return $('#editPropertyNumber');
  }
  public get createApartmentNumber() {
    $('#createApartmentNumber').waitForDisplayed({timeout: 20000});
    //$('#createApartmentNumber').waitForClickable({timeout: 20000});
    return $('#createApartmentNumber');
  }
  public get editApartmentNumber() {
    $('#editApartmentNumber').waitForDisplayed({timeout: 20000});
    $('#editApartmentNumber').waitForClickable({timeout: 20000});
    return $('#editApartmentNumber');
  }
  public get createCompletionYear() {
    $('#createCompletionYear').waitForDisplayed({timeout: 20000});
    $('#createCompletionYear').waitForClickable({timeout: 20000});
    return $('#createCompletionYear');
  }
  public get editCompletionYear() {
    $('#editCompletionYear').waitForDisplayed({timeout: 20000});
    $('#editCompletionYear').waitForClickable({timeout: 20000});
    return $('#editCompletionYear');
  }
  public get createFloorsWithLivingSpace() {
    $('#createFloorsWithLivingSpace').waitForDisplayed({timeout: 20000});
    //$('#createFloorsWithLivingSpace').waitForClickable({timeout: 20000});
    return $('#createFloorsWithLivingSpace');
  }
  public get editFloorsWithLivingSpace() {
    $('#editFloorsWithLivingSpace').waitForDisplayed({timeout: 20000});
    $('#editFloorsWithLivingSpace').waitForClickable({timeout: 20000});
    return $('#editFloorsWithLivingSpace');
  }

  public createCustomer(data: any) {
    this.createCreatedByInput.setValue(data.createdBy);
    this.createCustomerNo.setValue(data.customerNo);
    this.createContactPerson.setValue(data.contactPerson);
    this.createCompanyName.setValue(data.companyName);
    this.createCompanyAddress.setValue(data.companyAddress);
    this.createZipCode.setValue(data.zipCode);
    this.createCityName.setValue(data.cityName);
    this.createPhone.setValue(data.phone);
    this.createEmail.setValue(data.email);
    this.createEanCode.setValue(data.eanCode);
    this.createVatNumber.setValue(data.vatNumber);
    this.createCountryCode.setValue(data.countryCode);
    this.createCadastralNumber.setValue(data.cadastralNumber);
    this.createPropertyNumber.setValue(data.propertyNumber);
    this.createApartmentNumber.setValue(data.apartmentNumber);
    this.createCompletionYear.setValue(data.completionYear);
    this.createFloorsWithLivingSpace.setValue(data.floorsWithLivingSpace);
    this.createBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public updateCustomer(data: any) {
    this.editCreatedByInput.setValue(data.createdBy);
    this.editCustomerNo.setValue(data.customerNo);
    this.editContactPerson.setValue(data.contactPerson);
    this.editCompanyName.setValue(data.companyName);
    this.editCompanyAddress.setValue(data.companyAddress);
    this.editZipCode.setValue(data.zipCode);
    this.editCityName.setValue(data.cityName);
    this.editPhone.setValue(data.phone);
    this.editEmail.setValue(data.email);
    this.editEanCode.setValue(data.eanCode);
    this.editVatNumber.setValue(data.vatNumber);
    this.editCountryCode.setValue(data.countryCode);
    this.editCadastralNumber.setValue(data.cadastralNumber);
    this.editPropertyNumber.setValue(data.propertyNumber);
    this.editApartmentNumber.setValue(data.apartmentNumber);
    this.editCompletionYear.setValue(data.completionYear);
    this.editFloorsWithLivingSpace.setValue(data.floorsWithLivingSpace);
    this.saveEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public createEmptyCustomer() {
    this.createBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public deleteCustomer() {
    this.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }

  public cleanup() {
    const deleteObject = customersPage.getCustomer(customersPage.rowNum());
    if (deleteObject != null) {
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      deleteObject.deleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
      this.saveDeleteBtn.click();
      $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    }
  }

}

const customersModalPage = new CustomersModalPage();
export default customersModalPage;
