import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { MyEformsPage } from '../../../Page objects/MyEforms.page';
import { PluginPage } from '../../../Page objects/Plugin.page';

let page;

test.describe('Kanban Plugin - Activation', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });
  test.afterAll(async () => { await page.close(); });

  test('should go to plugin settings page', async () => {
    const loginPage = new LoginPage(page);
    const myEformsPage = new MyEformsPage(page);
    const pluginPage = new PluginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToPluginsPage();
    const plugin = await pluginPage.getFirstPluginRowObj();
    expect(plugin.id).toBe(1);
  });

  test('should activate the plugin', async () => {
    test.setTimeout(240000);
    const pluginPage = new PluginPage(page);
    const plugin = await pluginPage.getFirstPluginRowObj();
    // If already enabled (e.g. CI pre-activates), skip toggling
    if (plugin.status.trim() !== 'toggle_on') {
      await plugin.enableOrDisablePlugin();
    }
    const pluginAfter = await pluginPage.getFirstPluginRowObj();
    expect(pluginAfter.status.trim()).toBe('toggle_on');
  });
});
