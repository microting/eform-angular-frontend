import {PageWithNavbarPage} from './PageWithNavbar.page';

export class ProfileSettings extends PageWithNavbarPage {
  constructor() {
    super();
  }

public get languageSelector() {
    return $('#ProfileLanguageSelector');
}

public get saveBtn() {
    return $('#ProfileSettingsSaveBtn');
}

public saveProfileSettings() {
    this.saveBtn.click();
    // browser.pause(12000);
  $('#sign-out-dropdown').waitForDisplayed(20000);
  browser.pause(1000);
}
public chooseLanguage(language: string) {
    this.languageSelector.click();
    browser.pause(2000);
  $(`//*[@id="ProfileLanguageSelector"]//*[text()="${language}"]`).click();
    browser.pause(1000);
}
}
const profileSettings = new ProfileSettings();
export default profileSettings;
