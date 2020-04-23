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
    $('#entitySelectCreateBtn').waitForDisplayed({timeout: 20000});
  });
  it('should make a new selectable list, with no items.', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem(name);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should not make a new list, with no items', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem_Cancels(name);
    expect(selectableLists.rowNum).equal(0);
  });
  it('should create a new list with one item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal(itemName);
    selectableLists.entitySelectEditCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should not make a new list with one item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem_Cancels(name, itemName);
    expect(selectableLists.rowNum).equal(0);
  });
  it('should make a new list with multiple items', function () {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    selectableLists.createSelectableList_MultipleItems(name, itemNames);
    $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 20000});
    const selectableList = selectableLists.getFirstRowObject();
    selectableList.editBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 20000});
    expect(selectableLists.firstEntityItemName.getText()).equal('a');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('b');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('c');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('d');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    expect(selectableLists.firstEntityItemName.getText()).equal('e');
    selectableLists.entityItemDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    selectableLists.entitySelectEditCancelBtn.click();
    selectableLists.cleanup();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  });
  it('should not make a new lest with multiple items', function () {
    const name = Guid.create().toString();
    const itemNames = ['a \n', 'b\n', 'c\n', 'd\n', 'e'];
    selectableLists.createSelectableList_MultipleItems_Cancels(name, itemNames);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableLists.rowNum).equal(0);
  });
});
