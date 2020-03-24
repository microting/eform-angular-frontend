import loginPage from '../../Page objects/Login.page';
import {Guid} from 'guid-typescript';
import searchableLists from '../../Page objects/SearchableLists.page';

const expect = require('chai').expect;

describe('Entity Search', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should go to entity search page', function () {
    searchableLists.goToEntitySearchPage();
    $('#createEntitySearchBtn').waitForDisplayed(20000);
  });
  it('should create a new searchable list with only name', function () {
    const name = Guid.create().toString();
    searchableLists.createSearchableList_NoItem(name);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
  });
  it('should edit a searchable list, with only name', function () {
    const newName = 'New Name';
    searchableLists.editSearchableListNameOnly(newName);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableLists.cleanup();
    browser.pause(8000);
  });
  it('should create a new searchable list with name and one item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    searchableLists.createSearchableList_OneItem(name, itemName);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    searchableList.editBtn.click();
    browser.pause(4000);
    expect(searchableLists.firstEntityItemName.getText()).equal(itemName);
    searchableLists.entitySearchEditCancelBtn.click();
    browser.pause(2000);
  });
  it('should edit list with name and one item', function () {
    const newName = 'New Name';
    const newItemName = 'New Item Name';
    searchableLists.editSearchableListNameAndItem(newName, newItemName);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableList.editBtn.click();
    browser.pause(4000);
    expect(searchableLists.firstEntityItemName.getText()).equal(newItemName);
    searchableLists.entitySearchEditCancelBtn.click();
    browser.pause(2000);
    searchableLists.cleanup();
    browser.pause(8000);
  });
  it('should make a new searchable list with multiple items', function () {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    browser.pause(8000);
  });
  it('should edit a searchable list with multiple items', function () {
    const newName = 'New Name';
    const newItemNames = 'f\ng\nh\ni\nj';
    searchableLists.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(20000);
    searchableLists.entitySearchEditNameBox.clearValue();
    searchableLists.entitySearchEditNameBox.addValue(newName);
    browser.pause(2000);
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    searchableLists.entitySearchEditImportBtn.click();
    browser.pause(4000);
    searchableLists.entitySearchEditImportItemTextArea.addValue(newItemNames);
    browser.pause(2000);
    searchableLists.entitySearchEditImportItemSaveBtn.click();
    browser.pause(4000);
    searchableLists.entitySearchEditSaveBtn.click();
    browser.pause(4000);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(newName);
    searchableList.editBtn.click();
    browser.pause(4000);
    expect(searchableLists.firstEntityItemName.getText()).equal('f');
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    expect(searchableLists.firstEntityItemName.getText()).equal('g');
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    expect(searchableLists.firstEntityItemName.getText()).equal('h');
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    expect(searchableLists.firstEntityItemName.getText()).equal('i');
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    expect(searchableLists.firstEntityItemName.getText()).equal('j');
    searchableLists.entitySearchItemDeleteBtn.click();
    browser.pause(2000);
    searchableLists.entitySearchEditCancelBtn.click();
    browser.pause(4000);
    searchableLists.cleanup();
    browser.pause(8000);
  });
});
