export class Navbar {
  public advancedDropdown() {
    this.clickOnHeaderMenuItem('Advanced');
    // return browser.element('#advanced');

  }

  public applicationSettingsBtn() {
    browser.element(`//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), 'Application Settings')]`).click();
  }

  public get userDropdown() {
    return browser.element('#userDropdown');
  }

  public get logoutBtn() {
    return browser.element('#sign-out');
  }

  public get deviceUsersBtn() {
    return browser.element('#device-users');
  }

  public clickOnHeaderMenuItem(headerMenuItem) {
    browser.element(`//*[@id="header"]//*[text()="${headerMenuItem}"]`).element('..').element('..').click();
  }

  public logout() {
    this.userDropdown.click();
    this.logoutBtn.click();
  }

  public goToApplicationSettings() {
    this.advancedDropdown();
    this.applicationSettingsBtn();
    browser.pause(25000);
  }

  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    browser.pause(20000);
  }
}
