import { Page, Locator } from '@playwright/test';
import BasePage from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';

export class DatabasePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public passwordInput(): Locator {
    return this.page.locator('#password');
  }

  public emailInput(): Locator {
    return this.page.locator('#email');
  }

  public firstNameInput(): Locator {
    return this.page.locator('#firstName');
  }

  public lastNameInput(): Locator {
    return this.page.locator('#lastName');
  }

  public customerNo(): Locator {
    return this.page.locator('#customerNo');
  }

  public port(): Locator {
    return this.page.locator('#port');
  }

  public host(): Locator {
    return this.page.locator('#host2');
  }

  public tokenInput(): Locator {
    return this.page.locator('#token');
  }

  public authenticationType(): Locator {
    return this.page.locator('#auth2');
  }

  public languageDropdown(): Locator {
    return this.page.locator('#languageSelector');
  }

  public saveBtn(): Locator {
    return this.page.locator('#save');
  }

  public async save() {
    await this.saveBtn().click();
  }

  public async selectLanguage(language: string) {
    await this.languageDropdown().click();
    await this.page.locator('ng-dropdown-panel .ng-option').filter({ hasText: language }).first().click();
  }

  public async configure(language: string) {
    await this.passwordInput().fill(DatabaseConfigurationConstants.password);
    await this.emailInput().fill(DatabaseConfigurationConstants.email);
    await this.firstNameInput().fill(DatabaseConfigurationConstants.firstName);
    await this.lastNameInput().fill(DatabaseConfigurationConstants.lastNAme);
    await this.tokenInput().fill(DatabaseConfigurationConstants.token);
    await this.customerNo().fill(DatabaseConfigurationConstants.customerNo);
    await this.port().fill(DatabaseConfigurationConstants.port);
    await this.host().fill(DatabaseConfigurationConstants.SqlServer);
    await this.authenticationType().fill(DatabaseConfigurationConstants.authenticationType);
    await this.selectLanguage(language);
  }
}
