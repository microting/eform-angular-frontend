export class Navbar {
  public get header() {
    const ele = $(`#header`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get applicationSettingsBtn() {
    const ele = $(`#application-settings`);
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get signOutDropdown() {
    const ele = $(`#sign-out-dropdown`);
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get advancedBtn() {
    const ele = $(`#advanced`);
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get logoutBtn() {
    const ele = $(`#sign-out`);
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get settingsBtn() {
    const ele = $(`#settings`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get changePasswordBtn() {
    const ele = $(`#change-password`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get userAdministrationBtn() {
    const ele = $(`#user-management-menu`);
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public get workersBtn() {
    const ele = this.header.$(`#workers`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get sitesBtn() {
    const ele = this.header.$(`#sites`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get foldersBtn() {
    const ele = this.header.$(`#folders`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get pluginsBtn() {
    const ele = this.header.$(`#plugins-settings`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get menuEditorBtn() {
    const ele = $(`#menu-editor`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get securityBtn() {
    const ele = $(`#security`);
    ele.waitForDisplayed({ timeout: 40000 });
    // ele.waitForClickable({timeout: 40000});
    return ele;
  }

  public get deviceUsersBtn() {
    const ele = this.header.$(`#device-users`);
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySearchBtn() {
    const ele = this.header.$(`#search`);
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get entitySelectBtn() {
    const ele = this.header.$(`#selectable-list`);
    ele.waitForDisplayed({ timeout: 40000 });
    return ele;
  }

  public get myEformsBtn() {
    const ele = this.header.$(`#my-eforms`);
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public clickOnSubMenuItem(menuItem) {
    const ele = $(
      `//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`
    );
    ele.waitForDisplayed({ timeout: 40000 });
    ele.click();
  }

  public async advancedDropdownClick() {
    await (await this.advancedBtn).waitForDisplayed({ timeout: 60000 });
    await (await this.advancedBtn).click();
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

  public clickOnHeaderMenuItem2(headerMenuItem) {
    const ele = $(
      `//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`
    );
    ele.waitForDisplayed({ timeout: 40000 });
    ele.waitForClickable({ timeout: 40000 });
    return ele;
  }

  public async logout() {
    await (await this.signOutDropdown).click();
    await (await this.logoutBtn).click();
  }

  public async goToProfileSettings() {
    await (await this.signOutDropdown).click();
    await (await this.settingsBtn).waitForDisplayed({ timeout: 5000 });
    await (await this.settingsBtn).waitForClickable({ timeout: 5000 });
    await (await this.settingsBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToApplicationSettings() {
    const spinnerAnimation = await $('#spinner-animation');
    await spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    await this.advancedDropdownClick();
    await (await this.applicationSettingsBtn).click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToWorkers() {
    await this.advancedDropdownClick();
    await (await this.workersBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToSites() {
    await this.advancedDropdownClick();
    await (await this.sitesBtn).click();
    // browser.pause(15000);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToUserAdministration() {
    await (await this.signOutDropdown).click();
    await (await this.userAdministrationBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToPasswordSettings() {
    await (await this.signOutDropdown).click();
    await (await this.changePasswordBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToDeviceUsersPage() {
    await (await this.deviceUsersBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToEntitySelect() {
    await this.advancedDropdownClick();
    await (await this.entitySelectBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToEntitySearch() {
    await this.advancedDropdownClick();
    await (await this.entitySearchBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToFolderPage() {
    await this.advancedDropdownClick();
    await (await this.foldersBtn).waitForDisplayed({ timeout: 40000 });
    await (await this.foldersBtn).waitForClickable({ timeout: 40000 });
    await (await this.foldersBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToPluginsPage() {
    await this.advancedDropdownClick();
    await (this.pluginsBtn).click();
    // browser.pause(15000);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToMenuEditorPage() {
    await (await this.signOutDropdown).click();
    await (await this.menuEditorBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToMyEForms() {
    await (await this.myEformsBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public async goToSecurity() {
    await (await this.signOutDropdown).click();
    await (await this.securityBtn).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  }
}
