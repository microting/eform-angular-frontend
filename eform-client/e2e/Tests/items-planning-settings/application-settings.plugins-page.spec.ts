import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import pluginPage from '../../Page objects/Plugin.page';
import { $ } from '@wdio/globals';

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
    expect(plugin.name).equal('Microting Items Planning Plugin');
    expect(plugin.version).equal('1.0.0.0');
    
    // Open action menu to check status
    const actionMenuBtn = await $('#action-items-0').$('#actionMenu');
    await actionMenuBtn.waitForDisplayed({ timeout: 40000 });
    await actionMenuBtn.waitForClickable({ timeout: 40000 });
    await actionMenuBtn.click();
    await browser.pause(500);
    
    const statusBtn = await $('#plugin-status-button0');
    await statusBtn.waitForDisplayed({ timeout: 40000 });
    const statusIcon = await statusBtn.$('mat-icon');
    const status = await statusIcon.getText();
    expect(status, 'status is not equal').eq('toggle_off');
    
    // Close the menu
    await browser.keys(['Escape']);
    await browser.pause(300);
  });

  it('should activate the plugin', async () => {
    // Open action menu
    const actionMenuBtn = await $('#action-items-0').$('#actionMenu');
    await actionMenuBtn.waitForDisplayed({ timeout: 40000 });
    await actionMenuBtn.waitForClickable({ timeout: 40000 });
    await actionMenuBtn.click();
    await browser.pause(500);
    
    // Click on the status button inside the menu
    const statusBtn = await $('#plugin-status-button0');
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
    
    // Verify the plugin is now activated
    const plugin = await pluginPage.getFirstPluginRowObj();
    expect(plugin.id).equal(1);
    expect(plugin.name).equal('Microting Items Planning Plugin');
    expect(plugin.version).equal('1.0.0.0');
    
    // Open action menu to check new status
    const actionMenuBtn2 = await $('#action-items-0').$('#actionMenu');
    await actionMenuBtn2.waitForDisplayed({ timeout: 40000 });
    await actionMenuBtn2.waitForClickable({ timeout: 40000 });
    await actionMenuBtn2.click();
    await browser.pause(500);
    
    const statusBtn2 = await $('#plugin-status-button0');
    await statusBtn2.waitForDisplayed({ timeout: 40000 });
    const statusIcon2 = await statusBtn2.$('mat-icon');
    const status = await statusIcon2.getText();
    expect(status, 'status is not equal').eq('toggle_on');
  });
});
