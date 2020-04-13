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
    const ele = $('#loginBtn');
    ele.waitForDisplayed({timeout: 20000});
    ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public login(): void {
    $('#username').waitForDisplayed({timeout: 60000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    // browser.pause(10000);
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.password);
    this.loginBtn.click();
    // browser.pause(10000);
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    $('#newEFormBtn').waitForDisplayed({timeout: 60000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    // browser.pause(10000);
  }
  public loginWithNewPassword(): void {
    // browser.pause(10000);
    $('#username').waitForDisplayed({timeout: 60000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.newPassword);
    this.loginBtn.click();
    $('#newEFormBtn').waitForDisplayed({timeout: 60000});
    $('#spinner-animation').waitForDisplayed({timeout: 50000, reverse: true});
    // browser.pause(10000);
  }

  public randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const loginPage = new LoginPage();
export default loginPage;
