import Page from './Page';
import loginPage from './Login.page';
import myEformsPage from './MyEforms.page';

class PluginPage extends Page {
  constructor() {
    super();
  }

  public async rowNum(): Promise<number> {
    return (await $$('#tableBody > tr')).length;
  }

  public async marketplaceBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#newSecurityGroupBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async pluginCancelBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#pluginCancelBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async pluginOKBtn(): Promise<WebdriverIO.Element> {
    const ele = await $('#pluginOKBtn');
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  async getFirstPluginRowObj(): Promise<PluginRowObject> {
    await browser.pause(500);
    return this.getPluginRowObjByIndex(1);
  }

  async getPluginRowObjByIndex(index: number): Promise<PluginRowObject> {
    const pluginObj = new PluginRowObject();
    return await pluginObj.getRow(index);
  }

  async getPluginRowObjByName(namePlugin: string): Promise<PluginRowObject> {
    await browser.pause(500);
    for (let i = 1; i < await this.rowNum() + 1; i++) {
      const plugin = await this.getPluginRowObjByIndex(i);
      if (plugin.name === namePlugin) {
        return plugin;
      }
    }
    return null;
  }
}

const pluginPage = new PluginPage();
export default pluginPage;

class PluginRowObject {
  constructor() {
  }

  element;
  id: number;
  name: string;
  version: string;
  statusBtn;
  status: boolean;
  settingsBtn;

  public async getRow(rowNum: number): Promise<PluginRowObject> {
    this.element = $$('#tableBody > tr')[rowNum - 1];
    if (this.element) {
      this.id = +this.element.$('#plugin-id').getText();
      this.name = this.element.$('#plugin-name').getText();
      this.version = this.element.$('#plugin-version').getText();
      this.settingsBtn = this.element.$('#plugin-settings-link');
      this.statusBtn = this.element.$('#plugin-status button');
      const pluginStatus = this.element.$('#plugin-status');
      this.status = pluginStatus.$('fa-icon[icon="toggle-off"]').isDisplayed();
    }
    return this;
  }

  async enableOrDisablePlugin(timeout = 100000) {
    await this.statusBtn.click();
    await (await pluginPage.pluginOKBtn()).waitForDisplayed({ timeout: 40000 });
    await (await pluginPage.pluginOKBtn()).click();
    await browser.pause(timeout); // We need to wait 100 seconds for the plugin to create db etc.
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToPluginsPage();
    await (await $('#plugin-name')).waitForDisplayed({ timeout: 50000 });
  }
}
