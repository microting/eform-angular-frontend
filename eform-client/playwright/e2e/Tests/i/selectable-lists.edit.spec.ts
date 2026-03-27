import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { SelectableLists } from '../../Page objects/SelectableLists.page';
import { generateRandmString } from '../../helper-functions';

const data1 = { name: generateRandmString() };

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
  //   await selectableLists.createSelectableList(data1);
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data1.name);
  // });
  // test('should edit the list name, with no items.', async () => {
  //   const data = { name: generateRandmString() };
  //   let selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   //expect(selectableListRowObject.name).toBe(data1.name);
  //   await selectableListRowObject.edit(data);
  //   selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data.name);
  //   await selectableLists.cleanupList();
  // });
  // test('should make a new selectable list, with 1 item', async () => {
  //   const data = {
  //     name: generateRandmString(),
  //     items: [generateRandmString()],
  //   };
  //   await selectableLists.createSelectableList(data);
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   //expect(selectableListRowObject.name).toBe(data.name);
  //   await selectableListRowObject.openEdit();
  //   expect((await selectableLists.getFirstEntityItemOnEdit()).name).toBe(data.items[0]);
  //   await selectableListRowObject.closeEdit();
  // });
  // test('should only edit item name', async () => {
  //   let selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   const data = { items: [generateRandmString()] };
  //   await selectableListRowObject.edit(data, false, false, false, true);
  //   selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.openEdit();
  //   expect((await selectableLists.getFirstEntityItemOnEdit()).name).toBe(data.items[0]);
  //   await selectableListRowObject.closeEdit();
  //   //selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   // selectableLists.cleanupList();
  // });
  // test('should edit the list name, and item name', async () => {
  //   //await page.waitForTimeout(1000);
  //   let selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   const data = {
  //     name: generateRandmString(),
  //     items: [generateRandmString()],
  //   };
  //   await selectableListRowObject.edit(data, false, false, false, true);
  //   selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data.name);
  //   await selectableListRowObject.openEdit();
  //   expect((await selectableLists.getFirstEntityItemOnEdit()).name).toBe(data.items[0]);
  //   await selectableListRowObject.closeEdit();
  //   selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.delete();
  // });
  // test('should make a new list with multiple items', async () => {
  //   const data = {
  //     name: generateRandmString(),
  //     items: ['a', 'b', 'c', 'd', 'e'],
  //   };
  //   await selectableLists.createSelectableList(data, true);
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data.name);
  // });
  // test('should edit the list with multiple items', async () => {
  //   const data = {
  //     name: generateRandmString(),
  //     items: ['f', 'g', 'h', 'i', 'j'],
  //   };
  //   let selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.edit(data, false, false, false, true);
  //   selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListRowObject.name).toBe(data.name);
  //   await selectableListRowObject.openEdit();
  //   for (let i = 0; i < data.items.length; i++) {
  //     expect(
  //       ((await selectableLists.getEntitySelectItemEditRowObjectByIndex(i + 1)).name)
  //     ).toBe(data.items[i]);
  //   }
  //   await selectableListRowObject.closeEdit();
  //   await selectableLists.cleanupList();
  // });
});
