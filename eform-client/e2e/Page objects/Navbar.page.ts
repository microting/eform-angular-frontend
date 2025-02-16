import path from 'path';
import { $ } from '@wdio/globals';

export class Navbar {

  public async takeScreenshot() {
    const timestamp = new Date().toLocaleString('iso', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/[ ]/g, '--').replace(':', '-');

    // get current test title and clean it, to use it as file name
    const filename = encodeURIComponent(
      `chrome-${timestamp}`.replace(/[/]/g, '__')
    ).replace(/%../, '.');

    const filePath = path.resolve('./', `${filename}.png`);

    console.log('Saving screenshot to:', filePath);
    await browser.saveScreenshot(filePath);
    console.log('Saved screenshot to:', filePath);
  }

  public async header() {
    const ele = await $(`#header`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async applicationSettingsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#application-settings`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async signOutDropdown(): Promise<WebdriverIO.Element> {
    const ele = await $(`#sign-out-dropdown`);
    // await ele.waitForDisplayed({ timeout: 40000 });
    // await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async advancedBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#advanced`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async logoutBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#sign-out`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async settingsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#settings`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async changePasswordBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#change-password`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async userAdministrationBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#user-management-menu`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async workersBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#workers`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async sitesBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#sites`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async foldersBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#folders`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async pluginsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#plugins-settings`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async menuEditorBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#menu-editor`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async securityBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#security`);
    await ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public async deviceUsersBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#device-users`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySearchBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#search`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async entitySelectBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#selectable-list`);
    await ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public async myEformsBtn(): Promise<WebdriverIO.Element> {
    const ele = await $(`#my-eforms`);
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async clickOnSubMenuItem(menuItem) {
    const ele = await $(
      `//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    ele.click();
  }

  public async advancedDropdownClick() {
    await (await this.advancedBtn()).waitForDisplayed({ timeout: 60000 });
    await (await this.advancedBtn()).click();
    await browser.pause(500);
  }

  public async clickOnHeaderMenuItem(headerMenuItem) {
    return $(`//*[@id="header"]//*[text()="${headerMenuItem}"]`)
      .$('..')
      .$('..');
  }

  public async verifyHeaderMenuItem(headerMenuItem) {
    return $(
      `//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`
    ).getText();
  }

  public async clickOnHeaderMenuItem2(headerMenuItem) {
    const ele = await $(
      `//*[mat-tree-node]//*[contains(text(), '${headerMenuItem}')]`
      //`//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`
    );
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async logout() {
    await (await this.signOutDropdown()).click();
    await browser.pause(500);
    await (await this.logoutBtn()).click();
    await browser.pause(500);
  }

  public async goToProfileSettings() {
    await (await this.signOutDropdown()).click();
    await (await this.settingsBtn()).waitForDisplayed({ timeout: 5000 });
    await (await this.settingsBtn()).waitForClickable({ timeout: 5000 });
    await browser.pause(500);
    await (await this.settingsBtn()).click();
    await browser.pause(500);
  }

  public async goToApplicationSettings() {
    if (!await $(`#application-settings`).isDisplayed()) {
      await this.advancedDropdownClick();
    }
    await (await this.applicationSettingsBtn()).click();
    await browser.pause(500);
  }

  public async goToWorkers() {
    await this.advancedDropdownClick();
    await (await this.workersBtn()).click();
    await browser.pause(500);
  }

  public async goToSites() {
    await this.advancedDropdownClick();
    await (await this.sitesBtn()).click();
    // browser.pause(15000);
    await browser.pause(500);
  }

  public async goToUserAdministration() {
    await (await this.signOutDropdown()).click();
    await (await this.userAdministrationBtn()).waitForDisplayed({ timeout: 5000 });
    await (await this.userAdministrationBtn()).waitForClickable({ timeout: 5000 });
    await (await this.userAdministrationBtn()).click();
    await browser.pause(500);
  }

  public async goToPasswordSettings() {
    await (await this.signOutDropdown()).click();
    await (await this.changePasswordBtn()).click();
    await browser.pause(500);
  }

  public async goToDeviceUsersPage() {
    await (await this.deviceUsersBtn()).click();
    await browser.pause(500);
  }

  public async goToEntitySelect() {
    await this.advancedDropdownClick();
    await (await this.entitySelectBtn()).click();
    await this.waitForSpinnerHide();
    await browser.pause(500);
  }

  public async goToEntitySearch() {
    await this.advancedDropdownClick();
    await (await this.entitySearchBtn()).click();
    await browser.pause(500);
  }

  public async goToFolderPage() {
    if (await (await $(`#folders`)).isDisplayed()) {
      await (await this.foldersBtn()).click();
      await browser.pause(500);
    } else {
      await this.advancedDropdownClick();
      await (await this.foldersBtn()).waitForDisplayed({ timeout: 40000 });
      await (await this.foldersBtn()).waitForClickable({ timeout: 40000 });
      await (await this.foldersBtn()).click();
      await browser.pause(500);
    }
  }

  public async goToPluginsPage() {
    await this.advancedDropdownClick();
    await (await this.pluginsBtn()).click();
    // browser.pause(15000);
  }

  public async goToMenuEditorPage() {
    await (await this.signOutDropdown()).click();
    await (await this.menuEditorBtn()).click();
  }

  public async goToMyEForms() {
    await (await this.myEformsBtn()).click();
  }

  public async goToSecurity() {
    await (await this.signOutDropdown()).click();
    await (await this.securityBtn()).click();
  }

  public async spinnerAnimation() {
    return $('#spinner-animation');
  }

  public async waitForSpinnerHide(timeout: number = 90000) {

    // do a while loop to wait for the spinner to hide for the given timeout
    let i = 1000;
    // while (i <= timeout) {
    //   if (await (await this.spinnerAnimation()).isDisplayed()) {
    //     await browser.pause(1000);
    //     i += 1000;
    //   } else {
    //     break;
    //   }
    // }

    // TODO: This is not working as expected, probably because of this bug https://github.com/webdriverio/webdriverio/issues/13253
    //await (await this.spinnerAnimation()).waitForDisplayed({timeout: timeout, reverse: true});
  }
}
