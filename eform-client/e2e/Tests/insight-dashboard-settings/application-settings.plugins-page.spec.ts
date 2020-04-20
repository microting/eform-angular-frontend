import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';

import {expect} from 'chai';
import pluginsPage from './application-settings.plugins.page';

describe('Application settings page - site header section', function () {
  before(function () {
    loginPage.open('/auth');
  });
  it('should go to plugin settings page', function () {
    loginPage.login();
    myEformsPage.Navbar.advancedDropdown();
    myEformsPage.Navbar.clickonSubMenuItem('Plugins');
    $('#plugin-name').waitForDisplayed({timeout: 50000});

    const plugin = pluginsPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Insight Dashboard Plugin');
    expect(plugin.version).equal('1.0.0.0');

  });
  it('should activate the plugin', function () {
    let plugin = pluginsPage.getFirstPluginRowObj();
    // pluginPage.pluginSettingsBtn.click();
    plugin.activateBtn.click();
    $('#pluginOKBtn').waitForDisplayed({timeout: 40000});
    pluginPage.pluginOKBtn.click();
    browser.pause(50000); // We need to wait 50 seconds for the plugin to create db etc.
    loginPage.open('/');

    loginPage.login();
    myEformsPage.Navbar.advancedDropdown();
    myEformsPage.Navbar.clickonSubMenuItem('Plugins');
    $('#plugin-name').waitForDisplayed({timeout: 50000});

    let pluginToFind = pluginsPage.getFirstPluginRowObj();
    expect(pluginToFind.id).equal(1);
    expect(pluginToFind.name).equal('Microting Insight Dashboard Plugin');
    expect(pluginToFind.version).equal('1.0.0.0');
    $(`//*[contains(text(), 'Insight Instrumentbræt')]`).waitForDisplayed({timeout: 30000});
  });
});
