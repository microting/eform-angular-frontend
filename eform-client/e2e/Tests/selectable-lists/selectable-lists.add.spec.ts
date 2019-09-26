import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import {expect} from 'chai';
import {Guid} from 'guid-typescript';


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
    selectableLists.cleanup();
  });
  it('should not make a new list, with no items', function () {
    const name = Guid.create().toString();
    selectableLists.createSelectableList_NoItem_Cancels(name);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(null);
  });
  it('should create a new list with one item', function () {
    const name = Guid.create().toString();
    const itemName = Guid.create().toString();
    selectableLists.createSelectableList_OneItem(name, itemName);
    const selectableList = selectableLists.getFirstRowObject();
    expect(selectableList.name).equal(name);
    selectableList.editBtn.click();

  });
});
