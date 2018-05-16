import {$, browser, ElementFinder} from 'protractor';

export class LoginPage {
  public mainTextInput: ElementFinder;
  public secondaryTextInput: ElementFinder;
  public mainTextHideButton: ElementFinder;
  public secondaryTextHideButton: ElementFinder;
  public loginPageImageHideButton: ElementFinder;
  public resetButton: ElementFinder;
  public fileInput: ElementFinder;

  public resetAndRefresh(): void {
    browser.sleep(2000);
    this.resetButton.click();
    browser.refresh();
    browser.waitForAngularEnabled();
  }

  constructor() {
    this.mainTextInput = $('#mainTextLoginPage');
    this.secondaryTextInput = $('#secondaryTextLoginPage');
    this.mainTextHideButton = $('#mainTextLoginPageHide');
    this.secondaryTextHideButton = $('#secondaryTextLoginPageHide');
    this.loginPageImageHideButton = $('#imageLoginPageHide');
    this.resetButton = $('#loginPageReset');
    this.fileInput = $('#loginPageFileInput');
  }
}
