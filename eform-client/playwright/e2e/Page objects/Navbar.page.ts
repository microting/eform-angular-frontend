import path from 'path';
import { Page, Locator } from '@playwright/test';

export class Navbar {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public async takeScreenshot() {
    const timestamp = new Date().toLocaleString('iso', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/[ ]/g, '--').replace(':', '-');

    // get current test title and clean it, to use it as file name
    const filename = encodeURIComponent(
      `chrome-${timestamp}`.replace(/[/]/g, '__')
    ).replace(/%../, '.');

    const filePath = path.resolve('./errorShots/', `${filename}.png`);

    console.log('Saving screenshot to:', filePath);
    await this.page.screenshot({ path: filePath });
    console.log('Saved screenshot to:', filePath);
  }

  public header(): Locator {
    return this.page.locator(`#header`);
  }

  public async waitForHeader() {
    await this.header().waitFor({ state: 'visible', timeout: 40000 });
    return this.header();
  }

  public applicationSettingsBtn(): Locator {
    return this.page.locator(`#application-settings`);
  }

  public async waitForApplicationSettingsBtn(): Promise<Locator> {
    const ele = this.applicationSettingsBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public signOutDropdown(): Locator {
    return this.page.locator(`#sign-out-dropdown`);
  }

  public advancedBtn(): Locator {
    return this.page.locator(`#advanced`);
  }

  public async waitForAdvancedBtn(): Promise<Locator> {
    const ele = this.advancedBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public logoutBtn(): Locator {
    return this.page.locator(`#sign-out`);
  }

  public async waitForLogoutBtn(): Promise<Locator> {
    const ele = this.logoutBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public settingsBtn(): Locator {
    return this.page.locator(`#settings`);
  }

  public async waitForSettingsBtn(): Promise<Locator> {
    const ele = this.settingsBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public changePasswordBtn(): Locator {
    return this.page.locator(`#change-password`);
  }

  public async waitForChangePasswordBtn(): Promise<Locator> {
    const ele = this.changePasswordBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public userAdministrationBtn(): Locator {
    return this.page.locator(`#user-management-menu`);
  }

  public async waitForUserAdministrationBtn(): Promise<Locator> {
    const ele = this.userAdministrationBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public workersBtn(): Locator {
    return this.page.locator(`#workers`);
  }

  public async waitForWorkersBtn(): Promise<Locator> {
    const ele = this.workersBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public sitesBtn(): Locator {
    return this.page.locator(`#sites`);
  }

  public async waitForSitesBtn(): Promise<Locator> {
    const ele = this.sitesBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public foldersBtn(): Locator {
    return this.page.locator(`#folders`);
  }

  public async waitForFoldersBtn(): Promise<Locator> {
    const ele = this.foldersBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public pluginsBtn(): Locator {
    return this.page.locator(`#plugins-settings`);
  }

  public async waitForPluginsBtn(): Promise<Locator> {
    const ele = this.pluginsBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public menuEditorBtn(): Locator {
    return this.page.locator(`#menu-editor`);
  }

  public async waitForMenuEditorBtn(): Promise<Locator> {
    const ele = this.menuEditorBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public securityBtn(): Locator {
    return this.page.locator(`#security`);
  }

  public async waitForSecurityBtn(): Promise<Locator> {
    const ele = this.securityBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public deviceUsersBtn(): Locator {
    return this.page.locator(`#device-users`);
  }

  public async waitForDeviceUsersBtn(): Promise<Locator> {
    const ele = this.deviceUsersBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public entitySearchBtn(): Locator {
    return this.page.locator(`#search`);
  }

  public async waitForEntitySearchBtn(): Promise<Locator> {
    const ele = this.entitySearchBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public entitySelectBtn(): Locator {
    return this.page.locator(`#selectable-list`);
  }

  public async waitForEntitySelectBtn(): Promise<Locator> {
    const ele = this.entitySelectBtn();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public myEformsBtn(): Locator {
    return this.page.locator(`#my-eforms`);
  }

  public async waitForMyEformsBtn(): Promise<Locator> {
    const ele = this.myEformsBtn();
    await ele.waitFor({ state: 'visible', timeout: 60000 });
    return ele;
  }

  public async clickOnSubMenuItem(menuItem: string) {
    const ele = this.page.locator(
      `//*[contains(@class, 'fadeInDropdown')]//*[contains(text(), '${menuItem}')]`
    );
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    await ele.click();
  }

  public async advancedDropdownClick() {
    await this.advancedBtn().waitFor({ state: 'visible', timeout: 60000 });
    await this.advancedBtn().click();
    await this.page.waitForTimeout(500);
  }

  public clickOnHeaderMenuItem(headerMenuItem: string): Locator {
    return this.page.locator(`//*[@id="header"]//*[text()="${headerMenuItem}"]`)
      .locator('..')
      .locator('..');
  }

  public async verifyHeaderMenuItem(headerMenuItem: string) {
    return this.page.locator(
      `//*[@id="header"]//*[contains(text(), '${headerMenuItem}')]`
    ).textContent();
  }

  public async clickOnHeaderMenuItem2(headerMenuItem: string): Promise<Locator> {
    const ele = this.page.locator(
      `//*[mat-tree-node]//*[contains(text(), '${headerMenuItem}')]`
    ).first();
    await ele.waitFor({ state: 'visible', timeout: 40000 });
    return ele;
  }

  public async logout() {
    await this.signOutDropdown().click();
    await this.page.waitForTimeout(500);
    await (await this.waitForLogoutBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToProfileSettings() {
    await this.signOutDropdown().click();
    await this.settingsBtn().waitFor({ state: 'visible', timeout: 5000 });
    await this.page.waitForTimeout(500);
    await this.settingsBtn().click();
    await this.page.waitForTimeout(500);
  }

  public async goToApplicationSettings() {
    if (!await this.page.locator(`#application-settings`).isVisible()) {
      await this.advancedDropdownClick();
    }
    await (await this.waitForApplicationSettingsBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToWorkers() {
    await this.advancedDropdownClick();
    await (await this.waitForWorkersBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToSites() {
    await this.advancedDropdownClick();
    await (await this.waitForSitesBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToUserAdministration() {
    await this.signOutDropdown().click();
    await this.userAdministrationBtn().waitFor({ state: 'visible', timeout: 5000 });
    await this.userAdministrationBtn().click();
    await this.page.waitForTimeout(500);
  }

  public async goToPasswordSettings() {
    await this.signOutDropdown().click();
    await (await this.waitForChangePasswordBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToDeviceUsersPage() {
    await (await this.waitForDeviceUsersBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToEntitySelect() {
    await this.advancedDropdownClick();
    await (await this.waitForEntitySelectBtn()).click();
    await this.waitForSpinnerHide();
    await this.page.waitForTimeout(500);
  }

  public async goToEntitySearch() {
    await this.advancedDropdownClick();
    await (await this.waitForEntitySearchBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToFolderPage() {
    if (await this.page.locator(`#folders`).isVisible()) {
      await (await this.waitForFoldersBtn()).click();
      await this.page.waitForTimeout(500);
    } else {
      await this.advancedDropdownClick();
      await this.foldersBtn().waitFor({ state: 'visible', timeout: 40000 });
      await this.foldersBtn().click();
      await this.page.waitForTimeout(500);
    }
  }

  public async goToPluginsPage() {
    if (!await this.page.locator(`#plugins-settings`).isVisible()) {
      await this.advancedDropdownClick();
    }
    await (await this.waitForPluginsBtn()).click();
    await this.page.waitForTimeout(500);
  }

  public async goToMenuEditorPage() {
    await this.signOutDropdown().click();
    await this.menuEditorBtn().click();
  }

  public async goToMyEForms() {
    await this.myEformsBtn().click({ force: true });
  }

  public async goToSecurity() {
    await this.signOutDropdown().click();
    await this.securityBtn().click();
  }

  public spinnerAnimation(): Locator {
    return this.page.locator('#spinner-animation');
  }

  public async waitForSpinnerHide(timeout: number = 90000) {
    // do a while loop to wait for the spinner to hide for the given timeout
    let i = 1000;
    // while (i <= timeout) {
    //   if (await this.spinnerAnimation().isVisible()) {
    //     await this.page.waitForTimeout(1000);
    //     i += 1000;
    //   } else {
    //     break;
    //   }
    // }

    // TODO: This is not working as expected, probably because of this bug https://github.com/webdriverio/webdriverio/issues/13253
    //await this.spinnerAnimation().waitFor({state: 'hidden', timeout: timeout});
  }
}
