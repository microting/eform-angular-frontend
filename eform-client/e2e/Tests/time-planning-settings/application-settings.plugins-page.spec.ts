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

    const backendPlugin = await pluginPage.getFirstPluginRowObj();
    expect(backendPlugin.id).equal(1);
    expect(backendPlugin.name).equal('Microting Time Planning Plugin');
    expect(backendPlugin.version).equal('1.0.0.0');
    expect(backendPlugin.status, 'status is not equal').eq('toggle_off');
  });

  it('should activate the plugin', async () => {
    let backendPlugin = await pluginPage.getFirstPluginRowObj();
    await backendPlugin.enableOrDisablePlugin();

    backendPlugin = await pluginPage.getFirstPluginRowObj();
    expect(backendPlugin.id).equal(1);
    expect(backendPlugin.name).equal('Microting Time Planning Plugin');
    expect(backendPlugin.version).equal('1.0.0.0');
    expect(
      backendPlugin.status,
      'backendConfigurationPlugin is not enabled'
    ).eq('toggle_on');
  });
});
