import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';

import { expect } from 'chai';
import { $ } from '@wdio/globals';

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
    // Helper function to activate a plugin by index using action menu
    const activatePlugin = async (index: number, pluginName: string) => {
      // Open action menu
      const actionMenuBtn = await $(`#action-items-${index - 1}`).$('#actionMenu');
      await actionMenuBtn.waitForDisplayed({ timeout: 40000 });
      await actionMenuBtn.waitForClickable({ timeout: 40000 });
      await actionMenuBtn.click();
      await browser.pause(500);
      
      // Click on the status button inside the menu
      const statusBtn = await $(`#plugin-status-button${index - 1}`);
      await statusBtn.waitForDisplayed({ timeout: 40000 });
      await statusBtn.waitForClickable({ timeout: 40000 });
      await statusBtn.click();
      await browser.pause(500);
      
      // Confirm activation in the modal
      const pluginOKBtn = await $('#pluginOKBtn');
      await pluginOKBtn.waitForDisplayed({ timeout: 40000 });
      await pluginOKBtn.click();
      await browser.pause(100000); // We need to wait 100 seconds for the plugin to create db etc.
      
      // Re-login and navigate back to plugins page
      await loginPage.open('/');
      await loginPage.login();
      await myEformsPage.Navbar.goToPluginsPage();
      await browser.pause(500);
    };

    // Helper function to check plugin status via action menu
    const checkPluginStatus = async (index: number, expectedStatus: string, pluginName: string) => {
      // Open action menu
      const actionMenuBtn = await $(`#action-items-${index - 1}`).$('#actionMenu');
      await actionMenuBtn.waitForDisplayed({ timeout: 40000 });
      await actionMenuBtn.waitForClickable({ timeout: 40000 });
      await actionMenuBtn.click();
      await browser.pause(500);
      
      // Check status
      const statusBtn = await $(`#plugin-status-button${index - 1}`);
      await statusBtn.waitForDisplayed({ timeout: 40000 });
      const statusIcon = await statusBtn.$('mat-icon');
      const status = await statusIcon.getText();
      expect(status, `${pluginName} status is not ${expectedStatus}`).eq(expectedStatus);
      
      // Close the menu
      await browser.keys(['Escape']);
      await browser.pause(300);
    };

    // Find and activate Microting Items Planning Plugin
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Items Planning Plugin') {
        await activatePlugin(i, plugin.name);
        break;
      }
    }

    // Find and activate Microting Time Planning Plugin
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Time Planning Plugin') {
        await activatePlugin(i, plugin.name);
        break;
      }
    }

    // Find and activate Microting Backend Configuration Plugin
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Backend Configuration Plugin') {
        await activatePlugin(i, plugin.name);
        break;
      }
    }

    // Verify all plugins are activated
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Items Planning Plugin') {
        await checkPluginStatus(i, 'toggle_on', plugin.name);
        break;
      }
    }
    
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Time Planning Plugin') {
        await checkPluginStatus(i, 'toggle_on', plugin.name);
        break;
      }
    }
    
    for (let i = 1; i < 10; i++) {
      const plugin = await pluginPage.getPluginRowObjByIndex(i);
      if (plugin.name === 'Microting Backend Configuration Plugin') {
        await checkPluginStatus(i, 'toggle_on', plugin.name);
        break;
      }
    }
  });
});
