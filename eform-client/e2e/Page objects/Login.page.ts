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
    console.log('[LOGIN DEBUG] Starting login process...');
    console.log('[LOGIN DEBUG] Current URL:', await browser.getUrl());
    
    await (await this.loginBtn()).waitForDisplayed({ timeout: 60000 });
    console.log('[LOGIN DEBUG] Login button is displayed');
    
    // await (await this.usernameInput()).waitForDisplayed({ timeout: 60000 });
    await (await this.usernameInput()).setValue(LoginConstants.username);
    console.log('[LOGIN DEBUG] Username set');
    
    await (await this.passwordInput()).setValue(LoginConstants.password);
    console.log('[LOGIN DEBUG] Password set');
    
    await (await this.loginBtn()).click();
    console.log('[LOGIN DEBUG] Login button clicked');
    console.log('[LOGIN DEBUG] URL after click:', await browser.getUrl());
    
    // Add pause after login click to allow application to start loading on slow environments
    await browser.pause(2000);
    console.log('[LOGIN DEBUG] Waited 2 seconds, now looking for newEFormBtn...');
    console.log('[LOGIN DEBUG] Current URL:', await browser.getUrl());
    
    // Take screenshot before waiting for newEFormBtn to help debug
    try {
      const screenshotPath = './errorShots/before-newEFormBtn-wait.png';
      await browser.saveScreenshot(screenshotPath);
      console.log('[LOGIN DEBUG] Screenshot saved to:', screenshotPath);
    } catch (e) {
      console.log('[LOGIN DEBUG] Could not save screenshot:', e.message);
    }
    
    const newEFormBtn = await $('#newEFormBtn');
    // Increased timeout for slow environments - application may take longer to initialize
    console.log('[LOGIN DEBUG] Waiting for newEFormBtn to be displayed (120s timeout)...');
    await newEFormBtn.waitForDisplayed({timeout: 120000});
    console.log('[LOGIN DEBUG] newEFormBtn is displayed');
    
    console.log('[LOGIN DEBUG] Waiting for newEFormBtn to be clickable (120s timeout)...');
    await newEFormBtn.waitForClickable({timeout: 120000});
    console.log('[LOGIN DEBUG] newEFormBtn is clickable - login complete!');
    console.log('[LOGIN DEBUG] Final URL:', await browser.getUrl());
  }
  public async loginWithNewPassword(): Promise<void> {
    await (await this.usernameInput()).waitForDisplayed({ timeout: 60000 });
    await (await this.usernameInput()).setValue(LoginConstants.username);
    await (await this.passwordInput()).setValue(LoginConstants.newPassword);
    await (await this.loginBtn()).click();
    // Add pause after login click to allow application to start loading on slow environments
    await browser.pause(2000);
    // Increased timeout for slow environments - application may take longer to initialize
    await $('#newEFormBtn').waitForDisplayed({ timeout: 120000 });
  }

  public randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

const loginPage = new LoginPage();
export default loginPage;
