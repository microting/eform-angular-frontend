import { Page, Locator } from '@playwright/test';

export default class BasePage {
  public page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async open(path: string) {
    const baseURL = 'http://localhost:4200';
    const url = path.startsWith('http') ? path : `${baseURL}${path}`;
    await this.page.goto(url);
  }

  public spinnerAnimation(): Locator {
    return this.page.locator('#spinner-animation');
  }

  public async waitForSpinnerHide(timeout: number = 90000) {
    try {
      await this.spinnerAnimation().waitFor({ state: 'hidden', timeout });
    } catch {
      // Spinner may not appear at all, which is fine
    }
  }

  public async waitForSpinnerShow(timeout: number = 90000) {
    await this.spinnerAnimation().waitFor({ state: 'visible', timeout: timeout });
  }
}
