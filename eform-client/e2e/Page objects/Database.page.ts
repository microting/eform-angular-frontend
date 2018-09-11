import Page from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';

class DatabasePage extends Page {
  constructor() {
    super();
  }

  public get usernameInput() {
    return browser.element('#userName');
  }

  public get passwordInput() {
    return browser.element('#password');
  }

  public get emailInput() {
    return browser.element('#email');
  }

  public get firstNameInput() {
    return browser.element('#firstName');
  }

  public get lastNameInput() {
    return browser.element('#lastName');
  }

  public get dataSourceSdkInput() {
    return browser.element('#sourceSDK');
  }

  public get initialCatalogSdkInput() {
    return browser.element('#catalogueSDK');
  }

  public get authenticationTypeSdkInput() {
    return browser.element('#authSDK');
  }

  public get tokenInput() {
    return browser.element('#token');
  }

  public get dataSourceMainInput() {
    return browser.element('#sourceMain');
  }

  public get initialCatalogMainInput() {
    return browser.element('#catalogueMain');
  }

  public get authenticationTypeMainInput() {
    return browser.element('#authMain');
  }

  public get languageDropdown() {
    return browser.element('#languageSelector');
  }

  public get saveBtn() {
    return browser.element('#save');
  }

  public save() {
    this.saveBtn.click();
  }

  public selectLanguage(language) {
    this.languageDropdown.click();
    browser.element(`//*[@id="languageSelector"]//*[text()="${language}"]`).click();
  }

  public configure(language) {
    this.usernameInput.setValue(DatabaseConfigurationConstants.username);
    this.passwordInput.setValue(DatabaseConfigurationConstants.password);
    this.emailInput.setValue(DatabaseConfigurationConstants.email);
    this.firstNameInput.setValue(DatabaseConfigurationConstants.firstName);
    this.lastNameInput.setValue(DatabaseConfigurationConstants.lastNAme);
    this.dataSourceSdkInput.setValue(DatabaseConfigurationConstants.dataSourceSDK);
    this.initialCatalogSdkInput.setValue(DatabaseConfigurationConstants.initialCatalogueSDK);
    this.authenticationTypeSdkInput.setValue(DatabaseConfigurationConstants.authenticationTypeSDK);
    this.tokenInput.setValue(DatabaseConfigurationConstants.token);
    this.dataSourceMainInput.setValue(DatabaseConfigurationConstants.dataSourceMain);
    this.initialCatalogMainInput.setValue(DatabaseConfigurationConstants.initialCatalogueMain);
    this.authenticationTypeMainInput.setValue(DatabaseConfigurationConstants.authenticationTypeMain);
    this.selectLanguage(language);
  }
}

const databasePage = new DatabasePage();
export default databasePage;
