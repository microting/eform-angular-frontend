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
  });
  it('should edit a searchable list, with only name', async () => {
    const newName = 'New Name';
    searchableLists.editSearchableListNameOnly(newName);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should create a new searchable list with name and one item', async () => {
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
  it('should edit list with name and one item', async () => {
    const newName = 'New Name';
    const newItemName = 'New Item Name';
    searchableLists.editSearchableListNameAndItem(newName, newItemName);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal(newItemName);
    searchableLists.entitySearchEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should make a new searchable list with multiple items', async () => {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should edit a searchable list with multiple items', async () => {
    const newName = 'New Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    searchableLists.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed({ timeout: 40000 });
    searchableLists.entitySearchEditNameBox.clearValue();
    searchableLists.entitySearchEditNameBox.addValue(newName);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchEditImportBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchEditImportItemTextArea.addValue(newItemNames);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchEditImportItemSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchEditSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('f');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('g');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('h');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('i');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('j');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
});
