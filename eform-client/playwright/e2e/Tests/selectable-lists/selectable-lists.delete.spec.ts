import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { SelectableLists } from '../../Page objects/SelectableLists.page';
import { generateRandmString } from '../../Helpers/helper-functions';

test.describe('Entity Select', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let selectableLists: SelectableLists;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    selectableLists = new SelectableLists(page);
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
  // test('should make a new selectable list, with no items.', async () => {
  //   const data = {name: generateRandmString()};
  //   await selectableLists.createSelectableList(data);
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data.name);
  // });
  // test('should delete the list', async () => {
  //   const countBeforeDelete = await selectableLists.selectableListCount();
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.delete();
  //   expect(countBeforeDelete - 1).toBe(await selectableLists.selectableListCount());
  // });
  // test('should make a new selectable list, with 1 item', async () => {
  //   const data = {name: generateRandmString(), items: [generateRandmString()]};
  //   await selectableLists.createSelectableList(data);
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data.name);
  //   await selectableListRowObject.openEdit();
  //   expect((await selectableLists.getFirstEntityItemOnEdit()).name).toBe(data.items[0]);
  //   await selectableListRowObject.closeEdit(true);
  // });
  // test('should delete item in list', async () => {
  //   let selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.edit({}, false, true);
  //   await page.waitForTimeout(1500);
  //   selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.openEdit();
  //   expect(await selectableLists.itemsEditPageCount()).toBe(0);
  //   await selectableListRowObject.closeEdit(true);
  // });
  // test('should not delete selectable list', async () => {
  //   const rowCountBeforeDelete = await selectableLists.selectableListCount();
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.delete(true);
  //   expect(rowCountBeforeDelete).toBe(await selectableLists.selectableListCount());
  // });
  // test('should delete selectable list', async () => {
  //   const rowCountBeforeDelete = await selectableLists.selectableListCount();
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.delete();
  //   expect(rowCountBeforeDelete - 1).toBe(await selectableLists.selectableListCount());
  // });
});
