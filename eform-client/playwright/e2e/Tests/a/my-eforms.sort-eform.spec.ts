import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { testSorting } from '../../helper-functions';

test.describe('Main page', () => {
  let page: Page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should be able to sort by ID', async () => {
    await testSorting(await myEformsPage.idSortBtn(), '#eform-id', 'ID');
  });

  test('should be able to sort by "Created at"', async () => {
    await testSorting(
      await myEformsPage.createdAtSortBtn(),
      '#eform-created-at',
      'Created at'
    );
  });

  test('should be able to sort by "Name eForm"', async () => {
    await testSorting(await myEformsPage.eformNameSortBtn(), '#eform-label', 'Name eForm');
  });
});
