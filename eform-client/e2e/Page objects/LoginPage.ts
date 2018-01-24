import {$, ElementFinder} from 'protractor';

export class LoginPage {
  public usernameInput: ElementFinder;
  public passwordInput: ElementFinder;
  public loginButton: ElementFinder;

  constructor() {
    this.usernameInput = $('#username');
    this.passwordInput = $('#password');
    this.loginButton = $('button.btn-success');
  }
}
