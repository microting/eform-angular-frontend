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

  public get saveBtn() {
    return $('#save');
  }

  public async save() {
    const a = await this.saveBtn;
    await a.click();
  }

  public async selectLanguage(language) {
    const dropdown = await this.languageDropdown;
    await dropdown.click();
    const ele = await (await (await $(`//*[@id="languageSelector"]//*[text()="${language}"]`)).$('..')).$('..');
    await ele.click();
  }

  public async configure(language) {
    // this.usernameInput.setValue(DatabaseConfigurationConstants.username);
    await this.passwordInput.setValue(DatabaseConfigurationConstants.password);
    await this.emailInput.setValue(DatabaseConfigurationConstants.email);
    await this.firstNameInput.setValue(DatabaseConfigurationConstants.firstName);
    await this.lastNameInput.setValue(DatabaseConfigurationConstants.lastNAme);
    await this.tokenInput.setValue(DatabaseConfigurationConstants.token);
    await this.customerNo.setValue(DatabaseConfigurationConstants.customerNo);
    await this.port.setValue(DatabaseConfigurationConstants.port);
    await this.host.setValue(DatabaseConfigurationConstants.SqlServer);
    await this.authenticationType.setValue(DatabaseConfigurationConstants.authenticationType);
    await this.selectLanguage(language);
  }
}

const databasePage = new DatabasePage();
export default databasePage;
