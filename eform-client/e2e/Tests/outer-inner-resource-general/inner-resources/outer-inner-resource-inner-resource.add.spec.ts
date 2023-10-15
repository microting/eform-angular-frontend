import loginPage from '../../../Page objects/Login.page';
import outerInnerResourceInnerResourcePage from '../../../Page objects/OuterInnerResource/OuterInnerResourceInnerResource.page';
import { generateRandmString } from '../../../Helpers/helper-functions';
import outerInnerResourceModalPage from '../../../Page objects/OuterInnerResource/OuterInnerResourceModal.page';

const expect = require('chai').expect;
const newNameInnerResources = generateRandmString();

describe('Machine Area Area Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await outerInnerResourceInnerResourcePage.goToInnerResource();
  });
  it('should not create a new area without everything', async () => {
    const rowNumBeforeCreate = await outerInnerResourceInnerResourcePage.rowNum();
    await outerInnerResourceInnerResourcePage.openCreateModal();
    expect(
      await (await outerInnerResourceModalPage.innerResourceCreateSaveBtn()).isEnabled()
    ).eq(false);
    await outerInnerResourceInnerResourcePage.closeCreateModal(true);
    expect(
      await outerInnerResourceInnerResourcePage.rowNum(),
      'An extra innerResource was created'
    ).eq(rowNumBeforeCreate);
  });
  it('should add area with only name', async () => {
    const rowNumBeforeCreate = await outerInnerResourceInnerResourcePage.rowNum();
    await outerInnerResourceInnerResourcePage.createNewInnerResource(
      newNameInnerResources
    );
    expect(await outerInnerResourceInnerResourcePage.rowNum()).eq(
      rowNumBeforeCreate + 1
    );
    const listRowObject = await outerInnerResourceInnerResourcePage.getInnerObjectByName(
      newNameInnerResources
    );
    expect(listRowObject.name, 'Name in table is incorrect').equal(
      newNameInnerResources
    );
  });
  after('clean up', async () => {
    const listRowObject = await outerInnerResourceInnerResourcePage.getInnerObjectByName(
      newNameInnerResources
    );
    await listRowObject.delete();
  });
});
