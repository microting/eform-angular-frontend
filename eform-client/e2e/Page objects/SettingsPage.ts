import {SiteInformation} from './SettingsPageObjects/SiteInformation';
import {SiteHeader} from './SettingsPageObjects/SiteHeader';
import {LoginPage} from './SettingsPageObjects/LoginPage';
import {SMTPInformation} from './SettingsPageObjects/SMTPInformation';
import {by, ElementFinder, element, $, browser, protractor} from 'protractor';
import {By} from '@angular/platform-browser';


export class SettingsPage {
  // 4 general sections on Settings page
  public LoginPage: LoginPage;
  public SiteHeader: SiteHeader;
  public SiteInformation: SiteInformation;
  public SMTPInformation: SMTPInformation;
  // matchers
  public headerImageMatcher: By;
  public mainTextHeaderMatcher: By;
  public secondaryTextHeaderMatcher: By;
  // elements
  public saveButton: ElementFinder;
  public headerMainText: ElementFinder;
  public headerSecondaryText: ElementFinder;
  public fileInput: ElementFinder;

  // helper functions
  public saveAndRefresh(): void {
    this.saveButton.click();
    browser.wait(protractor.ExpectedConditions.elementToBeClickable(this.saveButton));
    browser.refresh();
    browser.waitForAngular();
  }

  constructor() {
    // parts of settings
    this.SiteHeader = new SiteHeader();
    this.LoginPage = new LoginPage();
    // matchers
    this.headerImageMatcher = by.xpath('//*[@id="header_full_top"]/div/div/div[1]/img');
    this.secondaryTextHeaderMatcher = by.css('#secondary-header-text');
    this.mainTextHeaderMatcher = by.css('#main-header-text');
    // elements
    this.saveButton = $('button.btn-ar.btn-danger');
    this.headerMainText = element(this.mainTextHeaderMatcher);
    this.headerSecondaryText = element(this.secondaryTextHeaderMatcher);

  }
}
