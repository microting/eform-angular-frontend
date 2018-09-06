export class Navbar {
  public get advancedDropdown() {
    return browser.element('#advanced');
  }

  public get applicationSettingsBtn() {
    return browser.element('#application-settings');
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

  public logout() {
    this.userDropdown.click();
    this.logoutBtn.click();
  }

  public goToApplicationSettings() {
    this.advancedDropdown.click();
    this.applicationSettingsBtn.click();
    browser.pause(25000);
  }

  public goToDeviceUsersPage() {
    this.deviceUsersBtn.click();
    browser.pause(20000);
  }
}
