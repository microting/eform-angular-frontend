import {PageWithNavbarPage} from './PageWithNavbar.page';

export class PasswordSettings extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public get oldPasswordField() {
    return $('#oldPassword');
  }
  public get newPasswordField() {
    return $('#newPassword');
  }
  public get newPasswordConfirmationField() {
    return $('#newPasswordConfirmation');
  }
  public get saveBtn() {
    return $('#changePasswordSaveBtn');
  }
  public setNewPassword() {
    this.oldPasswordField.addValue('Qq1234567$');
    browser.pause(1000);
    this.newPasswordField.addValue('2Times2WillDo');
    browser.pause(1000);
    this.newPasswordConfirmationField.addValue('2Times2WillDo');
    browser.pause(1000);
    this.saveBtn.click();
    browser.pause(2000);

  }
  public revertToOldPassword() {
    this.oldPasswordField.addValue('2Times2WillDo');
    browser.pause(1000);
    this.newPasswordField.addValue('Qq1234567$');
    browser.pause(1000);
    this.newPasswordConfirmationField.addValue('Qq1234567$');
    browser.pause(1000);
    this.saveBtn.click();
    browser.pause(2000);
  }
}

const passwordSettings = new PasswordSettings();
export default passwordSettings;
