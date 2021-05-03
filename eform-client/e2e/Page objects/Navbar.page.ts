export class Navbar {
  public get header() {
    const ele = $(`#header`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get applicationSettingsBtn() {
    const ele = $(`#application-settings`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get signOutDropdown() {
    const ele = $(`#sign-out-dropdown`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get advancedBtn() {
    const ele = $(`#advanced`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get logoutBtn() {
    const ele = $(`#sign-out`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get settingsBtn() {
    const ele = $(`#settings`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get changePasswordBtn() {
    const ele = $(`#change-password`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get userAdministrationBtn() {
    const ele = $(`#user-management-menu`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public get workersBtn() {
    const ele = this.header.$(`#workers`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get sitesBtn() {
    const ele = this.header.$(`#sites`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get foldersBtn() {
    const ele = this.header.$(`#folders`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get pluginsBtn() {
    const ele = this.header.$(`#plugins-settings`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get menuEditorBtn() {
    const ele = $(`#menu-editor`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get securityBtn() {
    const ele = $(`#security`);
    ele.waitForDisplayed({ timeout: 20000 });
    // ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public get deviceUsersBtn() {
    const ele = this.header.$(`#device-users`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get entitySearchBtn() {
    const ele = this.header.$(`#search`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get entitySelectBtn() {
    const ele = this.header.$(`#selectable-list`);
    ele.waitForDisplayed({ timeout: 20000 });
    return ele;
  }

  public get myEformsBtn() {
    const ele = this.header.$(`#my-eforms`);
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public clickOnSubMenuItem(menuItem) {
    const ele = $(
      `//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.click();
  }

  public advancedDropdownClick() {
    this.advancedBtn.waitForDisplayed({ timeout: 60000 });
    this.advancedBtn.click();
  }

  public clickOnHeaderMenuItem(headerMenuItem) {
    return $(`//*[@id="header"]//*[text()="${headerMenuItem}"]`)
      .$('..')
      .$('..');
  }

  public verifyHeaderMenuItem(headerMenuItem) {
    return $(
      `//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`
    ).getText();
  }

  public clickOnHeaderMenuItem2(headerMenuItem) {
    const ele = $(
      `//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`
    );
    ele.waitForDisplayed({ timeout: 20000 });
    ele.waitForClickable({ timeout: 20000 });
    return ele;
  }

  public logout() {
    this.signOutDropdown.click();
    this.logoutBtn.click();
  }

  public goToProfileSettings() {
    this.signOutDropdown.click();
    this.settingsBtn.waitForDisplayed({ timeout: 5000 });
    this.settingsBtn.waitForClickable({ timeout: 5000 });
    this.settingsBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToApplicationSettings() {
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({ timeout: 50000, reverse: true });
    this.advancedDropdownClick();
    this.applicationSettingsBtn.click();
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToWorkers() {
    this.advancedDropdownClick();
    this.workersBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToSites() {
    this.advancedDropdownClick();
    this.sitesBtn.click();
    // browser.pause(15000);
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public goToUserAdministration() {
    this.signOutDropdown.click();
    this.userAdministrationBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToPasswordSettings() {
    this.signOutDropdown.click();
    this.changePasswordBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToEntitySelect() {
    this.advancedDropdownClick();
    this.entitySelectBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToEntitySearch() {
    this.advancedDropdownClick();
    this.entitySearchBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  }

  public goToFolderPage() {
    this.advancedDropdownClick();
    this.foldersBtn.waitForDisplayed({ timeout: 20000 });
    this.foldersBtn.waitForClickable({ timeout: 20000 });
    this.foldersBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public goToPluginsPage() {
    this.advancedDropdownClick();
    this.pluginsBtn.click();
    // browser.pause(15000);
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public goToMenuEditorPage() {
    this.signOutDropdown.click();
    this.menuEditorBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public goToMyEForms() {
    this.myEformsBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }

  public goToSecurity() {
    this.signOutDropdown.click();
    this.securityBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 30000, reverse: true });
  }
}
