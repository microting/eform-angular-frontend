import {$, by, element, ElementFinder} from 'protractor';

export class MainPage {

  advancedButton: ElementFinder;
  settingsButton: ElementFinder;
  headerImage: ElementFinder;

  constructor() {
    this.advancedButton = element(by.xpath('//*[@id="bs-example-navbar-collapse-1"]/ul/li[3]/a'));
    this.settingsButton = $('a[href="/settings"]');
    this.headerImage = element(by.xpath('//*[@id="header_full_top"]/div/div/div[1]/img'));
  }
}
