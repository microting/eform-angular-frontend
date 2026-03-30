import BasePage from './Page';
import { LoginPage } from './Login.page';
import { MyEformsPage } from './MyEforms.page';
import { Page, Locator } from '@playwright/test';

export class PluginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  public async rowNum(): Promise<number> {
    return await this.page.locator('tbody > tr').count();
  }

  public marketplaceBtn(): Locator {
    return this.page.locator('#newSecurityGroupBtn');
  }

  public async waitForMarketplaceBtn(): Promise<Locator> {
    const ele = this.marketplaceBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public pluginCancelBtn(): Locator {
    return this.page.locator('#pluginCancelBtn');
  }

  public async waitForPluginCancelBtn(): Promise<Locator> {
    const ele = this.pluginCancelBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public pluginOKBtn(): Locator {
    return this.page.locator('#pluginOKBtn');
  }

  public async waitForPluginOKBtn(): Promise<Locator> {
    const ele = this.pluginOKBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  async getFirstPluginRowObj(): Promise<PluginRowObject> {
    await this.page.waitForTimeout(500);
    return this.getPluginRowObjByIndex(1);
  }

  async getPluginRowObjByIndex(index: number): Promise<PluginRowObject> {
    const pluginObj = new PluginRowObject(this.page);
    return await pluginObj.getRow(index);
  }

  async getPluginRowObjByName(namePlugin: string): Promise<PluginRowObject | null> {
    await this.page.waitForTimeout(500);
    for (let i = 1; i < await this.rowNum(); i++) {
      const plugin = await this.getPluginRowObjByIndex(i);
      if (plugin.name === namePlugin) {
        return plugin;
      }
    }
    return null;
  }
}

export class PluginRowObject {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  id: number;
  name: string;
  version: string;
  statusBtn: Locator;
  status: string;
  settingsBtn: Locator;
  rowNumber: number;

  public async getRow(rowNum: number): Promise<PluginRowObject> {
    this.rowNumber = rowNum - 1;
    await this.clickActionsMenu();
    this.id = +(await this.page.locator('#plugin-id' + this.rowNumber).textContent());
    this.name = await this.page.locator('#plugin-name' + this.rowNumber).textContent();
    this.version = await this.page.locator('#plugin-version' + this.rowNumber).textContent();
    this.settingsBtn = this.page.locator('#plugin-settings-link' + this.rowNumber);
    this.statusBtn = this.page.locator('#plugin-status-button' + this.rowNumber);
    // To get status, we need to open the menu first since the button is inside mat-menu
    const statusIcon = this.statusBtn.locator('mat-icon');
    this.status = await statusIcon.textContent();
    // Close the menu by clicking elsewhere or pressing escape
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(500);
    return this;
  }

  async enableOrDisablePlugin(timeout = 100000) {
    const pluginPage = new PluginPage(this.page);
    const loginPage = new LoginPage(this.page);
    const myEformsPage = new MyEformsPage(this.page);

    await this.clickActionsMenu();
    await this.statusBtn.click();
    await this.page.waitForTimeout(500);
    await pluginPage.pluginOKBtn().waitFor({ state: 'visible', timeout: 40000 });
    await pluginPage.pluginOKBtn().click();
    await this.page.waitForTimeout(timeout); // We need to wait 100 seconds for the plugin to create db etc.
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToPluginsPage();
    await this.page.waitForTimeout(500);
  }

  private async clickActionsMenu() {
    await this.page.waitForTimeout(1000);
    await this.page.locator('#actionMenu').nth(this.rowNumber).click();
    await this.page.waitForTimeout(1000);
  }
}
