//import path from 'path';
import { $ } from '@wdio/globals';

export default class Page {
  constructor() {
  }

  // public async takeScreenshot() {
  //   const timestamp = new Date().toLocaleString('iso', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit',
  //     hour: '2-digit',
  //     minute: '2-digit',
  //     hour12: false
  //   }).replace(/[ ]/g, '--').replace(':', '-');
  //
  //   // get current test title and clean it, to use it as file name
  //   const filename = encodeURIComponent(
  //     `chrome-${timestamp}`.replace(/[/]/g, '__')
  //   ).replace(/%../, '.');
  //
  //   const filePath = path.resolve('./', `${filename}.png`);
  //
  //   console.log('Saving screenshot to:', filePath);
  //   await browser.saveScreenshot(filePath);
  //   console.log('Saved screenshot to:', filePath);
  // }

  async open(path: string) {
    await browser.url(path);
  }

  public async spinnerAnimation() {
    return $('#spinner-animation');
  }

  public async waitForSpinnerHide(timeout: number = 90000) {
    // do a while loop to wait for the spinner to hide for the given timeout
    let i = 1000;
    // while (i <= timeout) {
    //   if (await (await this.spinnerAnimation()).isDisplayed()) {
    //     await browser.pause(1000);
    //     i += 1000;
    //   } else {
    //     break;
    //   }
    // }

    // TODO: This is not working as expected, probably because of this bug https://github.com/webdriverio/webdriverio/issues/13253
    //await (await this.spinnerAnimation()).waitForDisplayed({timeout: timeout, reverse: true});
  }

  public async waitForSpinnerShow(timeout: number = 90000) {
    await (await this.spinnerAnimation()).waitForDisplayed({timeout: timeout});
  }
}
