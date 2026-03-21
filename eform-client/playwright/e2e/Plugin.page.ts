import { Page } from '@playwright/test';
import { Navbar } from './Navbar.page';
import { LoginPage } from './Login.page';

export class PluginPage {
  Navbar: Navbar;

  constructor(private page: Page) {
    this.Navbar = new Navbar(page);
  }

  async enablePluginByName(pluginName: string, msForWait = 100000) {
    const row = this.page.locator('.mat-mdc-row').filter({ hasText: pluginName }).first();
    await row.locator('.mat-column-actions button').click();
    await this.page.locator('#pluginOKBtn').waitFor({ state: 'visible' });
    await this.page.locator('#pluginOKBtn').click();
    await this.page.waitForTimeout(msForWait);
    await this.page.goto('http://localhost:4200');
    const loginPage = new LoginPage(this.page);
    await loginPage.login();
    await this.Navbar.goToPluginsPage();
  }

  pluginOKBtn() {
    return this.page.locator('#pluginOKBtn');
  }

  pluginCancelBtn() {
    return this.page.locator('#pluginCancelBtn');
  }
}
