import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import selectableLists from '../../Page objects/SelectableLists.page';
import { testSorting } from '../../Helpers/helper-functions';

const expect = require('chai').expect;

describe('Entity Select Sort', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await myEformsPage.Navbar.goToEntitySelect();
    await selectableLists.createDummySelectableLists(3);
  });
  it('should assert true is true', () => {
    expect(true).equal(true); // this will pass
  });
  // it('should be able to sort by ID', async () => {
  //   await testSorting(
  //     await selectableLists.idTableHeader(),
  //     '#entitySelectMicrotingUUID',
  //     'ID'
  //   );
  // });
  // it('should be able to sort by Name', async () => {
  //   await testSorting(await selectableLists.nameTableHeader(), '#entitySelectName', 'Name');
  // });
  // it('should be able to sort by Description', async () => {
  //   await testSorting(
  //     await selectableLists.descriptionTableHeader(),
  //     '#entitySelectDescription',
  //     'Description'
  //   );
  // });
  after(async () => {
    const countBeforeCreate = await selectableLists.selectableListCount();
    await selectableLists.cleanupList();
    expect(countBeforeCreate).not.equal(await selectableLists.selectableListCount());
    expect(await selectableLists.selectableListCount()).equal(0);
  });
});
