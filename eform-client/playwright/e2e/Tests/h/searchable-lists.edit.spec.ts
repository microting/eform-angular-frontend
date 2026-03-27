import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import { SearchableListsPage, SearchableListRowObject } from '../../Page objects/SearchableLists.page';

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

  test('should edit a searchable list, with only name', async () => {
    const newName = 'New Name';
    await searchableLists.editSearchableListNameOnly(newName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(newName);
    await searchableLists.cleanup();
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

  test('should edit list with name and one item', async () => {
    const newName = 'New Name';
    const newItemName = 'New Item Name';
    await searchableLists.editSearchableListNameAndItem(newName, newItemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).toBe(newName);
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe(newItemName);
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

  test('should edit a searchable list with multiple items', async () => {
    const newName = 'New Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    let rowNumber = await searchableLists.rowNum();
    rowNumber = rowNumber - 1;
    await (await searchableLists.entitySearchEditBtn(rowNumber)).click();
    await page.waitForTimeout(500);
    await page.locator('#editName').waitFor({ state: 'visible', timeout: 40000 });
    await (await searchableLists.entitySearchEditNameBox()).clear();
    await (await searchableLists.entitySearchEditNameBox()).fill(newName);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchEditImportBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchEditImportItemTextArea()).click();
    await page.keyboard.type(newItemNames);
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchEditImportItemSaveBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchEditSaveBtn()).click();
    await page.waitForTimeout(1500);
    rowNumber = await searchableLists.rowNum();
    const obj = new SearchableListRowObject(page);
    const row = await obj.getRow(rowNumber);
    const searchableList = row;
    expect(searchableList.name).toBe(newName);
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('f');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('g');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('h');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('i');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    expect(await (await searchableLists.firstEntityItemName()).textContent()).toBe('j');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await page.waitForTimeout(500);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await page.waitForTimeout(500);
    await searchableLists.cleanup();
  });
});
