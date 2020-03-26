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
    $('#entitySelectCreateBtn').waitForDisplayed(20000);
  });
  it('should make a new selectable list, with no items.', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem(name);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
  });
  it('should delete the list', function () {
    $('#spinner-animation').waitForDisplayed(90000, true);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed(20000);
    selectableLists.deleteList();
    $('#spinner-animation').waitForDisplayed(90000, true);
    browser.pause(1000);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableLists.rowNum).equal(0);
  });
  it('should make a new selectable list, with 1 item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed(20000);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
    $('#entitySelectItemEditNameentityItemUId').waitForDisplayed(20000);
    expect(selectableLists.firstEntityItemName.getText()).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed(90000, true);
  });
  it('should delete item in list', function () {
    selectableLists.deleteItemFromList();
    selectableLists.entitySelectEditBtn.click();
    $('#editName').waitForDisplayed(20000);
    expect(selectableLists.items).equal(0);
    selectableLists.entitySelectEditCancelBtn.click();
    selectableLists.cleanup();
  });
});
