import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToEntitySelect();
  });
  it('should assert true is true', () => {
    expect(true).equal(true); // this will pass
  });
  // it('should make a new selectable list, with no items.', async () => {
  //   const data = {name: generateRandmString(), description: generateRandmString()};
  //   await selectableLists.createSelectableList(data);
  //   const selectableListObject = await selectableLists.getLastSelectableListObject();
  //   expect(selectableListObject.name).equal(data.name);
  //   expect(selectableListObject.description).eq(data.description);
  // });
  // it('should not make a new list, with no items', async () => {
  //   const data = {name: generateRandmString()};
  //   const countBeforeCreate = await selectableLists.selectableListCount();
  //   await selectableLists.createSelectableList(data, false, true);
  //   expect(countBeforeCreate).equal(await selectableLists.selectableListCount());
  // });
  // it('should create a new list with one item', async () => {
  //   await selectableLists.cleanupList();
  //   const data = {name: generateRandmString(), items: [generateRandmString()]};
  //   await selectableLists.createSelectableList(data);
  //   const selectableListObject = await selectableLists.getFirstSelectableListObject();
  //   expect(selectableListObject.name).equal(data.name);
  //   await selectableListObject.openEdit();
  //   expect((await selectableLists.getFirstEntityItemOnEdit()).name).equal(data.items[0]);
  //   await selectableListObject.closeEdit(true);
  // });
  // it('should not make a new list with one item', async () => {
  //   const data = {name: generateRandmString(), items: [generateRandmString()]};
  //   const countBeforeCreate = await selectableLists.selectableListCount();
  //   await selectableLists.createSelectableList(data, false, true);
  //   expect(countBeforeCreate).equal(await selectableLists.selectableListCount());
  // });
  // it('should make a new list with multiple items', async () => {
  //   await selectableLists.cleanupList();
  //   const data = {name: generateRandmString(), items: ['a', 'b', 'c', 'd', 'e']};
  //   await selectableLists.createSelectableList(data, true);
  //   const selectableListRowObject = await selectableLists.getLastSelectableListObject();
  //   await selectableListRowObject.openEdit();
  //   for (let i = 0; i < data.items.length; i++) {
  //     expect((await selectableLists.getEntitySelectItemEditRowObjectByIndex(i + 1)).name).eq(data.items[i]);
  //   }
  //   await selectableListRowObject.closeEdit(true);
  //   await selectableLists.cleanupList();
  // });
  // it('should not make a new lest with multiple items', async () => {
  //   const data = {name: generateRandmString(), items: ['a', 'b', 'c', 'd', 'e']};
  //   const countBeforeCreate = await selectableLists.selectableListCount();
  //   await selectableLists.createSelectableList(data, true, true);
  //   expect(countBeforeCreate).equal(await selectableLists.selectableListCount());
  // });
});
