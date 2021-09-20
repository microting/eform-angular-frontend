import loginPage from '../../Page objects/Login.page';
import { Guid } from 'guid-typescript';
import searchableLists from '../../Page objects/SearchableLists.page';

const expect = require('chai').expect;

describe('Entity Search', function () {
  before(async () => {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should go to entity search page', async () => {
    searchableLists.goToEntitySearchPage();
    $('#createEntitySearchBtn').waitForDisplayed({ timeout: 40000 });
  });
  it('should create a new searchable list with only name', async () => {
    const name = Guid.create().toString();
    searchableLists.createSearchableList_NoItem(name);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should delete the list', async () => {
    searchableLists.deleteList();
    expect(searchableLists.rowNum).equal(0);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should create a new searchable list with name and one item', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    searchableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal(itemName);
    searchableLists.entitySearchEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should delete item from list.', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    searchableLists.deleteItemFromList();
    searchableLists.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({ timeout: 40000 });
    expect(searchableLists.items).equal(0);
    searchableLists.entitySearchEditCancelBtn.click();
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should make a new searchable list with multiple items', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should delete a list with multiple items.', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    searchableLists.deleteList();
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.rowNum).equal(0);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
});
