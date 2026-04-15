import {PageWithNavbarPage} from '../../Page objects/PageWithNavbar.page';
import { $ } from '@wdio/globals';

class ApplicationSettingsPluginsPage extends PageWithNavbarPage {
    constructor() {
        super();
    }

    async getFirstPluginRowObj(): Promise<PluginRowObject> {
      await browser.pause(500);
      const obj = new PluginRowObject();
      return await obj.getRow(1);
    }

    async getSecondPluginRowObj(): Promise<PluginRowObject> {
      await browser.pause(500);
      const obj = new PluginRowObject();
      return await obj.getRow(2);
    }
}


const pluginsPage = new ApplicationSettingsPluginsPage();
export default pluginsPage;

class PluginRowObject {
    constructor() {}

    id: number;
    name;
    version;
    status;
    settingsBtn;
    activateBtn;

    async getRow(rowNum: number): Promise<PluginRowObject> {
      if ((await $$('#plugin-id'))[rowNum - 1]) {
        this.id = +await (await $$('#plugin-id'))[rowNum - 1].getText();
        this.name = await (await $$('#plugin-name'))[rowNum - 1].getText();
        this.version = await (await $$('#plugin-version'))[rowNum - 1].getText();
        this.status = await (await $$('#plugin-status'))[rowNum - 1].getText();
        this.settingsBtn = (await $$('#plugin-settings-btn'))[rowNum - 1];
        this.activateBtn = (await $$(`//*[@id= 'plugin-status']//button`))[rowNum - 1];
      }
      return this;
    }
}
