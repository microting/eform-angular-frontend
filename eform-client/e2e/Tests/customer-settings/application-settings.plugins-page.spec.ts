import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';

import {expect} from 'chai';
import pluginsPage from './application-settings.plugins.page';

describe('Application settings page - site header section', function () {
    before(function () {
        loginPage.open('/auth');
    });
    it('should go to plugin settings page', function () {
       loginPage.login();
       myEformsPage.Navbar.advancedDropdown();
       myEformsPage.Navbar.clickonSubMenuItem('Plugin Settings');
       browser.pause(8000);

      const plugin = pluginsPage.getFirstPluginRowObj();
      expect(plugin.id).equal(1);
      expect(plugin.name).equal('Microting Customers plugin');
      expect(plugin.version).equal('1.0.0.0');
      expect(plugin.status).equal('Deaktiveret');
       // expect()

    });

    it('should activate the plugin', function () {
		const connectionString = "Server=DESKTOP-VAE20HD\SQLEXPRESS;Database=420_EFormCustomersPn;;Database=420_Angular;User ID=sa; Password=Qq1234567$;";
		loginPage.login();
        myEformsPage.Navbar.advancedDropdown();
		// click on plugin settings
        myEformsPage.Navbar.clickonSubMenuItem('Plugin Settings');
        // enter connectionstring for customers plugin
		myEformsPage.
        // select activate
        // save changes
        // see that the plugin is marked active
        // validate that the customers menu entry is now visible
        // validate that the customers index page is shown with all fields active in the header
    })
});
