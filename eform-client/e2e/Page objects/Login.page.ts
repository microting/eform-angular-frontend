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
    const ele = $('#username');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get passwordInput() {
    const ele = $('#password');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get loginBtn() {
    const ele = $('#loginBtn');
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public login(): void {
    this.usernameInput.waitForDisplayed({ timeout: 60000 });
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({ timeout: 60000, reverse: true });
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.password);
    this.loginBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    $('#newEFormBtn').waitForDisplayed({ timeout: 60000 });
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
  }
  public loginWithNewPassword(): void {
    this.usernameInput.waitForDisplayed({ timeout: 60000 });
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.newPassword);
    this.loginBtn.click();
    $('#newEFormBtn').waitForDisplayed({ timeout: 60000 });
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
  }

  public randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const loginPage = new LoginPage();
export default loginPage;
