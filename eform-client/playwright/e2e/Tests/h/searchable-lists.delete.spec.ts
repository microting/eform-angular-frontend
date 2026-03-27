import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import { SearchableListsPage } from '../../Page objects/SearchableLists.page';

test.describe('Entity Search', () => {
  let page;
  let loginPage: LoginPage;
  let searchableLists: SearchableListsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    searchableLists = new SearchableListsPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should go to entity search page', async () => {
    await searchableLists.goToEntitySearchPage();
    await page.locator('#createEntitySearchBtn').waitFor({ state: 'visible', timeout: 40000 });
  });

  test('should create a new searchable list with only name', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(name);
  });

  test('should delete the list', async () => {
    const currentRowNum = await searchableLists.rowNum();
    await searchableLists.deleteList();
    await page.waitForTimeout(1000);
    expect(await searchableLists.rowNum()).toBe(currentRowNum - 1);
  });

  test('should create a new searchable list with name and one item', async () => {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(name);
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe(itemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
  });

  test('should delete item from list.', async () => {
    await searchableLists.deleteItemFromList();
    await (await searchableLists.entitySearchEditBtn()).click();
    await page.locator('#editName').waitFor({ state: 'visible', timeout: 40000 });
    expect(await searchableLists.items()).toBe(0);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await searchableLists.cleanup();
  });

  test('should make a new searchable list with multiple items', async () => {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(name);
  });

  test('should delete a list with multiple items.', async () => {
    const currentRowNum = await searchableLists.rowNum();
    await searchableLists.deleteList();
    expect(await searchableLists.rowNum()).toBe(currentRowNum - 1);
  });
});
