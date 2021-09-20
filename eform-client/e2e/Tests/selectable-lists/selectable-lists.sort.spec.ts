import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import { testSorting } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select Sort', function () {
  before(async () => {
    loginPage.open('/auth');
    loginPage.login();
    myEformsPage.Navbar.goToEntitySelect();
    selectableLists.createDummySelectableLists(3);
  });
  it('should be able to sort by ID', async () => {
    testSorting(
      selectableLists.idTableHeader,
      '#entitySelectMicrotingUUID',
      'ID'
    );
  });
  it('should be able to sort by Name', async () => {
    testSorting(selectableLists.nameTableHeader, '#entitySelectName', 'Name');
  });
  it('should be able to sort by Description', async () => {
    testSorting(
      selectableLists.descriptionTableHeader,
      '#entitySelectDescription',
      'Description'
    );
  });
  after(async () => {
    const countBeforeCreate = selectableLists.selectableListCount;
    selectableLists.cleanupList();
    expect(countBeforeCreate).not.equal(selectableLists.selectableListCount);
    expect(selectableLists.selectableListCount).equal(0);
  });
});
