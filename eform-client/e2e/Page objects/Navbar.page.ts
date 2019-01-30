export class Navbar {
  public advancedDropdown() {
    this.clickOnHeaderMenuItem('Avanceret').click();
    // return browser.element('#advanced');

  }

  public applicationSettingsBtn() {
    browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Applikationsindstillinger')]`).click();
  }

  public clickonSubMenuItem(menuItem) {
    browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`).click();
  }
  // public get userDropdown() {
  //   return browser.element('#userDropdown');
  // }

  public get logoutBtn() {
    // return browser.element('#sign-out');
    return browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Log ud')]`);
  }
  public get settingsBtn() {
    return browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Indstillinger')]`);
  }
  public get changePasswordBtn() {
    return browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Skift adgangskode')]`);
  }
  public get deviceUsersBtn() {
    return this.clickOnHeaderMenuItem(' Enhedsbrugere ');
  }

  public clickOnHeaderMenuItem(headerMenuItem) {
    return browser.element(`//*[@id="header"]//*[text()="${headerMenuItem}"]`).element('..').element('..');
  }
  public verifyHeaderMenuItem(headerMenuItem) {
    return browser.element(`//*[@id="header"]//*[text()="${headerMenuItem}"]`);
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
  public goToPasswordSettings() {
    this.clickOnHeaderMenuItem('John Smith').click();
    this.changePasswordBtn.click();
    browser.pause(8000);
  }
  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    browser.pause(20000);
  }
}
