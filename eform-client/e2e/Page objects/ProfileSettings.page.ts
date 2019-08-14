import {PageWithNavbarPage} from './PageWithNavbar.page';

export class ProfileSettings extends PageWithNavbarPage {
  constructor() {
    super();
  }

public get languageSelector() {
    return browser.element('#ProfileLanguageSelector');
}

public get saveBtn() {
    return browser.element('#ProfileSettingsSaveBtn');
}

public saveProfileSettings() {
    this.saveBtn.click();
    // browser.pause(12000);
  browser.waitForVisible('#sign-out-dropdown', 20000);
  browser.pause(1000);
}
public chooseLanguage(language: string) {
    this.languageSelector.click();
    browser.pause(2000);
  browser.element(`//*[@id="ProfileLanguageSelector"]//*[text()="${language}"]`).click();
    browser.pause(1000);
}
}
const profileSettings = new ProfileSettings();
export default profileSettings;
