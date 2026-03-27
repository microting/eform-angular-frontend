import { test, expect } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';
import { SelectableListsPage } from '../Page objects/SelectableLists.page';
import { generateRandmString } from '../helper-functions';

test.describe('Entity Select', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let selectableLists: SelectableListsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    selectableLists = new SelectableListsPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToEntitySelect();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should assert true is true', () => {
    expect(true).toBeTruthy();
  });
});
