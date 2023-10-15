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
    //await (await $('#plugin-name')).waitForDisplayed({ timeout: 50000 });

    const plugin = await pluginPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Workflow Plugin');
    expect(plugin.status, 'status is not equal').eq('toggle_off');
  });

  it('should activate the plugin', async () => {
    let plugin = await pluginPage.getFirstPluginRowObj();
    await plugin.enableOrDisablePlugin();

    // $('Microting Items Planning Plugin').waitForDisplayed({timeout: 10000});
    plugin = await pluginPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Workflow Plugin');
    expect(plugin.status, 'status is not equal').eq('toggle_on');
  });
});
