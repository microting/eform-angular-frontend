import Page from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';

class DatabasePage extends Page {
  constructor() {
    super();
  }

  // public get usernameInput() {
  //   return browser.element('#userName');
  // }

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

  // public get dataSourceSdkInput() {
  //   return browser.element('#sourceSDK');
  // }

  public get customerNo() {
    return browser.element('#customerNo');
  }

  public get SqlServer() {
    return browser.element('#host2');
  }

  public get port() {
    return browser.element('#port');
  }

  public get tokenInput() {
    return browser.element('#token');
  }

  // public get dataSourceMainInput() {
  //   return browser.element('#sourceMain');
  // }
  //
  // public get initialCatalogMainInput() {
  //   return browser.element('#catalogueMain');
  // }
  //
  public get authenticationType() {
    return browser.element('#auth2');
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
    // this.usernameInput.setValue(DatabaseConfigurationConstants.username);
    this.passwordInput.setValue(DatabaseConfigurationConstants.password);
    this.emailInput.setValue(DatabaseConfigurationConstants.email);
    this.firstNameInput.setValue(DatabaseConfigurationConstants.firstName);
    this.lastNameInput.setValue(DatabaseConfigurationConstants.lastNAme);
    this.tokenInput.setValue(DatabaseConfigurationConstants.token);
    this.customerNo.setValue(DatabaseConfigurationConstants.customerNo);
    // this.dataSourceSdkInput.setValue(DatabaseConfigurationConstants.dataSourceSDK);
    this.SqlServer.setValue(DatabaseConfigurationConstants.SqlServer);
    this.port.setValue(DatabaseConfigurationConstants.port);
    // this.dataSourceMainInput.setValue(DatabaseConfigurationConstants.dataSourceMain);
    // this.initialCatalogMainInput.setValue(DatabaseConfigurationConstants.initialCatalogueMain);
    this.authenticationType.setValue(DatabaseConfigurationConstants.authenticationType);
    this.selectLanguage(language);
  }
}

const databasePage = new DatabasePage();
export default databasePage;
