import {$, browser, by, element, ElementFinder} from 'protractor';

export class SiteHeader {
  public resetButton: ElementFinder;
  public headerImageHideButton: ElementFinder;
  public mainTextInput: ElementFinder;
  public secondaryTextInput: ElementFinder;
  public hideMainTextButton: ElementFinder;
  public hideSecondaryTextButton: ElementFinder;
  public secondaryTextHeader: ElementFinder;

  public resetAndRefresh(): void {
    browser.sleep(2000);
    this.resetButton.click();
    browser.refresh();
    browser.waitForAngularEnabled();
  }

  constructor() {
    this.headerImageHideButton = $('#imageSiteHeaderHide');
    this.resetButton = $('#siteHeaderReset');
    this.mainTextInput = $('#headerSettingsMainText');
    this.secondaryTextInput = $('#headerSettingsSecondaryText');
    this.hideMainTextButton = $('#mainTextSiteHeaderHide');
    this.hideSecondaryTextButton = $('#secondaryTextSiteHeaderHide');
  }
}
