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
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get passwordInput() {
    const ele = $('#password');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get loginBtn() {
    const ele = $('#loginBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async login(): Promise<void> {
    await this.usernameInput.waitForDisplayed({ timeout: 60000 });
    const spinnerAnimation = $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 60000, reverse: true });
    await this.usernameInput.setValue(LoginConstants.username);
    await this.passwordInput.setValue(LoginConstants.password);
    await this.loginBtn.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    await $('#newEFormBtn').waitForDisplayed({ timeout: 60000 });
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
  }
  public async loginWithNewPassword(): Promise<void> {
    await this.usernameInput.waitForDisplayed({ timeout: 60000 });
    const spinnerAnimation = $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    await this.usernameInput.setValue(LoginConstants.username);
    await this.passwordInput.setValue(LoginConstants.newPassword);
    await this.loginBtn.click();
    await $('#newEFormBtn').waitForDisplayed({ timeout: 60000 });
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
  }

  public randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const loginPage = new LoginPage();
export default loginPage;
