import Page from './Page';
import LoginConstants from '../Constants/LoginConstants';

class LoginPage extends Page {
  constructor() {
    super();
  }

  public get mainText() {
    return $('#loginMainText');
  }

  public get secondaryText() {
    return $('#loginSecondaryText');
  }

  public get image() {
    return $('#loginImage');
  }

  public get usernameInput() {
    return $('#username');
  }

  public get passwordInput() {
    return $('#password');
  }

  public get loginBtn() {
    return $('#loginBtn');
  }

  public login(): void {
    $('#username').waitForDisplayed(60000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    // browser.pause(10000);
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.password);
    this.loginBtn.click();
    // browser.pause(10000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    $('#newEFormBtn').waitForDisplayed(60000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    // browser.pause(10000);
  }
  public loginWithNewPassword(): void {
    // browser.pause(10000);
    $('#username').waitForDisplayed(60000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.newPassword);
    this.loginBtn.click();
    $('#newEFormBtn').waitForDisplayed(60000);
    $('#spinner-animation').waitForDisplayed(50000, true);
    // browser.pause(10000);
  }
}

const loginPage = new LoginPage();
export default loginPage;
