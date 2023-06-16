import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

const data1 = { name: generateRandmString() };

describe('Entity Select', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToEntitySelect();
  });
  it('should make a new selectable list, with no items.', async () => {
    await selectableLists.createSelectableList(data1);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data1.name);
  });
  it('should edit the list name, with no items.', async () => {
    const data = { name: generateRandmString() };
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    //expect(selectableListRowObject.name).equal(data1.name);
    await selectableListRowObject.edit(data);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableLists.cleanupList();
  });
  it('should make a new selectable list, with 1 item', async () => {
    const data = {
      name: generateRandmString(),
      items: [generateRandmString()],
    };
    await selectableLists.createSelectableList(data);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    //expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    await selectableListRowObject.closeEdit();
  });
  it('should only edit item name', async () => {
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    const data = { items: [generateRandmString()] };
    await selectableListRowObject.edit(data, false, false, false, true);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.openEdit();
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    await selectableListRowObject.closeEdit();
    //selectableListRowObject = await selectableLists.getLastSelectableListObject();
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
    //await browser.pause(1000);
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    const data = {
      name: generateRandmString(),
      items: [generateRandmString()],
    };
    await selectableListRowObject.edit(data, false, false, false, true);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    await selectableListRowObject.closeEdit();
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.delete();
  });
  it('should make a new list with multiple items', async () => {
    const data = {
      name: generateRandmString(),
      items: ['a', 'b', 'c', 'd', 'e'],
    };
    await selectableLists.createSelectableList(data, true);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
  });
  it('should edit the list with multiple items', async () => {
    const data = {
      name: generateRandmString(),
      items: ['f', 'g', 'h', 'i', 'j'],
    };
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.edit(data, false, false, false, true);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    for (let i = 0; i < data.items.length; i++) {
      expect(
        ((await selectableLists.getEntitySelectItemEditRowObjectByIndex(i + 1)).name)
      ).equal(data.items[i]);
    }
    await selectableListRowObject.closeEdit();
    await selectableLists.cleanupList();
  });
});
