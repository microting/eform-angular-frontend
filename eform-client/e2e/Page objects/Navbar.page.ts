export class Navbar {
  public get applicationSettingsBtn() {
    const ele = $(`#header #application-settings`);
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public get signOutDropdown() {
    return $(`#sign-out-dropdown`);
  }
  public get advancedBtn() {
    return $('#advanced');
  }
  public get logoutBtn() {
    return $(`#sign-out`);
  }
  public get settingsBtn() {
    return $(`#settings`);
  }
  public get changePasswordBtn() {
    return $(`#change-password`);
  }
  public get userAdministrationBtn() {
    return $(`#user-management-menu`);
  }
  public get workersBtn() {
    return $(`#header #workers`);
  }
  public get sitesBtn() {
    return $(`#header #sites`);
  }
  public get foldersBtn() {
    return $(`#header #folders`);
  }
  public get pluginsBtn() {
    return $(`#header #plugins-settings`);
  }
  public get menuEditorBtn() {
    return $(`#menu-editor`);
  }
  public get securityBtn() {
    return $(`#security`);
  }
  public get deviceUsersBtn() {
    const ele = $(`#header #device-users`);
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public get entitySearchBtn() {
    const ele = $(`#header #search`);
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public get entitySelectBtn() {
    const ele = $(`#header #selectable-list`);
    ele.waitForDisplayed({timeout: 20000});
    return ele;
  }
  public get myEformsBtn() {
    return $('#header #my-eforms');
  }

  public clickOnSubMenuItem(menuItem) {
    const ele = $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`);
    ele.waitForDisplayed({timeout: 20000});
    ele.click();
  }
  public advancedDropdownClick() {
    this.advancedBtn.waitForDisplayed({timeout: 60000});
    this.advancedBtn.click();
  }
  public clickOnHeaderMenuItem(headerMenuItem) {
    return $(`//*[@id="header"]//*[text()="${headerMenuItem}"]`).$('..').$('..');
  }
  public verifyHeaderMenuItem(headerMenuItem) {
    return $(`//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`).getText();
  }  public clickOnHeaderMenuItem2(headerMenuItem) {
    return $(`//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`);
  }

  public logout() {
    this.signOutDropdown.click();
    this.logoutBtn.click();
  }

  public goToProfileSettings() {
    this.signOutDropdown.click();
    this.settingsBtn.waitForDisplayed({timeout: 5000});
    this.settingsBtn.waitForClickable({timeout: 5000});
    this.settingsBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToApplicationSettings() {
    const spinnerAnimation = $('#spinner-animation');
    spinnerAnimation.waitForDisplayed({timeout: 50000, reverse: true});
    this.advancedDropdownClick();
    this.applicationSettingsBtn.click();
    spinnerAnimation.waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToWorkers() {
    this.advancedDropdownClick();
    this.workersBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToSites() {
    this.advancedDropdownClick();
    this.sitesBtn.click();
    // browser.pause(15000);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  public goToUserAdministration() {
    this.signOutDropdown.click();
    this.userAdministrationBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToPasswordSettings() {
    this.signOutDropdown.click();
    this.changePasswordBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToEntitySelect() {
    this.advancedDropdownClick();
    this.entitySelectBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToEntitySearch() {
    this.advancedDropdownClick();
    this.entitySearchBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  }
  public goToFolderPage() {
    this.advancedDropdownClick();
    this.foldersBtn.waitForDisplayed({timeout: 5000});
    this.foldersBtn.waitForClickable({timeout: 5000});
    this.foldersBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  public goToPluginsPage() {
    this.advancedDropdownClick();
    this.pluginsBtn.click();
    // browser.pause(15000);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  public goToMenuEditorPage() {
    this.signOutDropdown.click();
    this.menuEditorBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  public goToMyEForms() {
    this.myEformsBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  public goToSecurity() {
    this.signOutDropdown.click();
    this.securityBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
}
