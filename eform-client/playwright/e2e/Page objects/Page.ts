import { Page, Locator } from '@playwright/test';

export default class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string) {
    await this.page.goto(path);
  }

  public spinnerAnimation(): Locator {
    return this.page.locator('#spinner-animation');
  }

  public async waitForSpinnerHide(timeout: number = 90000) {
    // do a while loop to wait for the spinner to hide for the given timeout
    let i = 1000;
    // while (i <= timeout) {
    //   if (await this.spinnerAnimation().isVisible()) {
    //     await this.page.waitForTimeout(1000);
    //     i += 1000;
    //   } else {
    //     break;
    //   }
    // }

    // TODO: This is not working as expected, probably because of this bug https://github.com/webdriverio/webdriverio/issues/13253
    //await this.spinnerAnimation().waitFor({state: 'hidden', timeout: timeout});
  }

  public async waitForSpinnerShow(timeout: number = 90000) {
    await this.spinnerAnimation().waitFor({ state: 'visible', timeout: timeout });
  }
}
