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
  it('should create a new searchable list', async () => {
    const name = Guid.create().toString();
    searchableLists.createSearchableList_NoItem(name);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should not create a new searchable list', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    searchableLists.createSearchableList_NoItem_Cancels(name);
    expect(searchableLists.rowNum).equal(0);
  });
  it('should create a new searchable list with one item', async () => {
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
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should not make a new searchable list with one item', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    searchableLists.createSearchableList_OneItem_Cancels(name, itemName);
    expect(searchableLists.rowNum).equal(0);
  });
  it('should make a new searchable list with multiple items', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    searchableLists.createSearchableList_MultipleItems(name, itemNames);
    const searchableList = searchableLists.getFirstRowObject();
    expect(searchableList.name).equal(name);
    searchableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('a');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('b');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('c');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('d');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    expect(searchableLists.firstEntityItemName.getText()).equal('e');
    searchableLists.entitySearchItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
    searchableLists.entitySearchEditCancelBtn.click();
    searchableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should not create a searchable list with multiple items', async () => {
    loginPage.open('/');
    searchableLists.goToEntitySearchPage();
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    searchableLists.createSearchableList_MultipleItems_Cancels(name, itemNames);
    expect(searchableLists.rowNum).equal(0);
  });
});
