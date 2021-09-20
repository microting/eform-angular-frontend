import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select', function () {
  before(async () => {
    loginPage.open('/auth');
    loginPage.login();
    myEformsPage.Navbar.goToEntitySelect();
  });
  it('should make a new selectable list, with no items.', async () => {
    const data = {name: generateRandmString(), description: generateRandmString()};
    selectableLists.createSelectableList(data);
    const selectableList = selectableLists.getLastSelectableListObject();
    expect(selectableList.name).equal(data.name);
    expect(selectableList.description).eq(data.description);
  });
  it('should not make a new list, with no items', async () => {
    const data = {name: generateRandmString()};
    const countBeforeCreate = selectableLists.selectableListCount;
    selectableLists.createSelectableList(data, false, true);
    expect(countBeforeCreate).equal(selectableLists.selectableListCount);
  });
  it('should create a new list with one item', async () => {
    selectableLists.cleanupList();
    const data = {name: generateRandmString(), items: [generateRandmString()]};
    selectableLists.createSelectableList(data);
    const selectableListObject = selectableLists.getFirstSelectableListObject();
    expect(selectableListObject.name).equal(data.name);
    selectableListObject.openEdit();
    expect(selectableLists.getFirstEntityItemOnEdit.name).equal(data.items[0]);
    selectableListObject.closeEdit(true);
  });
  it('should not make a new list with one item', async () => {
    const data = {name: generateRandmString(), items: [generateRandmString()]};
    const countBeforeCreate = selectableLists.selectableListCount;
    selectableLists.createSelectableList(data, false, true);
    expect(countBeforeCreate).equal(selectableLists.selectableListCount);
  });
  it('should make a new list with multiple items', async () => {
    selectableLists.cleanupList();
    const data = {name: generateRandmString(), items: ['a', 'b', 'c', 'd', 'e']};
    selectableLists.createSelectableList(data, true);
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.openEdit();
    for (let i = 0; i < data.items.length; i++) {
      expect(selectableLists.getEntitySelectItemEditRowObjectByIndex(i + 1).name).eq(data.items[i]);
    }
    selectableListRowObject.closeEdit(true);
    selectableLists.cleanupList();
  });
  it('should not make a new lest with multiple items', async () => {
    const data = {name: generateRandmString(), items: ['a', 'b', 'c', 'd', 'e']};
    const countBeforeCreate = selectableLists.selectableListCount;
    selectableLists.createSelectableList(data, true, true);
    expect(countBeforeCreate).equal(selectableLists.selectableListCount);
  });
});
