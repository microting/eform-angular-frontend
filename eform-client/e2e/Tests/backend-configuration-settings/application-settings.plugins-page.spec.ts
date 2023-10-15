import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';

import { expect } from 'chai';

describe('Application settings page - site header section', function () {
  before(async () => {
    await loginPage.open('/auth');
  });
  it('should go to plugin settings page', async () => {
    await loginPage.login();
    await myEformsPage.Navbar.goToPluginsPage();
    await (await $('#plugin-name0')).waitForDisplayed({ timeout: 50000 });

    let plugin = await pluginPage.getFirstPluginRowObj();
  });

  it('should activate the plugin', async () => {
    let plugin = await pluginPage.getFirstPluginRowObj();
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Items Planning Plugin') {
        await plugin.enableOrDisablePlugin();
        break;
      }
    }
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Time Planning Plugin') {
        await plugin.enableOrDisablePlugin();
        break;
      }
    }
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Backend Configuration Plugin') {
        await plugin.enableOrDisablePlugin();
        break;
      }
    }

    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Items Planning Plugin') {
        expect(plugin.status, 'Microting Items Planning Plugin is not enabled').eq('toggle_on');
        break;
      }
    }
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Time Planning Plugin') {
        expect(plugin.status, 'Microting Time Planning Plugin is not enabled').eq('toggle_on');
        break;
      }
    }
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Backend Configuration Plugin') {
        expect(plugin.status, 'Microting Backend Configuration Plugin is not enabled').eq('toggle_on');
        break;
      }
    }
  });
});
