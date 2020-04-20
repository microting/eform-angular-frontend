import {PageWithNavbarPage} from '../../Page objects/PageWithNavbar.page';

class ApplicationSettingsPluginsPage extends PageWithNavbarPage {
    constructor() {
        super();
    }

    getFirstPluginRowObj(): PluginRowObject {
      browser.pause(500);
      return new PluginRowObject(1);
    }

    getSecondPluginRowObj(): PluginRowObject {
      browser.pause(500);
      return new PluginRowObject(2);
    }
}


const pluginsPage = new ApplicationSettingsPluginsPage();
export default pluginsPage;

class PluginRowObject {
    constructor(rowNum) {
        if ($$('#plugin-id')[rowNum - 1]) {
            this.id = +$$('#plugin-id')[rowNum - 1].getText();
            this.name = $$('#plugin-name')[rowNum - 1].getText();
            this.version = $$('#plugin-version')[rowNum - 1].getText();
            this.status = $$('#plugin-status')[rowNum - 1].getText();
            this.settingsBtn = $$('#plugin-settings-btn')[rowNum - 1];
            this.activateBtn = $$(`//*[@id= 'plugin-status']//button`)[rowNum - 1];
        }
    }

    id: number;
    name;
    version;
    status;
    settingsBtn;
    activateBtn;
}
