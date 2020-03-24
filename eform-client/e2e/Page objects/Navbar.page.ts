export class Navbar {
  public advancedDropdown() {
    $('#advanced').waitForDisplayed(60000);
    this.clickOnHeaderMenuItem('Avanceret').click();
    // return $('#advanced');

  }

  public applicationSettingsBtn() {
    $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Applikationsindstillinger')]`).click();
  }

  public clickonSubMenuItem(menuItem) {
    $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`).click();
  }
  // public get userDropdown() {
  //   return $('#userDropdown');
  // }

  public get logoutBtn() {
    // return $('#sign-out');
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Log ud')]`);
  }
  public get settingsBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Indstillinger')]`);
  }
  public get changePasswordBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Skift adgangskode')]`);
  }
  public get userAdministrationBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Brugeradministration')]`);
  }
  public get workersBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Medarbejder')]`);
  }
  public get sitesBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Lokationer')]`);
  }
  public get deviceUsersBtn() {
    return this.clickOnHeaderMenuItem2(' Enhedsbrugere ');
  }
  public get entitySelectBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Valgbar Liste')]`);
  }
  public get entitySearchBtn() {
    return $(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Søgbar Liste')]`);
  }

  public clickOnHeaderMenuItem(headerMenuItem) {
    return $(`//*[@id="header"]//*[text()="${headerMenuItem}"]`).element('..').element('..');
  }
  public verifyHeaderMenuItem(headerMenuItem) {
    return browser.getText(`//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`);
  }  public clickOnHeaderMenuItem2(headerMenuItem) {
    return $(`//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`);
  }

  public logout() {
    this.clickOnHeaderMenuItem('John Smith').click();
    // .click();
    // this.userDropdown.click();
    this.logoutBtn.click();
  }

  public goToProfileSettings() {
    this.clickOnHeaderMenuItem('John Smith').click();
    this.settingsBtn.click();
    browser.pause(8000);
  }
  public goToApplicationSettings() {
    this.advancedDropdown();
    this.applicationSettingsBtn();
    browser.pause(15000);
  }
  public goToWorkers() {
    this.advancedDropdown();
    this.workersBtn.click();
    browser.pause(15000);
  }
  public goToSites() {
    this.advancedDropdown();
    this.sitesBtn.click();
    // browser.pause(15000);
    browser.waitForVisible('#spinner-animation', 30000, true);
  }
  public goToUserAdministration() {
    this.clickOnHeaderMenuItem('John Smith').click();
    this.userAdministrationBtn.click();
    browser.pause(8000);
  }
  public goToPasswordSettings() {
    this.clickOnHeaderMenuItem('John Smith').click();
    this.changePasswordBtn.click();
    browser.pause(8000);
  }
  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    browser.pause(20000);
  }
  public goToEntitySelect() {
    this.advancedDropdown();
    this.entitySelectBtn.click();
    browser.pause(20000);
  }
  public goToEntitySearch() {
    this.advancedDropdown();
    this.entitySearchBtn.click();
    browser.pause(20000);
  }
}
