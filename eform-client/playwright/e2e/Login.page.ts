import { Page } from '@playwright/test';
import loginConstants from '../../e2e/Constants/LoginConstants';

export class LoginPage {
  constructor(private page: Page) {}

  async login(username = loginConstants.username, password = loginConstants.password) {
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    await Promise.all([
      this.page.waitForResponse('**/api/templates/index'),
      this.page.click('#loginBtn'),
    ]);
    await this.page.waitForSelector('#newEFormBtn', { state: 'visible' });
  }

  async loginWithNewPassword() {
    await this.page.fill('#username', loginConstants.username);
    await this.page.fill('#password', loginConstants.newPassword);
    await this.page.click('#loginBtn');
    await this.page.waitForSelector('#newEFormBtn', { state: 'visible' });
  }
}
