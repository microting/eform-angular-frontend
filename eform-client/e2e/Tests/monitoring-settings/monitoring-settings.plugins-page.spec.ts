import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';

import {expect} from 'chai';
import pluginsPage from './monitoring-settings.plugins.page';


describe('Application settings page - site header section', function () {
    before(function () {
        loginPage.open('/auth');
    });
    it('should go to plugin settings page', function () {
       loginPage.login();
       myEformsPage.Navbar.advancedDropdown();
       myEformsPage.Navbar.clickonSubMenuItem('Plugins');
       browser.pause(10000);

      const plugin = pluginsPage.getFirstPluginRowObj();
      expect(plugin.id).equal(1);
      expect(plugin.name).equal('Microting Monitoring Plugin');
      expect(plugin.version).equal('1.0.0.0');
       // expect()

    });

    it('should activate the plugin', function () {
        pluginPage.pluginSettingsBtn.click();
        browser.waitForVisible('#pluginOKBtn', 40000);
        pluginPage.pluginOKBtn.click();
        browser.pause(50000); // We need to wait 50 seconds for the plugin to create db etc.
        browser.refresh();

        loginPage.login();
        myEformsPage.Navbar.advancedDropdown();
        myEformsPage.Navbar.clickonSubMenuItem('Plugins');
        browser.waitForExist('#plugin-name', 50000);
        browser.pause(10000);

        const plugin = pluginsPage.getFirstPluginRowObj();
        expect(plugin.id).equal(1);
        expect(plugin.name).equal('Microting Monitoring Plugin');
        expect(plugin.version).equal('1.0.0.0');
        expect(plugin.settingsBtn.isVisible());
        expect(browser.element(`//*[contains(text(), 'Overvågning')]`).isExisting()).equal(true);

      // click on plugin settings
        // enter connectionstring for customers plugin
        // select activate
        // save changes
        // see that the plugin is marked active
        // validate that the customers menu entry is now visible
        // validate that the customers index page is shown with all fields active in the header
    });
});
