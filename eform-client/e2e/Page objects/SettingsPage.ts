import {SiteInformation} from './SettingsPageObjects/SiteInformation';
import {SiteHeader} from './SettingsPageObjects/SiteHeader';
import {LoginPage} from './SettingsPageObjects/LoginPage';
import {SMTPInformation} from './SettingsPageObjects/SMTPInformation';
import {by, ElementFinder, element, $} from 'protractor';
import {By} from '@angular/platform-browser';


export class SettingsPage {
  public LoginPage: LoginPage;
  public SiteHeader: SiteHeader;
  public SiteInformation: SiteInformation;
  public SMTPInformation: SMTPInformation;
  public headerImageMatcher: By;
  public saveButton: ElementFinder;

  constructor() {
    this.headerImageMatcher = by.xpath('//*[@id="header_full_top"]/div/div/div[1]/img');
    this.saveButton = $('button.btn-ar.btn-danger');
    this.SiteHeader = new SiteHeader();
  }
}
