import {PageWithNavbarPage} from './PageWithNavbar.page';

export class PasswordSettings extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get oldPasswordField() {
    return browser.element('#oldPassword');
  }
  public get newPasswordField() {
    return browser.element('#newPassword');
  }
  public get newPasswordConfirmationField() {
    return browser.element('#newPasswordConfirmation');
  }
  public get saveBtn() {
    return browser.element('#changePasswordSaveBtn');
  }
  public setNewPassword() {
    this.oldPasswordField.addValue('Qq1234567$');
    browser.pause(1000);
    this.newPasswordField.addValue('2Times2WillDo');
    browser.pause(1000);
    this.newPasswordConfirmationField.addValue('2Times2WillDo');
    browser.pause(1000);
    this.saveBtn.click();
    browser.pause(12000);

  }
  public revertToOldPassword() {
    this.oldPasswordField.addValue('2Times2WillDo');
    browser.pause(1000);
    this.newPasswordField.addValue('Qq1234567$');
    browser.pause(1000);
    this.newPasswordConfirmationField.addValue('Qq1234567$');
    browser.pause(1000);
    this.saveBtn.click();
  }
}

const passwordSettings = new PasswordSettings();
export default passwordSettings;
