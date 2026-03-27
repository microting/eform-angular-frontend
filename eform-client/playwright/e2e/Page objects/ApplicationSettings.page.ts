import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';

class LoginPageSettings {
  constructor(public page: Page) {}

  public mainTextInput(): Locator {
    return this.page.locator('#mainTextLoginPage');
  }

  public secondaryTextInput(): Locator {
    return this.page.locator('#secondaryTextLoginPage');
  }

  public imageUploadBtn(): Locator {
    return this.page.locator('#loginPageImageUploadBtn');
  }

  public mainTextVisibilityToggleBtn(): Locator {
    return this.page.locator('#loginPageMainTextVisibilityToggler');
  }

  public secondaryTextVisibilityToggleBtn(): Locator {
    return this.page.locator('#loginPageSecondaryTextVisibilityToggler');
  }

  public imageVisibilityToggler(): Locator {
    return this.page.locator('#loginPageImageVisibilityToggler');
  }

  public resetBtn(): Locator {
    return this.page.locator('#loginPageReset');
  }

  public async reset() {
    await this.resetBtn().click();
    // waitForSpinnerHide would need to be called from parent
  }
}

class SiteHeaderSettings {
  constructor(public page: Page) {}

  public mainTextInput(): Locator {
    return this.page.locator('#headerSettingsMainText');
  }

  public secondaryTextInput(): Locator {
    return this.page.locator('#headerSettingsSecondaryText');
  }

  public imageUploadBtn(): Locator {
    return this.page.locator('#siteHeaderUploadBtn');
  }

  public mainTextVisibilityToggleBtn(): Locator {
    return this.page.locator('#siteHeaderMainTextToggler');
  }

  public secondaryTextVisibilityToggleBtn(): Locator {
    return this.page.locator('#siteHeaderSecondaryTextToggler');
  }

  public imageVisibilityToggler(): Locator {
    return this.page.locator('#siteHeaderImageVisibilityToggler');
  }

  public resetBtn(): Locator {
    return this.page.locator('#siteHeaderReset');
  }

  public async reset() {
    await this.resetBtn().click();
  }
}

export class ApplicationSettingsPage extends PageWithNavbarPage {
  public LoginPage: LoginPageSettings;
  public SiteHeader: SiteHeaderSettings;

  constructor(page: Page) {
    super(page);
    this.LoginPage = new LoginPageSettings(page);
    this.SiteHeader = new SiteHeaderSettings(page);
  }

  public saveBtn(): Locator {
    return this.page.locator('#applicationSettingsSaveBtn');
  }

  public siteHeaderMainText(): Locator {
    return this.page.locator('#main-header-text');
  }

  public siteHeaderSecondaryText(): Locator {
    return this.page.locator('#secondary-header-text');
  }

  public siteHeaderImage(): Locator {
    return this.page.locator('#site-header-image');
  }

  public async save() {
    await this.saveBtn().click();
    await this.page.waitForTimeout(500);
  }
}
