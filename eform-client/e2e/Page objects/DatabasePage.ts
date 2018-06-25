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

  selectLanguage(languageName) {
    this.englishLanguageOption = element(by.cssContainingText('.dropdown-item', languageName));
    this.englishLanguageOption.click();
  }
  public saveDatabase(): void {
    // just fill in all inputs for database connection with appropriate values
    this.username.sendKeys(dbData.username);
    this.password.sendKeys(dbData.password);
    this.email.sendKeys(dbData.email);
    this.firstName.sendKeys(dbData.firstName);
    this.lastName.sendKeys(dbData.lastNAme);
    this.dataSourceSDK.sendKeys(dbData.dataSourceSDK);
    this.initialCatalogSDK.sendKeys(dbData.initialCatalogueSDK);
    this.authenticationTypeSDK.sendKeys(dbData.authenticationTypeSDK);
    this.token.sendKeys(dbData.token);
    this.dataSourceMain.sendKeys(dbData.dataSourceMain);
    this.initialCatalogMain.sendKeys(dbData.initialCatalogueMain);
    this.authenticationTypeMain.sendKeys(dbData.authenticationTypeMain);
    this.defaultLanguageSelector.click();
    this.selectLanguage(dbData.languageOptions.english);
    this.saveButton.click(); // click "Save" button and submit all inputs
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
