import {PageWithNavbarPage} from './PageWithNavbar.page';

export class ApplicationSettingsPage extends PageWithNavbarPage {
  constructor() {
    super();
    this.LoginPage = new LoginPageSettings();
    this.SiteHeader = new SiteHeaderSettings();
  }

  public get saveBtn() {
    return browser.element('#applicationSettingsSaveBtn');
  }

  public get siteHeaderMainText() {
    return browser.element('#main-header-text');
  }

  public get siteHeaderSecondaryText() {
    return browser.element('#secondary-header-text');
  }

  public get siteHeaderImage() {
    return browser.element('#site-header-image');
  }


  public LoginPage: LoginPageSettings;
  public SiteHeader: SiteHeaderSettings;

  public save() {
    this.saveBtn.click();
    browser.pause(6000);
  }
}

class LoginPageSettings {
  public get mainTextInput() {
    return browser.element('#mainTextLoginPage');
  }

  public get secondaryTextInput() {
    return browser.element('#secondaryTextLoginPage');
  }

  public get imageUploadBtn() {
    return browser.element('#loginPageImageUploadBtn');
  }

  public get mainTextVisibilityToggleBtn() {
    return browser.element('#loginPageMainTextVisibilityToggler');
  }

  public get secondaryTextVisibilityToggleBtn() {
    return browser.element('#loginPageSecondaryTextVisibilityToggler');
  }

  public get imageVisibilityToggler() {
    return browser.element('#loginPageImageVisibilityToggler');
  }

  public get resetBtn() {
    return browser.element('#loginPageReset');
  }

  public reset() {
    this.resetBtn.click();
    browser.pause(5000);
    browser.refresh();
    browser.pause(10000);
  }
}

class SiteHeaderSettings {
  public get mainTextInput() {
    return browser.element('#headerSettingsMainText');
  }

  public get secondaryTextInput() {
    return browser.element('#headerSettingsSecondaryText');
  }

  public get imageUploadBtn() {
    return browser.element('#siteHeaderUploadBtn');
  }

  public get mainTextVisibilityToggleBtn() {
    return browser.element('#siteHeaderMainTextToggler');
  }

  public get secondaryTextVisibilityToggleBtn() {
    return browser.element('#siteHeaderSecondaryTextToggler');
  }

  public get imageVisibilityToggler() {
    return browser.element('#siteHeaderImageVisibilityToggler');
  }

  public get resetBtn() {
    return browser.element('#siteHeaderReset');
  }

  public reset() {
    this.resetBtn.click();
    browser.pause(25000);
    browser.refresh();
  }
}

const applicationSettingsPage = new ApplicationSettingsPage();
export default applicationSettingsPage;
