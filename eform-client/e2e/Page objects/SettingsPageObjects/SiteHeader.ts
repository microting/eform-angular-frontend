import {$, browser, by, element, ElementFinder} from 'protractor';

export class SiteHeader {
  public resetButton: ElementFinder;
  public headerImageHideButton: ElementFinder;
  public mainTextInput: ElementFinder;
  public secondaryTextInput: ElementFinder;
  public hideMainTextButton: ElementFinder;
  public hideSecondaryTextButton: ElementFinder;
  public fileInput: ElementFinder;

  public async resetAndRefresh(): Promise<void> {
    await browser.sleep(2000);
    await this.resetButton.click();
    await browser.refresh();
    await browser.waitForAngularEnabled();
  }

  constructor() {
    this.headerImageHideButton = $('#imageSiteHeaderHide');
    this.resetButton = $('#siteHeaderReset');
    this.mainTextInput = $('#headerSettingsMainText');
    this.secondaryTextInput = $('#headerSettingsSecondaryText');
    this.hideMainTextButton = $('#mainTextSiteHeaderHide');
    this.hideSecondaryTextButton = $('#secondaryTextSiteHeaderHide');
    this.fileInput = $('#siteHeaderFileInput');
  }
}
