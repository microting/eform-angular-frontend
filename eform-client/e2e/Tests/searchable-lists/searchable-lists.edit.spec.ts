import loginPage from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import searchableLists from '../../Page objects/SearchableLists.page';

const expect = require('chai').expect;

describe('Entity Search', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await searchableLists.goToEntitySearchPage();
  });
  it('should create a new searchable list with only name', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
  });
  it('should edit a searchable list, with only name', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const newName = 'New Name';
    await searchableLists.editSearchableListNameOnly(newName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
  });
  it('should create a new searchable list with name and one item', async () => {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    await searchableList.editBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal(itemName);
  });
  it('should edit list with name and one item', async () => {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    let searchableList = await searchableLists.getFirstRowObject();
    const newName = 'New Name';
    const newItemName = 'New Item Name';
    await searchableLists.editSearchableListNameAndItem(newName, newItemName);
    searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableList.editBtn.click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal(newItemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  });
  it('should make a new searchable list with multiple items', async () => {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  });
  it('should edit a searchable list with multiple items', async () => {
    await searchableLists.createSearchableList_MultipleItems(Guid.create().toString(), ['a \n', 'b\n', 'c\n', 'd\n', 'e']);
    let searchableList = await searchableLists.getFirstRowObject();
    const newName = 'New Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    await searchableList.editBtn.click();
    await browser.pause(500);
    await (await $('#editName')).waitForDisplayed({ timeout: 40000 });
    await (await searchableLists.entitySearchEditNameBox()).clearValue();
    await (await searchableLists.entitySearchEditNameBox()).addValue(newName);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    for (let i = 0; i < 5; i++) { // 5 - count items
      await (await searchableLists.entitySearchItemDeleteBtn()).click();
      await browser.pause(500);
      await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    }
    await (await searchableLists.entitySearchEditImportBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await searchableLists.entitySearchEditImportItemTextArea()).click();
    await browser.keys(newItemNames);
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await searchableLists.entitySearchEditImportItemSaveBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await searchableLists.entitySearchEditSaveBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    await searchableList.editBtn.click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('f');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('g');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('h');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('i');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('j');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  });
  afterEach(async () => {
    await searchableLists.goToEntitySearchPage();
    await searchableLists.cleanup();
  })
});
