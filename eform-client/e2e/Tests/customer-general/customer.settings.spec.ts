import loginPage from '../../Page objects/Login.page';
import customersPage, {CustomersRowObject} from '../../Page objects/Customers/Customers.page';
import customersSettingsPage from '../../Page objects/Customers/CustomersSettings.page';
import myEformsPage from '../../Page objects/MyEforms.page';

const expect = require('chai').expect;

describe('Customers plugin settings page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    customersPage.goToCustomersPage();
  });
  it('should create searchable list', function () {
    // go to navbar > advanced >serchable list
    myEformsPage.Navbar.advancedDropdown();
    myEformsPage.Navbar.clickonSubMenuItem('Searchable List');
    browser.pause(8000);
    // user see Searchable lists page and new list button (#createEntitySearchBtn) within it
    const newSearchListBtn = $('#createEntitySearchBtn');
    // click new list button
    const numberOfListsBefore = browser.$$('tr > .ng-star-inserted');
    newSearchListBtn.click();
    // enter name of the list and click button
    const listName = 'My testing list';
    const fieldElement = $('#createName');
    fieldElement.addValue(listName);
    const confirmBtn = $('#entitySearchCreateSaveBtn');
    confirmBtn.click();
    browser.pause(8000);
    const numberOfListsAfter = browser.$$('tr > .ng-star-inserted');
    // new list should appear on the page. check by name? <td>name-of-list</td
    const result = numberOfListsBefore < numberOfListsAfter;
    expect(result, 'Where\'s new searchable list?').true;
  });
  it('should configure customers pn to use searchable list', function () {
    // open customers page
    const nameOfList = 'My testing list';
    customersPage.goToCustomersPage();
    // click on red settings button
    const settingsBtn = $('#settingsCustomerBtn');
    settingsBtn.click();
    // Enter name in search field
    const searchField = $('.ng-input > input');
    searchField.addValue(nameOfList);
    // select item from dropdown panel
    const listChoices = $$('.ng-option');
    // get first item in list
    const choice = listChoices[0];
    browser.pause(8000);
    choice.click();
    // test
    const fieldToCheck = $('.ng-value .ng-value-label');
    expect(fieldToCheck.getText(), 'Searchable list is selected').equal('My testing list');
  });
  it('should select only company name, id and customer № for show', function () {
    const customerCheckbox =  customersSettingsPage.getCheckboxById('9');
    const companyNameCheckbox =  customersSettingsPage.getCheckboxById('10');
    const idCheckbox =  customersSettingsPage.getCheckboxById('18');

    if (customerCheckbox.getValue() === 'false') {
      customersSettingsPage.clickOnChecboxById('9');
    }
    if (companyNameCheckbox.getValue() === 'false') {
      customersSettingsPage.clickOnChecboxById('10');
    }
    if (idCheckbox.getValue() === 'false') {
      customersSettingsPage.clickOnChecboxById('18');
    }


    expect(customerCheckbox.getValue(), 'Customer number checkbox is\'t set').equal('true');
    expect(companyNameCheckbox.getValue(), 'Company name checkbox is\'t set').equal('true');
    expect(idCheckbox.getValue(), 'Id checkbox is\'t set').equal('true');
  });
});
