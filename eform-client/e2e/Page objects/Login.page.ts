import Page from './Page';
import LoginConstants from '../Constants/LoginConstants';
import { $ } from '@wdio/globals';

class LoginPage extends Page {
  constructor() {
    super();
  }

  public async mainText(): Promise<WebdriverIO.Element> {
    return $('#loginMainText');
  }

  public async secondaryText(): Promise<WebdriverIO.Element> {
    return $('#loginSecondaryText');
  }

  public async image(): Promise<WebdriverIO.Element> {
    return $('#loginImage');
  }

  public async usernameInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#username');
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async passwordInput(): Promise<WebdriverIO.Element> {
    const ele = await $('#password');
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async loginBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#loginBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async login(): Promise<void> {
    await (await this.loginBtn()).waitForDisplayed({ timeout: 60000 });
    // await (await this.usernameInput()).waitForDisplayed({ timeout: 60000 });
    await (await this.usernameInput()).setValue(LoginConstants.username);
    await (await this.passwordInput()).setValue(LoginConstants.password);
    await (await this.loginBtn()).click();
    const newEFormBtn = await $('#newEFormBtn');
    await newEFormBtn.waitForDisplayed({timeout: 60000});
    await newEFormBtn.waitForClickable({timeout: 60000});
  }
  public async loginWithNewPassword(): Promise<void> {
    await (await this.usernameInput()).waitForDisplayed({ timeout: 60000 });
    await (await this.usernameInput()).setValue(LoginConstants.username);
    await (await this.passwordInput()).setValue(LoginConstants.newPassword);
    await (await this.loginBtn()).click();
    await $('#newEFormBtn').waitForDisplayed({ timeout: 60000 });
  }

  public randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const loginPage = new LoginPage();
export default loginPage;
