import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {generateRandmString} from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    myEformsPage.Navbar.goToEntitySelect();
  });
  it('should make a new selectable list, with no items.', function () {
    const data = {name: generateRandmString()};
    selectableLists.createSelectableList(data);
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
  });
  it('should delete the list', function () {
    const countBeforeDelete = selectableLists.selectableListCount;
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.delete();
    expect(countBeforeDelete - 1).equal(selectableLists.selectableListCount);
  });
  it('should make a new selectable list, with 1 item', function () {
    const data = {name: generateRandmString(), items: [generateRandmString()]};
    selectableLists.createSelectableList(data);
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    expect(selectableListRowObject.name).equal(data.name);
    selectableListRowObject.openEdit();
    expect(selectableLists.getFirstEntityItemOnEdit.name).equal(data.items[0]);
    selectableListRowObject.closeEdit(true);
  });
  it('should delete item in list', function () {
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.edit({}, false, true);
    selectableListRowObject.openEdit();
    expect(selectableLists.itemsEditPageCount).equal(0);
    selectableListRowObject.closeEdit(true);
  });
  it('should not delete selectable list', function () {
    const rowCountBeforeDelete = selectableLists.selectableListCount;
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.delete(true);
    expect(rowCountBeforeDelete).equal(selectableLists.selectableListCount);
  });
  it('should delete selectable list', function () {
    const rowCountBeforeDelete = selectableLists.selectableListCount;
    const selectableListRowObject = selectableLists.getLastSelectableListObject();
    selectableListRowObject.delete();
    expect(rowCountBeforeDelete - 1).equal(selectableLists.selectableListCount);
  });
});
