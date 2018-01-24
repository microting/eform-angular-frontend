import {by, element, ElementFinder} from 'protractor';

export class SiteHeader {
  public resetButton: ElementFinder;
  public logoButton: ElementFinder;

  constructor() {
    this.logoButton = element(by.xpath('/html/body/eform-root/eform-fulllayout/app-admi' +
            'n-settings/div/div/form/div[1]/div/div[2]/div/table/tbody/tr[3]/td[2]/div/div[3]/span'));
    this.resetButton = element(by.xpath('/html/body/eform-root/eform-fulllayout/app-admin-settings/div/div/form/' +
            'div[1]/div/div[2]/div/div/div/div[2]/button'));
  }
}
