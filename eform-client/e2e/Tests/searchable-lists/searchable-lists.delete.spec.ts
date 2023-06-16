import loginPage from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import searchableLists from '../../Page objects/SearchableLists.page';

const expect = require('chai').expect;

describe('Entity Search', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
  });
  it('should go to entity search page', async () => {
    await searchableLists.goToEntitySearchPage();
    await (await $('#createEntitySearchBtn')).waitForDisplayed({ timeout: 40000 });
  });
  it('should create a new searchable list with only name', async () => {
    const name = Guid.create().toString();
    await searchableLists.createSearchableList_NoItem(name);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
  });
  it('should delete the list', async () => {
    await searchableLists.deleteList();
    expect(await searchableLists.rowNum()).equal(0);
  });
  it('should create a new searchable list with name and one item', async () => {
    await loginPage.open('/');
    await searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    await searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    await searchableList.editBtn.click();
    expect(await (await searchableLists.firstEntityItemName()).getText()).equal(itemName);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
  });
  it('should delete item from list.', async () => {
    await loginPage.open('/');
    await searchableLists.goToEntitySearchPage();
    await searchableLists.deleteItemFromList();
    await (await searchableLists.entitySearchEditBtn()).click();
    await (await $('#editName')).waitForDisplayed({ timeout: 40000 });
    expect(await searchableLists.items()).equal(0);
    await (await searchableLists.entitySearchEditCancelBtn()).click();
    await searchableLists.cleanup();
  });
  it('should make a new searchable list with multiple items', async () => {
    await loginPage.open('/');
    await searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    await searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = await searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
  });
  it('should delete a list with multiple items.', async () => {
    await loginPage.open('/');
    await searchableLists.goToEntitySearchPage();
    await searchableLists.deleteList();
    await loginPage.open('/');
    await searchableLists.goToEntitySearchPage();
    expect(await searchableLists.rowNum()).equal(0);
  });
});
