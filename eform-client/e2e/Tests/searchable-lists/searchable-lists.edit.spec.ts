import loginPage from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import searchableLists, {SearchableListRowObject} from '../../Page objects/SearchableLists.page';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;

describe('Entity Search', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('should go to entity search page', async () => {
    await searchableLists.goToEntitySearchPage();
    await $('#createEntitySearchBtn').waitForDisplayed({ timeout: 40000 });
  });
  it('should create a new searchable list with only name', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
  });
  it('should edit a searchable list, with only name', async () => {
    const newName = 'New Name';
    await searchableLists.editSearchableListNameOnly(newName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    await searchableLists.cleanup();
  });
  it('should create a new searchable list with name and one item', async () => {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    // await searchableList.editBtn.click();
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal(itemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
  });
  it('should edit list with name and one item', async () => {
    const newName = 'New Name';
    const newItemName = 'New Item Name';
    await searchableLists.editSearchableListNameAndItem(newName, newItemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    // searchableList.editBtn.click();
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal(newItemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await searchableLists.cleanup();
  });
  it('should make a new searchable list with multiple items', async () => {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
  });
  it('should edit a searchable list with multiple items', async () => {
    const newName = 'New Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    let rowNumber = await searchableLists.rowNum();
    rowNumber = rowNumber - 1;
    await (await searchableLists.entitySearchEditBtn(rowNumber)).click();
    await browser.pause(500);
    await (await $('#editName')).waitForDisplayed({ timeout: 40000 });
    await (await searchableLists.entitySearchEditNameBox()).clearValue();
    await (await searchableLists.entitySearchEditNameBox()).addValue(newName);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchEditImportBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchEditImportItemTextArea()).click();
    await browser.keys(newItemNames);
    await browser.pause(500);
    await (await searchableLists.entitySearchEditImportItemSaveBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchEditSaveBtn()).click();
    await browser.pause(1500);
    rowNumber = await searchableLists.rowNum();
    // if (rowNumber > 1) {
    //   rowNumber = rowNumber - 1;
    // }
    const obj = new SearchableListRowObject();
    const row = await obj.getRow(rowNumber);
    const searchableList = row;
    expect(searchableList.name).equal(newName);
    // await searchableList.editBtn.click();
    await (await searchableLists.entitySearchEditBtn(searchableList.index - 1)).click();
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('f');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('g');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('h');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('i');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('j');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await browser.pause(500);
    await searchableLists.cleanup();
  });
});
