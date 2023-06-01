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
  it('should create a new searchable list', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const searchableList = await searchableLists.getFirstRowObject();
    expect((await searchableList.name)).equal(name);
  });
  it('should not create a new searchable list', async () => {
    const numRows = await searchableLists.rowNum();
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem_Cancels(name);
    expect(await searchableLists.rowNum()).equal(numRows);
  });
  it('should create a new searchable list with one item', async () => {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    await searchableList.editBtn.click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(500);
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal(itemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await ($('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should not make a new searchable list with one item', async () => {
    const numRows = await searchableLists.rowNum();
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem_Cancels(name, itemName);
    expect(await searchableLists.rowNum()).equal(numRows);
  });
  it('should make a new searchable list with multiple items', async () => {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    await searchableList.editBtn.click();
    await browser.pause(500);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('a');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('b');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('c');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('d');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal('e');
    await (await searchableLists.entitySearchItemDeleteBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  });
  it('should not create a searchable list with multiple items', async () => {
    const numRows = await searchableLists.rowNum();
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems_Cancels(name, itemNames);
    expect(await searchableLists.rowNum()).equal(numRows);
  });
  afterEach(async () => {
    await searchableLists.goToEntitySearchPage();
    await searchableLists.cleanup();
  })
});
