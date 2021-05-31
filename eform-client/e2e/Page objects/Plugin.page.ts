import Page from './Page';
import loginPage from './Login.page';
import myEformsPage from './MyEforms.page';

class PluginPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    return $$('#tableBody > tr').length;
  }

  public get marketplaceBtn() {
    const ele = $('#newSecurityGroupBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get pluginCancelBtn() {
    const ele = $('#pluginCancelBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get pluginOKBtn() {
    const ele = $('#pluginOKBtn');
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  getFirstPluginRowObj(): PluginRowObject {
    browser.pause(500);
    return this.getPluginRowObjByIndex(1);
  }

  getPluginRowObjByIndex(index: number): PluginRowObject {
    return new PluginRowObject(index);
  }

  getPluginRowObjByName(namePlugin: string): PluginRowObject {
    browser.pause(500);
    for (let i = 1; i < this.rowNum + 1; i++) {
      const plugin = this.getPluginRowObjByIndex(i);
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
  constructor(rowNum) {
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
  }

  element;
  id: number;
  name: string;
  version: string;
  statusBtn;
  status: boolean;
  settingsBtn;

  enableOrDisablePlugin() {
    this.statusBtn.click();
    pluginPage.pluginOKBtn.waitForDisplayed({ timeout: 40000 });
    pluginPage.pluginOKBtn.click();
    browser.pause(100000); // We need to wait 100 seconds for the plugin to create db etc.
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToPluginsPage();
    $('#plugin-name').waitForDisplayed({ timeout: 50000 });
  }
}
