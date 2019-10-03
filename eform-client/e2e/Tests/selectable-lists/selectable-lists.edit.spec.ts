import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;


describe('Entity Select', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
  });
  it('should go to entity select page.', function () {
    selectableLists.goToEntitySelectPage();
    browser.waitForVisible('#entitySelectCreateBtn', 20000);
  });
  it('should make a new selectable list, with no items.', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem(name);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
  });
  it('should edit the list name, with no items.', function () {
    const newName = 'New Name';
    selectableLists.editSelectableListNameOnly(newName);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(newName);
    selectableLists.cleanup();
    browser.pause(8000);
  });
  it('should make a new selectable list, with 1 item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    browser.pause(4000);
    expect(selectableLists.entityItemName.getText()).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    browser.pause(8000);
  });
  it('should edit the list name, and item name', function () {
    const newName = 'New List Name';
    const newItemName = 'New Item Name';
    selectableLists.editSelectableListNameAndItem(newName, newItemName);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(newName);
    selectableList.editBtn.click();
    browser.pause(4000);
    expect(selectableLists.entityItemName.getText()).equal(newItemName);
    selectableLists.entitySelectEditCancelBtn.click();
    browser.pause(4000);
    selectableLists.cleanup();
    browser.pause(8000);
  });
  it('should make a new selectable list, with 1 item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    browser.pause(4000);
    expect(selectableLists.entityItemName.getText()).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    browser.pause(8000);
  });
  it('should only edit item name', function () {
    const newItemName = 'New Item Name';
    selectableLists.editSelectableListOnlyItem(newItemName);
    const selectableList = selectableLists.getFirstRowObject();
    selectableList.editBtn.click();
    browser.pause(4000);
    expect(selectableLists.entityItemName.getText()).equal(newItemName);
    selectableLists.entitySelectEditCancelBtn.click();
    browser.pause(4000);
    selectableLists.cleanup();
    browser.pause(8000);
  });
  // it('should make a new list with multiple items', function () {
  //   const name = Guid.create().toString();
  //   const itemNames = ['a', 'b', 'c', 'd', 'e'];
  //   selectableLists.createSelectableList_MultipleItems(name, itemNames);
  //   const selectableList = selectableLists.getFirstRowObject();
  //   expect(selectableList.name).equal(name);
  // });
  // it('should edit the list with multiple items', function () {
  //   const newName = 'New List Name';
  //   const newItem1 = 'f';
  //   const newItem2 = 'g';
  //   const newItem3 = 'h';
  //   const newItem4 = 'i';
  //   const newItem5 = 'j';
  //   selectableLists.entitySelectEditBtn.click();
  //   browser.waitForVisible('#editName', 200000);
  //   selectableLists.entitySelectEditName.clearElement();
  //   selectableLists.entitySelectEditName.addValue(newName);
  //   browser.pause(2000);
  //   selectableLists.deleteItem();
  //   browser.pause(1000);
  //   selectableLists.deleteItem();
  //   browser.pause(1000);
  //   selectableLists.deleteItem();
  //   browser.pause(1000);
  //   selectableLists.deleteItem();
  //   browser.pause(1000);
  //   selectableLists.deleteItem();
  //   browser.pause(1000);
  //   selectableLists.entitySelectCreateImportListBtn.click();
  //   browser.pause(1000);
  //   selectableLists.entitySelectImportTextArea.addValue(newItem1);
  //   selectableLists.entitySelectImportTextArea.addValue(newItem2);
  //   selectableLists.entitySelectImportTextArea.addValue(newItem3);
  //   selectableLists.entitySelectImportTextArea.addValue(newItem4);
  //   selectableLists.entitySelectImportTextArea.addValue(newItem5);
  //   browser.pause(2000);
  //   selectableLists.entitySelectImportSaveBtn.click();
  //   browser.pause(4000);
  //   const selectableList = selectableLists.getFirstRowObject();
  //   const entityItem = selectableLists.getFirstItemObject();
  //   selectableList.editBtn.click();
  //   expect(entityItem.name).equal('f');
  //   entityItem.deleteBtn.click();
  //   browser.pause(2000);
  //   expect(entityItem.name).equal('g');
  //   entityItem.deleteBtn.click();
  //   browser.pause(2000);
  //   expect(entityItem.name).equal('h');
  //   entityItem.deleteBtn.click();
  //   browser.pause(2000);
  //   expect(entityItem.name).equal('i');
  //   entityItem.deleteBtn.click();
  //   browser.pause(2000);
  //   expect(entityItem.name).equal('j');
  //   entityItem.deleteBtn.click();
  //   browser.pause(2000);
  //   selectableLists.entitySelectEditSaveBtn.click();
  //   expect(selectableList.name).equal(newName);
  // });
});
