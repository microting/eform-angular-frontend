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
    browser.pause(8000);
  });
  it('should delete the list', function () {
    searchableLists.deleteList();
    expect(searchableLists.rowNum).equal(0);
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
  it('should delete item from list.', function () {
    searchableLists.deleteItemFromList();
    searchableLists.entitySearchEditBtn.click();
    $('#editName').waitForDisplayed(20000);
    expect(searchableLists.items).equal(0);
    searchableLists.entitySearchEditCancelBtn.click();
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
  it('should delete a list with multiple items.', function () {
    searchableLists.deleteList();
    expect(searchableLists.rowNum).equal(0);
    browser.pause(8000);
  });
});
