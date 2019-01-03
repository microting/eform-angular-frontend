import Page from './Page';
import LoginConstants from '../Constants/LoginConstants';

class LoginPage extends Page {
  constructor() {
    super();
  }

  public get mainText() {
    return browser.element('#loginMainText');
  }

  public get secondaryText() {
    return browser.element('#loginSecondaryText');
  }

  public get image() {
    return browser.element('#loginImage');
  }

  public get usernameInput() {
    return browser.element('#username');
  }

  public get passwordInput() {
    return browser.element('#password');
  }

  public get loginBtn() {
    return browser.element('#loginBtn');
  }

  public login(): void {
    browser.pause(10000);
    this.usernameInput.setValue(LoginConstants.username);
    this.passwordInput.setValue(LoginConstants.password);
    this.loginBtn.click();
    browser.pause(10000);
  }
}

const loginPage = new LoginPage();
export default loginPage;
