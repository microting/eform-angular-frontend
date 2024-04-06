import { PageWithNavbarPage } from './PageWithNavbar.page';
import { $ } from '@wdio/globals';

export class ProfileSettings extends PageWithNavbarPage {
  constructor() {
    super();
  }

  public async languageSelector(): Promise<WebdriverIO.Element> {
    return $('#ProfileLanguageSelector');
  }

  public async saveBtn(): Promise<WebdriverIO.Element> {
    return $('#ProfileSettingsSaveBtn');
  }

  public async saveProfileSettings() {
    await (await this.saveBtn()).click();
    // browser.pause(12000);
    await (await $('#sign-out-dropdown')).waitForDisplayed({ timeout: 40000 });
    await browser.pause(1000);
  }
  public async chooseLanguage(language: string) {
    await (await this.languageSelector()).click();
    await browser.pause(2000);
    await (await $(`//*["ng-dropdown-panel"]//*[text()="${language}"]`)).click();
    await browser.pause(1000);
  }
}
const profileSettings = new ProfileSettings();
export default profileSettings;
