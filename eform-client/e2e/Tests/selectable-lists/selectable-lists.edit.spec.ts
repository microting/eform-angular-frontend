import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select', function () {
  before(async () => {
    loginPage.open('/auth');
    loginPage.login();
    myEformsPage.Navbar.goToEntitySelect();
  });
  it('should make a new selectable list, with no items.', async () => {
    const data = { name: generateRandmString() };
    selectableLists.createSelectableList(data);
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
  });
  it('should edit the list name, with no items.', async () => {
    const data = { name: generateRandmString() };
    let selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.edit(data);
    selectableListRowObject = selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    selectableLists.cleanupList();
  });
  it('should make a new selectable list, with 1 item', async () => {
    const data = {
      name: generateRandmString(),
      items: [generateRandmString()],
    };
    selectableLists.createSelectableList(data);
    const selectableListRowObject = selectableLists.getFirstSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    selectableListRowObject.openEdit();
    expect(selectableLists.getFirstEntityItemOnEdit.name).equal(data.items[0]);
    selectableListRowObject.closeEdit();
  });
  it('should only edit item name', async () => {
    const selectableListRowObject = selectableLists.getFirstSelectableListObject();
    const data = { items: [generateRandmString()] };
    selectableListRowObject.edit(data, false, false, false, true);
    selectableListRowObject.openEdit();
    expect(selectableLists.getFirstEntityItemOnEdit.name).equal(data.items[0]);
    selectableListRowObject.closeEdit();
    // selectableLists.cleanupList();
  });
  // it('should make a new selectable list, with 1 item', async () => {
  //   const name = Guid.create().toString();
  //   const itemName = Guid.create().toString();
  //   selectableLists.createSelectableList_OneItem(name, itemName);
  //   $('#entitySelectMicrotingUUID_0').waitForDisplayed({timeout: 40000});
  //   const selectableList = selectableLists.getFirstSelectableListObject();
  //   expect(selectableList.name).equal(name);
  //   selectableList.editBtn.click();
  //   $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  //   $('#entitySelectItemEditNameentityItemUId_0').waitForDisplayed({timeout: 40000});
  //   expect(selectableLists.getFirstEntityItemOnEdit.getText()).equal(itemName);
  //   selectableLists.entitySelectEditCancelBtn.click();
  //   $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
  // });
  it('should edit the list name, and item name', async () => {
    let selectableListRowObject = selectableLists.getFirstSelectableListObject();
    const data = {
      name: generateRandmString(),
      items: [generateRandmString()],
    };
    selectableListRowObject.edit(data, false, false, false, true);
    selectableListRowObject = selectableLists.getFirstSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    selectableListRowObject.openEdit();
    expect(selectableLists.getFirstEntityItemOnEdit.name).equal(data.items[0]);
    selectableListRowObject.closeEdit();
    selectableListRowObject.delete();
  });
  it('should make a new list with multiple items', async () => {
    const data = {
      name: generateRandmString(),
      items: ['a', 'b', 'c', 'd', 'e'],
    };
    selectableLists.createSelectableList(data, true);
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    $('#spinner-animation').waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should edit the list with multiple items', async () => {
    const data = {
      name: generateRandmString(),
      items: ['f', 'g', 'h', 'i', 'j'],
    };
    let selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.edit(data, false, false, false, true);
    selectableListRowObject = selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    selectableListRowObject.openEdit();
    for (let i = 0; i < data.items.length; i++) {
      expect(
        selectableLists.getEntitySelectItemEditRowObjectByIndex(i + 1).name
      ).equal(data.items[i]);
    }
    selectableListRowObject.closeEdit();
    selectableLists.cleanupList();
  });
});
