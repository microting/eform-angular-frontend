import { PageWithNavbarPage } from './PageWithNavbar.page';
import { $ } from '@wdio/globals';
import loginPage from "./Login.page";

export class ApplicationSettingsPage extends PageWithNavbarPage {
  public LoginPage: LoginPageSettings;
  public SiteHeader: SiteHeaderSettings;
  constructor() {
    super();
    this.LoginPage = new LoginPageSettings();
    this.SiteHeader = new SiteHeaderSettings();
  }

  public async  saveBtn(): Promise<WebdriverIO.Element> {
    return $('#applicationSettingsSaveBtn');
  }

  public async  siteHeaderMainText(): Promise<WebdriverIO.Element> {
    const ele = await $('#main-header-text');
    return ele;
  }

  public async  siteHeaderSecondaryText(): Promise<WebdriverIO.Element> {
    const ele = await $('#secondary-header-text');
    return ele;
  }

  public async  siteHeaderImage(): Promise<WebdriverIO.Element> {
    const ele = await $('#site-header-image');
    return ele;
  }


  public async save() {
    await (await this.saveBtn()).click();
    await browser.pause(500);
  }
}

class LoginPageSettings {
  public async  mainTextInput(): Promise<WebdriverIO.Element> {
    return $('#mainTextLoginPage');
  }

  public async  secondaryTextInput(): Promise<WebdriverIO.Element> {
    return $('#secondaryTextLoginPage');
  }

  public async  imageUploadBtn(): Promise<WebdriverIO.Element> {
    return $('#loginPageImageUploadBtn');
  }

  public async  mainTextVisibilityToggleBtn(): Promise<WebdriverIO.Element> {
    return $('#loginPageMainTextVisibilityToggler');
  }

  public async  secondaryTextVisibilityToggleBtn(): Promise<WebdriverIO.Element> {
    return $('#loginPageSecondaryTextVisibilityToggler');
  }

  public async  imageVisibilityToggler(): Promise<WebdriverIO.Element> {
    return $('#loginPageImageVisibilityToggler');
  }

  public async  resetBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#loginPageReset');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async reset() {
    await (await this.resetBtn()).click();
    await loginPage.waitForSpinnerHide();
    //await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  }
}

class SiteHeaderSettings {
  public async  mainTextInput(): Promise<WebdriverIO.Element> {
    return $('#headerSettingsMainText');
  }

  public async  secondaryTextInput(): Promise<WebdriverIO.Element> {
    return $('#headerSettingsSecondaryText');
  }

  public async  imageUploadBtn(): Promise<WebdriverIO.Element> {
    return $('#siteHeaderUploadBtn');
  }

  public async  mainTextVisibilityToggleBtn(): Promise<WebdriverIO.Element> {
    return $('#siteHeaderMainTextToggler');
  }

  public async  secondaryTextVisibilityToggleBtn(): Promise<WebdriverIO.Element> {
    return $('#siteHeaderSecondaryTextToggler');
  }

  public async  imageVisibilityToggler(): Promise<WebdriverIO.Element> {
    return $('#siteHeaderImageVisibilityToggler');
  }

  public async  resetBtn(): Promise<WebdriverIO.Element> {
    return $('#siteHeaderReset');
  }

  public async reset() {
    await (await this.resetBtn()).click();
    // browser.refresh();
  }
}

const applicationSettingsPage = new ApplicationSettingsPage();
export default applicationSettingsPage;
