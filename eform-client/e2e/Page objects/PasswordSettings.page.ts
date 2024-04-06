import {PageWithNavbarPage} from './PageWithNavbar.page';
import { $ } from '@wdio/globals';

export class PasswordSettings extends PageWithNavbarPage {
  constructor() {
    super();
  }
  public async oldPasswordField(): Promise<WebdriverIO.Element> {
    return $('#oldPassword');
  }
  public async newPasswordField(): Promise<WebdriverIO.Element> {
    return $('#newPassword');
  }
  public async newPasswordConfirmationField(): Promise<WebdriverIO.Element> {
    return $('#newPasswordConfirmation');
  }
  public async saveBtn(): Promise<WebdriverIO.Element> {
    return $('#changePasswordSaveBtn');
  }
  public async setNewPassword() {
    await (await this.oldPasswordField()).addValue('secretpassword');
    await browser.pause(1000);
    await (await this.newPasswordField()).addValue('2Times2WillDo');
    await browser.pause(1000);
    await (await this.newPasswordConfirmationField()).addValue('2Times2WillDo');
    await browser.pause(1000);
    await (await this.saveBtn()).click();
    await browser.pause(2000);

  }
  public async revertToOldPassword() {
    await (await this.oldPasswordField()).addValue('2Times2WillDo');
    await browser.pause(1000);
    await (await this.newPasswordField()).addValue('secretpassword');
    await browser.pause(1000);
    await (await this.newPasswordConfirmationField()).addValue('secretpassword');
    await browser.pause(1000);
    await (await this.saveBtn()).click();
    await browser.pause(2000);
  }
}

const passwordSettings = new PasswordSettings();
export default passwordSettings;
