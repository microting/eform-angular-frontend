import { test as base } from '@playwright/test';
import { LoginPage } from './Login.page';
import { PluginPage } from './Plugin.page';

export const test = base.extend<{ loginPage: LoginPage; pluginPage: PluginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  pluginPage: async ({ page }, use) => {
    await use(new PluginPage(page));
  },
});

export { expect } from '@playwright/test';
