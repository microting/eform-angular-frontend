import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from './PageWithNavbar.page';

export class PasswordSettings extends PageWithNavbarPage {
  constructor(page: Page) {
    super(page);
  }

  public oldPasswordField(): Locator {
    return this.page.locator('#oldPassword');
  }

  public newPasswordField(): Locator {
    return this.page.locator('#newPassword');
  }

  public newPasswordConfirmationField(): Locator {
    return this.page.locator('#newPasswordConfirmation');
  }

  public saveBtn(): Locator {
    return this.page.locator('#changePasswordSaveBtn');
  }

  public async setNewPassword() {
    await this.oldPasswordField().pressSequentially('secretpassword');
    await this.page.waitForTimeout(1000);
    await this.newPasswordField().pressSequentially('2Times2WillDo');
    await this.page.waitForTimeout(1000);
    await this.newPasswordConfirmationField().pressSequentially('2Times2WillDo');
    await this.page.waitForTimeout(1000);
    await this.saveBtn().click();
    await this.page.waitForTimeout(2000);
  }

  public async revertToOldPassword() {
    await this.oldPasswordField().pressSequentially('2Times2WillDo');
    await this.page.waitForTimeout(1000);
    await this.newPasswordField().pressSequentially('secretpassword');
    await this.page.waitForTimeout(1000);
    await this.newPasswordConfirmationField().pressSequentially('secretpassword');
    await this.page.waitForTimeout(1000);
    await this.saveBtn().click();
    await this.page.waitForTimeout(2000);
  }
}
