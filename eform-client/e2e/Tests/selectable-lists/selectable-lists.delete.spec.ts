import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {generateRandmString} from '../../Helpers/helper-functions';

import {expect} from 'chai';

describe('Entity Select', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToEntitySelect();
  });
  it('should make a new selectable list, with no items.', async () => {
    const data = {name: generateRandmString()};
    await selectableLists.createSelectableList(data);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
  });
  it('should delete the list', async () => {
    const countBeforeDelete = await selectableLists.selectableListCount();
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.delete();
    expect(countBeforeDelete - 1).equal(await selectableLists.selectableListCount());
  });
  it('should make a new selectable list, with 1 item', async () => {
    const data = {name: generateRandmString(), items: [generateRandmString()]};
    await selectableLists.createSelectableList(data);
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    await selectableListRowObject.openEdit();
    expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
    await selectableListRowObject.closeEdit(true);
  });
  it('should delete item in list', async () => {
    let selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.edit({}, false, true);
    await browser.pause(1500);
    selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.openEdit();
    expect(await selectableLists.itemsEditPageCount()).equal(0);
    await selectableListRowObject.closeEdit(true);
  });
  it('should not delete selectable list', async () => {
    const rowCountBeforeDelete = await selectableLists.selectableListCount();
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.delete(true);
    expect(rowCountBeforeDelete).equal(await selectableLists.selectableListCount());
  });
  it('should delete selectable list', async () => {
    const rowCountBeforeDelete = await selectableLists.selectableListCount();
    const selectableListRowObject = await selectableLists.getLastSelectableListObject();
    await selectableListRowObject.delete();
    expect(rowCountBeforeDelete - 1).equal(await selectableLists.selectableListCount());
  });
});
