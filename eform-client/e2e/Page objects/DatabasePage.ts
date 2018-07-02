import {$, by, element, ElementFinder} from 'protractor';
import {default as dbData} from '../dbData';

export class DatabasePage {
  // matchers
  public username: ElementFinder;
  public password: ElementFinder;
  public email: ElementFinder;
  public firstName: ElementFinder;
  public lastName: ElementFinder;
  public dataSourceSDK: ElementFinder;
  public initialCatalogSDK: ElementFinder;
  public authenticationTypeSDK: ElementFinder;
  public token: ElementFinder;
  public dataSourceMain: ElementFinder;
  public initialCatalogMain: ElementFinder;
  public authenticationTypeMain: ElementFinder;
  public saveButton: ElementFinder;
  public defaultLanguageSelector: ElementFinder;
  public englishLanguageOption: ElementFinder;

  public async selectLanguage(languageName) : Promise<void> {
    this.englishLanguageOption = element(by.cssContainingText('.dropdown-item', languageName));
    await this.englishLanguageOption.click();
  }
  public async saveDatabase(): Promise<void> {
    // just fill in all inputs for database connection with appropriate values
    await this.username.sendKeys(dbData.username);
    await this.password.sendKeys(dbData.password);
    await this.email.sendKeys(dbData.email);
    await this.firstName.sendKeys(dbData.firstName);
    await this.lastName.sendKeys(dbData.lastNAme);
    await this.dataSourceSDK.sendKeys(dbData.dataSourceSDK);
    await this.initialCatalogSDK.sendKeys(dbData.initialCatalogueSDK);
    await this.authenticationTypeSDK.sendKeys(dbData.authenticationTypeSDK);
    await this.token.sendKeys(dbData.token);
    await this.dataSourceMain.sendKeys(dbData.dataSourceMain);
    await this.initialCatalogMain.sendKeys(dbData.initialCatalogueMain);
    await this.authenticationTypeMain.sendKeys(dbData.authenticationTypeMain);
    await this.defaultLanguageSelector.click();
    await this.selectLanguage(dbData.languageOptions.english);
    await this.saveButton.click(); // click "Save" button and submit all inputs
  }

  constructor() {
    this.username = $('#userName');
    this.password = $('#password');
    this.email = $('#email');
    this.firstName = $('#firstName');
    this.lastName = $('#lastName');
    this.dataSourceSDK = $('#sourceSDK');
    this.initialCatalogSDK = $('#catalogueSDK');
    this.authenticationTypeSDK = $('#authSDK');
    this.token = $('#token');
    this.dataSourceMain = $('#sourceMain');
    this.initialCatalogMain = $('#catalogueMain');
    this.authenticationTypeMain = $('#authMain');
    this.saveButton = $('button.btn.btn-danger.btn-ar');
    this.defaultLanguageSelector = $('#defaultLanguageSelector');
  }
}
