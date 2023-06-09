export class Navbar {
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
    await ele.waitForDisplayed({ timeout: 40000 });
    await ele.waitForClickable({ timeout: 40000 });
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
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToApplicationSettings() {
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    if (!await $(`#application-settings`).isDisplayed()) {
      await this.advancedDropdownClick();
    }
    await (await this.applicationSettingsBtn()).click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToWorkers() {
    await this.advancedDropdownClick();
    await (await this.workersBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToSites() {
    await this.advancedDropdownClick();
    await (await this.sitesBtn()).click();
    // browser.pause(15000);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToUserAdministration() {
    await (await this.signOutDropdown()).click();
    await (await this.userAdministrationBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToPasswordSettings() {
    await (await this.signOutDropdown()).click();
    await (await this.changePasswordBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToDeviceUsersPage() {
    await (await this.deviceUsersBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToEntitySelect() {
    await this.advancedDropdownClick();
    await (await this.entitySelectBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToEntitySearch() {
    await this.advancedDropdownClick();
    await (await this.entitySearchBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
  }

  public async goToFolderPage() {
    if (await (await $(`#folders`)).isDisplayed()) {
      await (await this.foldersBtn()).click();
      await browser.pause(500);
      await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    } else {
      await this.advancedDropdownClick();
      await (await this.foldersBtn()).waitForDisplayed({ timeout: 40000 });
      await (await this.foldersBtn()).waitForClickable({ timeout: 40000 });
      await (await this.foldersBtn()).click();
      await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
      await browser.pause(500);
    }
  }

  public async goToPluginsPage() {
    await this.advancedDropdownClick();
    await (await this.pluginsBtn()).click();
    // browser.pause(15000);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToMenuEditorPage() {
    await (await this.signOutDropdown()).click();
    await (await this.menuEditorBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToMyEForms() {
    await (await this.myEformsBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToSecurity() {
    await (await this.signOutDropdown()).click();
    await (await this.securityBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }
}
