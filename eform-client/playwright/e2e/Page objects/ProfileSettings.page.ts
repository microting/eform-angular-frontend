import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';

export class ProfileSettingsPage extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public languageSelector(): Locator {
    return this.page.locator('#ProfileLanguageSelector');
  }

  public saveBtn(): Locator {
    return this.page.locator('#ProfileSettingsSaveBtn');
  }

  public async saveProfileSettings() {
    await this.saveBtn().click();
    await this.page.locator('#sign-out-dropdown').waitFor({ state: 'visible', timeout: 40000 });
    await this.page.waitForTimeout(1000);
  }

  public async chooseLanguage(language: string) {
    await this.languageSelector().click();
    await this.page.waitForTimeout(2000);
    await this.page.locator(`//*["ng-dropdown-panel"]//*[text()="${language}"]`).click();
    await this.page.waitForTimeout(1000);
  }
}
