import Page from './Page';
import DatabaseConfigurationConstants from '../Constants/DatabaseConfigurationConstants';

class PluginPage extends Page {
  constructor() {
    super();
  }

  public ClickDropdown(id) {
    return $(`#${id}`).click();
  }

  public get saveBtn() {
    return $('#saveBtn');
  }

  public get pluginSettingsBtn() {
    return $(`//*[@id= 'plugin-status']//button`);
  }

  public get pluginOKBtn() {
    return $('#pluginOKBtn');
  }
  public get pluginSettingsLink() {
    return $('#plugin-settings-link');
  }

  public save() {
    this.saveBtn.click();
  }

  public selectValue(dropdownId, id, value) {
    this.ClickDropdown(dropdownId);
    $(`//*[@id="${id}"]//*[text()="${value}"]`).click();
    browser.pause(4000);
  }
}

const pluginPage = new PluginPage();
export default pluginPage;
