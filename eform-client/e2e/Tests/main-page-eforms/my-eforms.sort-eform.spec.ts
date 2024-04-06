import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import { testSorting } from '../../Helpers/helper-functions';
import { $ } from '@wdio/globals';

describe('Main page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
  });
  it('should be able to sort by ID', async () => {
    await testSorting(await myEformsPage.idSortBtn(), '#eform-id', 'ID');
  });
  it('should be able to sort by "Created at"', async () => {
    await testSorting(
      await myEformsPage.createdAtSortBtn(),
      '#eform-created-at',
      'Created at'
    );
  });
  it('should be able to sort by "Name eForm"', async () => {
    await testSorting(await myEformsPage.eformNameSortBtn(), '#eform-label', 'Name eForm');
  });
});
