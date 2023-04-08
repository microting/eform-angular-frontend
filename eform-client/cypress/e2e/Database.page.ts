import Page from './Page';
import DatabaseConfigurationConstants from '../../e2e/Constants/DatabaseConfigurationConstants'

class DatabasePage extends Page {
  constructor() {
    super();
  }

  public passwordInput() {
    return cy.get('#password');
  }

  public emailInput() {
    return cy.get('#email');
  }

  public firstNameInput() {
    return cy.get('#firstName');
  }

  public lastNameInput() {
    return cy.get('#lastName');
  }

  public customerNo() {
    return cy.get('#customerNo');
  }

  public port() {
    return cy.get('#port');
  }

  public host() {
    return cy.get('#host2');
  }

  public tokenInput() {
    return cy.get('#token');
  }

  public authenticationType() {
    return cy.get('#auth2');
  }

  public languageDropdown() {
    return cy.get('#languageSelector');
  }

  public saveBtn() {
    return cy.get('#save');
  }

  public save() {
    this.saveBtn().click();
  }

  public selectLanguage(language) {
    const dropdown = this.languageDropdown();
    dropdown.click();
    // const ele = cy.contains('//*[@class="ng-dropdown-panel ng-star-inserted ng-select-top"]//*[text()="${language}"]');
    //   ele.parent().parent().click();
    //cy.wait(1000);
    cy.get('.ng-option .ng-star-inserted').each((item, index, list) => {
      if (item.text() === language) {
        item.click();
      }
      //cy.wait(1000);
    });
  }

  public configure(language) {
    this.passwordInput().type(DatabaseConfigurationConstants.password);
    this.emailInput().type(DatabaseConfigurationConstants.email);
    this.firstNameInput().type(DatabaseConfigurationConstants.firstName);
    this.lastNameInput().type(DatabaseConfigurationConstants.lastNAme);
    this.tokenInput().type(DatabaseConfigurationConstants.token);
    this.customerNo().type(DatabaseConfigurationConstants.customerNo);
    this.port().click().focused().clear().type(DatabaseConfigurationConstants.port);
    this.host().click().focused().clear().type(DatabaseConfigurationConstants.SqlServer);
    this.authenticationType().type(DatabaseConfigurationConstants.authenticationType);
    this.selectLanguage(language);
    //cy.wait(3000);
  }
}

const databasePage = new DatabasePage();
export default databasePage;
