export default class Page {
  constructor() {
  }

  async open(path) {
    await browser.url(path);
  }

  public async spinnerAnimation() {
    return await $('#spinner-animation');
  }

  public async waitForSpinnerHide(timeout: number = 90000) {
    await (await this.spinnerAnimation()).waitForDisplayed({timeout: timeout, reverse: true});
  }

  public async waitForSpinnerShow(timeout: number = 90000) {
    await (await this.spinnerAnimation()).waitForDisplayed({timeout: timeout});
  }
}
