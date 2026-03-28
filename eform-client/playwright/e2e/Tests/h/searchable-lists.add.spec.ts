import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import { SearchableListsPage } from '../../Page objects/SearchableLists.page';

test.describe.serial('Entity Search', () => {
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

  test('should create a new searchable list', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(name);
    await searchableLists.cleanup();
  });

  test('should not create a new searchable list', async () => {
    const numRows = await searchableLists.rowNum();
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem_Cancels(name);
    expect(await searchableLists.rowNum()).toBe(numRows);
  });

  test('should create a new searchable list with one item', async () => {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(name);
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe(itemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await searchableLists.cleanup();
  });

  test('should not make a new searchable list with one item', async () => {
    const numRows = await searchableLists.rowNum();
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem_Cancels(name, itemName);
    expect(await searchableLists.rowNum()).toBe(numRows);
  });

  test('should make a new searchable list with multiple items', async () => {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(name);
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('a');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('b');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('c');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('d');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('e');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await searchableLists.cleanup();
  });

  test('should not create a searchable list with multiple items', async () => {
    const numRows = await searchableLists.rowNum();
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems_Cancels(name, itemNames);
    expect(await searchableLists.rowNum()).toBe(numRows);
  });
});
