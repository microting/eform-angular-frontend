export class Navbar {
  public advancedDropdown() {
    this.clickOnHeaderMenuItem('Avanceret').click();
    // return browser.element('#advanced');

  }

  public applicationSettingsBtn() {
    browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Applikationsindstillinger')]`).click();
  }

  // public get userDropdown() {
  //   return browser.element('#userDropdown');
  // }

  public get logoutBtn() {
    // return browser.element('#sign-out');
    return browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Log ud')]`);
  }

  public get deviceUsersBtn() {
    return browser.element('#device-users');
  }

  public clickOnHeaderMenuItem(headerMenuItem) {
    return browser.element(`//*[@id="header"]//*[text()="${headerMenuItem}"]`).element('..').element('..');
  }

  public logout() {
    this.clickOnHeaderMenuItem('John Smith').click();
    // .click();
    // this.userDropdown.click();
    this.logoutBtn.click();
  }

  public goToApplicationSettings() {
    this.advancedDropdown();
    this.applicationSettingsBtn();
    browser.pause(15000);
  }

  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    browser.pause(20000);
  }
}
