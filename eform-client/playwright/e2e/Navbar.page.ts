import { Page } from '@playwright/test';

export class Navbar {
  constructor(private page: Page) {}

  async goToPluginsPage() {
    await this.page.locator('#advanced').click();
    const pluginsBtn = this.page.locator('#plugins-settings');
    await pluginsBtn.waitFor({ state: 'visible' });
    await pluginsBtn.click();
    await this.page.waitForTimeout(500);
    await this.page.locator('app-installed-plugins-page .mat-mdc-row').first().waitFor({ state: 'visible' });
  }

  async goToMyEForms() {
    await Promise.all([
      this.page.waitForResponse('**/api/templates/index'),
      this.page.waitForResponse('**/api/tags/index'),
      this.page.locator('#my-eforms').click({ force: true }),
    ]);
  }

  async logout() {
    await this.page.locator('#sign-out-dropdown').click();
    await this.page.waitForTimeout(500);
    await this.page.locator('#sign-out').click();
    await this.page.waitForTimeout(500);
  }

  async clickOnSubMenuItem(menuItem: string) {
    await this.page.locator('.fadeInDropdown').filter({ hasText: menuItem }).click();
  }

  async clickOnHeaderMenuItem(headerMenuItem: string) {
    await this.page.locator('#header').filter({ hasText: headerMenuItem }).click();
  }
}
