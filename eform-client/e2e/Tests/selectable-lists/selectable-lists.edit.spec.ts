import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import { generateRandmString } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToEntitySelect();
  });
  it('should make a new selectable list, with no items.', async () => {
    const data = { name: generateRandmString() };
    await selectableLists.createSelectableList(data);
    await browser.pause(1000);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
  });
  it('should edit the list name, with no items.', async () => {
    await browser.pause(1000);
    const data = { name: generateRandmString() };
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await browser.pause(1000);
    await selectableListRowObject.edit(data);
    await browser.pause(1000);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableLists.cleanupList();
    await browser.pause(1000);
  });
  it('should make a new selectable list, with 1 item', async () => {
    const data = {
      name: generateRandmString(),
      items: [generateRandmString()],
    };
    await selectableLists.createSelectableList(data);
    await browser.pause(1500);
    const selectableListRowObject = await selectableLists.getFirstSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    await browser.pause(1000);
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    await selectableListRowObject.closeEdit();
  });
  it('should only edit item name', async () => {
    await browser.pause(1000);
    let selectableListRowObject = await selectableLists.getFirstSelectableListObject();
    const data = { items: [generateRandmString()] };
    await selectableListRowObject.edit(data, false, false, false, true);
    await browser.pause(1000);
    await selectableListRowObject.openEdit();
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    selectableListRowObject = await selectableLists.getFirstSelectableListObject();
    await selectableListRowObject.closeEdit();
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
    await browser.pause(1000);
    let selectableListRowObject = await selectableLists.getFirstSelectableListObject();
    const data = {
      name: generateRandmString(),
      items: [generateRandmString()],
    };
    await selectableListRowObject.edit(data, false, false, false, true);
    await browser.pause(1000);
    selectableListRowObject = await selectableLists.getFirstSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    await selectableListRowObject.closeEdit();
    selectableListRowObject = await selectableLists.getFirstSelectableListObject();
    await browser.pause(1000);
    await selectableListRowObject.delete();
    await browser.pause(1000);
  });
  it('should make a new list with multiple items', async () => {
    const data = {
      name: generateRandmString(),
      items: ['a', 'b', 'c', 'd', 'e'],
    };
    await selectableLists.createSelectableList(data, true);
    await browser.pause(1000);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    await browser.pause(1000);
  });
  it('should edit the list with multiple items', async () => {
    const data = {
      name: generateRandmString(),
      items: ['f', 'g', 'h', 'i', 'j'],
    };
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.edit(data, false, false, false, true);
    await browser.pause(1000);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await browser.pause(1000);
    expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    for (let i = 0; i < data.items.length; i++) {
      expect(
        ((await selectableLists.getEntitySelectItemEditRowObjectByIndex(i + 1)).name)
      ).equal(data.items[i]);
    }
    await selectableListRowObject.closeEdit();
    await browser.pause(1000);
    await selectableLists.cleanupList();
  });
});
