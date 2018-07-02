import {$, browser, by, element, ElementFinder, ExpectedConditions} from 'protractor';
import {By} from '@angular/platform-browser';
import {default as data} from '../data';

export class LoginPage {
  // matchers
  public usernameInput: ElementFinder;
  public passwordInput: ElementFinder;
  public loginButton: ElementFinder;
  public loginPageMainText: ElementFinder;
  public loginPageSecondaryText: ElementFinder;
  // elements
  public loginPageMainTextMatcher: By;
  public loginPageSecondaryTextMatcher: By;
  public loginPageImageMatcher: By;

  // login method, used on Login Page
  public async login(): Promise<void> {
    await browser.wait(ExpectedConditions.elementToBeClickable(this.usernameInput));
    await this.usernameInput.clear();
    await browser.wait(ExpectedConditions.elementToBeClickable(this.passwordInput));
    await this.passwordInput.clear();
    await this.usernameInput.sendKeys(data.login);
    await this.passwordInput.sendKeys(data.password);
    await this.loginButton.click();
  }


  constructor() {
    this.usernameInput = $('#username');
    this.passwordInput = $('#password');
    this.loginButton = $('button.btn-success');
    this.loginPageMainTextMatcher = by.css('#loginPageMainText');
    this.loginPageSecondaryTextMatcher = by.css('#loginPageSecondaryText');
    this.loginPageImageMatcher = by.css('#loginPageImage');
    this.loginPageMainText = element(this.loginPageMainTextMatcher);
    this.loginPageSecondaryText = element(this.loginPageSecondaryTextMatcher);
  }
}
