import Page from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';
import { $ } from '@wdio/globals';

class DatabasePage extends Page {
  constructor() {
    super();
  }

  public async passwordInput(): Promise<WebdriverIO.Element> {
    return $('#password');
  }

  public async emailInput(): Promise<WebdriverIO.Element> {
    return $('#email');
  }

  public async firstNameInput(): Promise<WebdriverIO.Element> {
    return $('#firstName');
  }

  public async lastNameInput(): Promise<WebdriverIO.Element> {
    return $('#lastName');
  }

  public async customerNo(): Promise<WebdriverIO.Element> {
    return $('#customerNo');
  }

  public async port(): Promise<WebdriverIO.Element> {
    return $('#port');
  }

  public async host(): Promise<WebdriverIO.Element> {
    return $('#host2');
  }

  public async tokenInput(): Promise<WebdriverIO.Element> {
    return $('#token');
  }

  public async authenticationType(): Promise<WebdriverIO.Element> {
    return $('#auth2');
  }

  public async languageDropdown(): Promise<WebdriverIO.Element> {
    return $('#languageSelector');
  }

  public async saveBtn(): Promise<WebdriverIO.Element> {
    return $('#save');
  }

  public async save() {
    const a = await this.saveBtn();
    await a.click();
  }

  public async selectLanguage(language) {
    const dropdown = await this.languageDropdown();
    await dropdown.click();
    const ele = await (await (await $(`//*[@class="ng-dropdown-panel ng-star-inserted ng-select-top"]//*[text()="${language}"]`)).$('..')).$('..');
    await ele.click();
  }

  public async configure(language) {
    // this.usernameInput.setValue(DatabaseConfigurationConstants.username);
    await (await this.passwordInput()).setValue(DatabaseConfigurationConstants.password);
    await (await this.emailInput()).setValue(DatabaseConfigurationConstants.email);
    await (await this.firstNameInput()).setValue(DatabaseConfigurationConstants.firstName);
    await (await this.lastNameInput()).setValue(DatabaseConfigurationConstants.lastNAme);
    await (await this.tokenInput()).setValue(DatabaseConfigurationConstants.token);
    await (await this.customerNo()).setValue(DatabaseConfigurationConstants.customerNo);
    await (await this.port()).setValue(DatabaseConfigurationConstants.port);
    await (await this.host()).setValue(DatabaseConfigurationConstants.SqlServer);
    await (await this.authenticationType()).setValue(DatabaseConfigurationConstants.authenticationType);
    await this.selectLanguage(language);
  }
}

const databasePage = new DatabasePage();
export default databasePage;
