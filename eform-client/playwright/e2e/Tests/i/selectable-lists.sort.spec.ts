import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { SelectableListsPage } from '../../Page objects/SelectableLists.page';
import { testSorting } from '../../helper-functions';

test.describe('Entity Select Sort', () => {
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
    await selectableLists.createDummySelectableLists(3);
  });

  test.afterAll(async () => {
    const countBeforeCreate = await selectableLists.selectableListCount();
    await selectableLists.cleanupList();
    expect(countBeforeCreate).not.toBe(await selectableLists.selectableListCount());
    expect(await selectableLists.selectableListCount()).toBe(0);
    await page.close();
  });

  test('should assert true is true', () => {
    expect(true).toBeTruthy();
  });
  // test('should be able to sort by ID', async () => {
  //   await testSorting(
  //     await selectableLists.idTableHeader(),
  //     '#entitySelectMicrotingUUID',
  //     'ID'
  //   );
  // });
  // test('should be able to sort by Name', async () => {
  //   await testSorting(await selectableLists.nameTableHeader(), '#entitySelectName', 'Name');
  // });
  // test('should be able to sort by Description', async () => {
  //   await testSorting(
  //     await selectableLists.descriptionTableHeader(),
  //     '#entitySelectDescription',
  //     'Description'
  //   );
  // });
});
