import {$, browser, ElementFinder} from 'protractor';

export class LoginPage {
  public mainTextInput: ElementFinder;
  public secondaryTextInput: ElementFinder;
  public mainTextHide: ElementFinder;
  public secondaryTextHide: ElementFinder;
  public loginPageImageHideButton: ElementFinder;
  public resetButton: ElementFinder;

  public resetAndRefresh(): void {
    browser.sleep(2000);
    this.resetButton.click();
    browser.refresh();
    browser.waitForAngularEnabled();
  }

  constructor() {
    this.mainTextInput = $('#mainTextLoginPage');
    this.secondaryTextInput = $('#secondaryTextLoginPage');
    this.mainTextHide = $('#mainTextLoginPageHide');
    this.secondaryTextHide = $('#secondaryTextLoginPageHide');
    this.loginPageImageHideButton = $('#imageLoginPageHide');
    this.resetButton = $('#loginPageReset');

  }
}
