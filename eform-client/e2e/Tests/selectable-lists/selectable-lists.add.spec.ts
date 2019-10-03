import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {expect} from 'chai';
import {Guid} from 'guid-typescript';
import it = Mocha.it;


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
    selectableLists.cleanup();
  });
  it('should not make a new list, with no items', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem_Cancels(name);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(null);
  });
  it('should create a new list with one item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    const selectableList = selectableLists.getFirstRowObject();
    const entityItem = selectableLists.getFirstItemObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    browser.pause(4000);
    expect(entityItem.name).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    browser.pause(2000);
    selectableLists.cleanup();
  });
  it('should not make a new list with one item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem_Cancels(name, itemName);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(null);
  });
  it('should make a new list with multiple items', function () {
    const name = Guid.create().toString();
    const itemNames = ['a', 'b', 'c', 'd', 'e'];
    selectableLists.createSelectableList_MultipleItems(name, itemNames);
    const selectableList = selectableLists.getFirstRowObject();
    const entityItem = selectableLists.getFirstItemObject();
    selectableList.editBtn.click();
    expect(entityItem.name).equal('a');
    entityItem.deleteBtn.click();
    browser.pause(2000);
    expect(entityItem.name).equal('b');
    entityItem.deleteBtn.click();
    browser.pause(2000);
    expect(entityItem.name).equal('c');
    entityItem.deleteBtn.click();
    browser.pause(2000);
    expect(entityItem.name).equal('d');
    entityItem.deleteBtn.click();
    browser.pause(2000);
    expect(entityItem.name).equal('e');
    entityItem.deleteBtn.click();
    browser.pause(2000);
    selectableLists.entitySelectEditCancelBtn.click();
    selectableLists.cleanup();
  });
  it('should not make a new lest with multiple items', function () {
    const name = Guid.create().toString();
    const itemNames = ['a', 'b', 'c', 'd', 'e'];
    selectableLists.createSelectableList_MultipleItems_Cancels(name, itemNames);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(null);
  });
});
