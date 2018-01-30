import {$, by, element, ElementFinder, ProtractorBy} from 'protractor';
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
  public login(): void {
    this.usernameInput.clear();
    this.passwordInput.clear();
    this.usernameInput.sendKeys(data.login);
    this.passwordInput.sendKeys(data.password);
    this.loginButton.click();
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
