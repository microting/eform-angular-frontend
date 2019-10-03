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
  it('should delete the list', function () {
    selectableLists.deleteList();
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableLists.rowNum).equal(0);
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
  it('should delete item in list', function () {
    selectableLists.deleteItemFromList();
    selectableLists.entitySelectEditBtn.click();
    browser.waitForVisible('#editName', 20000);
    expect(selectableLists.items).equal(0);
    selectableLists.entitySelectEditCancelBtn.click();
    selectableLists.cleanup();
  });
});
