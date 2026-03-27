import BasePage from './Page';
import LoginConstants from '../Constants/LoginConstants';
import { Page, Locator } from '@playwright/test';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public mainText(): Locator {
    return this.page.locator('#loginMainText');
  }

  public secondaryText(): Locator {
    return this.page.locator('#loginSecondaryText');
  }

  public image(): Locator {
    return this.page.locator('#loginImage');
  }

  public usernameInput(): Locator {
    return this.page.locator('#username');
  }

  public passwordInput(): Locator {
    return this.page.locator('#password');
  }

  public loginBtn(): Locator {
    return this.page.locator('#loginBtn');
  }

  public async waitForLoginBtn(): Promise<Locator> {
    const ele = this.loginBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public async login(): Promise<void> {
    await this.loginBtn().waitFor({ state: 'visible', timeout: 60000 });
    await this.usernameInput().fill(LoginConstants.username);
    await this.passwordInput().fill(LoginConstants.password);
    await this.loginBtn().click();
    // Add pause after login click to allow application to start loading on slow environments
    await this.page.waitForTimeout(2000);
    const newEFormBtn = this.page.locator('#newEFormBtn');
    // Increased timeout for slow environments - application may take longer to initialize
    await newEFormBtn.waitFor({ state: 'visible', timeout: 120000 });
  }

  public async loginWithNewPassword(): Promise<void> {
    await this.usernameInput().waitFor({ state: 'visible', timeout: 60000 });
    await this.usernameInput().fill(LoginConstants.username);
    await this.passwordInput().fill(LoginConstants.newPassword);
    await this.loginBtn().click();
    // Add pause after login click to allow application to start loading on slow environments
    await this.page.waitForTimeout(2000);
    // Increased timeout for slow environments - application may take longer to initialize
    await this.page.locator('#newEFormBtn').waitFor({ state: 'visible', timeout: 120000 });
  }

  public randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
