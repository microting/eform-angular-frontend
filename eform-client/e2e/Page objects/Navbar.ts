import {$, by, element, ElementFinder} from 'protractor';

export class Navbar {

  advancedButton: ElementFinder;
  settingsButton: ElementFinder;
  deviceUsersButton: ElementFinder;
  headerImage: ElementFinder;
  signOutDropdown: ElementFinder;
  signOutButton: ElementFinder;

  constructor() {
    this.advancedButton = element(by.xpath('//*[@id="bs-example-navbar-collapse-1"]/ul/li[3]/a'));
    this.settingsButton = $('a[href="/settings"]');
    this.deviceUsersButton = $('a[href="/simplesites"]');
    this.headerImage = element(by.xpath('//*[@id="header_full_top"]/div/div/div[1]/img'));
    this.signOutDropdown = $('#sign-out-dropdown');
    this.signOutButton = $('#sign-out');
  }
}
