import Page from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';

class DatabasePage extends Page {
  constructor() {
    super();
  }

  public get passwordInput() {
    return $('#password');
  }

  public get emailInput() {
    return $('#email');
  }

  public get firstNameInput() {
    return $('#firstName');
  }

  public get lastNameInput() {
    return $('#lastName');
  }

  public get customerNo() {
    return $('#customerNo');
  }

  public SqlServer(sqlserver) {
    this.sqlserverDropdown.click();
    $(`//*[@id="sqlServerSelector"]//*[text()="${sqlserver}"]`).$('..').$('..').click();
  }

  public get port() {
    return $('#port');
  }

  public get host() {
    return $('#host2');
  }

  public get tokenInput() {
    return $('#token');
  }

  public get authenticationType() {
    return $('#auth2');
  }

  public get languageDropdown() {
    return $('#languageSelector');
  }


  public get sqlserverDropdown() {
    return $('#sqlServerSelector');
  }

  public get saveBtn() {
    return $('#save');
  }

  public save() {
    this.saveBtn.click();
  }

  public selectLanguage(language) {
    this.languageDropdown.click();
    $(`//*[@id="languageSelector"]//*[text()="${language}"]`).$('..').$('..').click();
  }

  public configure(language) {
    // this.usernameInput.setValue(DatabaseConfigurationConstants.username);
    this.passwordInput.setValue(DatabaseConfigurationConstants.password);
    this.emailInput.setValue(DatabaseConfigurationConstants.email);
    this.firstNameInput.setValue(DatabaseConfigurationConstants.firstName);
    this.lastNameInput.setValue(DatabaseConfigurationConstants.lastNAme);
    this.tokenInput.setValue(DatabaseConfigurationConstants.token);
    this.customerNo.setValue(DatabaseConfigurationConstants.customerNo);
    this.port.setValue(DatabaseConfigurationConstants.port);
    this.host.setValue(DatabaseConfigurationConstants.SqlServer);
    this.authenticationType.setValue(DatabaseConfigurationConstants.authenticationType);
    this.selectLanguage(language);
  }
}

const databasePage = new DatabasePage();
export default databasePage;
