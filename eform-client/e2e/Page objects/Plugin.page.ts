import Page from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';

class PluginPage extends Page {
  constructor() {
    super();
  }

  public ClickDropdown(id) {
    return browser.element(`#${id}`).click();
  }

  public get saveBtn() {
    return browser.element('#saveBtn');
  }

  public get pluginSettingsBtn() {
    return browser.element(`//*[@id= 'plugin-status']//button`);
  }

  public get pluginOKBtn() {
    return browser.element('#pluginOKBtn');
  }
  public get pluginSettingsLink() {
    return browser.element('#plugin-settings-link');
  }

  public save() {
    this.saveBtn.click();
  }

  public selectValue(dropdownId, id, value) {
    this.ClickDropdown(dropdownId);
    browser.element(`//*[@id="${id}"]//*[text()="${value}"]`).click();
    browser.pause(4000);
  }
}

const pluginPage = new PluginPage();
export default pluginPage;
