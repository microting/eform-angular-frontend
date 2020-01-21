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
    browser.waitForExist('#plugin-name', 50000);
    browser.pause(10000);

    const plugin = pluginsPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Customers Plugin');
    expect(plugin.version).equal('1.0.0.0');

    const pluginTwo = pluginsPage.getSecondPluginRowObj();
    expect(pluginTwo.id).equal(2);
    expect(pluginTwo.name).equal('Microting InstallationChecking Plugin');
    expect(pluginTwo.version).equal('1.0.0.0');
  });
  it('should activate the plugin', function () {
    let plugin = pluginsPage.getFirstPluginRowObj();
    plugin.activateBtn.click();
    browser.waitForVisible('#pluginOKBtn', 40000);
    pluginPage.pluginOKBtn.click();
    browser.pause(50000); // We need to wait 50 seconds for the plugin to create db etc.
    browser.refresh();

    loginPage.login();
    myEformsPage.Navbar.advancedDropdown();
    myEformsPage.Navbar.clickonSubMenuItem('Plugins');
    browser.waitForExist('#plugin-name', 50000);
    browser.pause(10000);

    const pluginTwo = pluginsPage.getSecondPluginRowObj();
    pluginTwo.activateBtn.click();
    browser.waitForVisible('#pluginOKBtn', 40000);
    pluginPage.pluginOKBtn.click();
    browser.pause(50000); // We need to wait 50 seconds for the plugin to create db etc.
    browser.refresh();

    loginPage.login();
    myEformsPage.Navbar.advancedDropdown();
    myEformsPage.Navbar.clickonSubMenuItem('Plugins');
    browser.waitForExist('#plugin-name', 50000);
    browser.pause(10000);

    plugin = pluginsPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Customers Plugin');
    expect(plugin.version).equal('1.0.0.0');


    expect(pluginTwo.id).equal(2);
    expect(pluginTwo.name).equal('Microting InstallationChecking Plugin');
    expect(pluginTwo.version).equal('1.0.0.0');
    expect(browser.element(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Planlægning')]`).isExisting()).equal(true);
  });
});
