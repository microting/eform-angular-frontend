import outerInnerResourceOuterResourcePage from '../../../Page objects/OuterInnerResource/OuterInnerResourceOuterResource.page';
import outerInnerResourceModalPage from '../../../Page objects/OuterInnerResource/OuterInnerResourceModal.page';
import loginPage from '../../../Page objects/Login.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const newName = generateRandmString();

describe('Machine Area Machine Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await outerInnerResourceOuterResourcePage.goToOuterResource();
  });
  it('should add machine with only name', async () => {
    const rowNumBeforeCreate = await outerInnerResourceOuterResourcePage.rowNum();
    await outerInnerResourceOuterResourcePage.createNewInnerResource(newName);
    expect(await outerInnerResourceOuterResourcePage.rowNum()).eq(
      rowNumBeforeCreate + 1
    );
    const listRowObject = await outerInnerResourceOuterResourcePage.getOuterObjectByName(
      newName
    );
    expect(listRowObject.name, 'Name in table is incorrect').equal(newName);
  });
  it('should not create machine without name', async () => {
    const rowNumBeforeCreate = await outerInnerResourceOuterResourcePage.rowNum();
    await outerInnerResourceOuterResourcePage.openCreateModal();
    expect(
      await (await outerInnerResourceModalPage.outerResourceCreateSaveBtn()).isEnabled()
    ).eq(false);
    await outerInnerResourceOuterResourcePage.closeCreateModal(true);
    expect(
      await outerInnerResourceOuterResourcePage.rowNum(),
      'An extra outerResource was created'
    ).eq(rowNumBeforeCreate);
  });
  after('clean up', async () => {
    await (await outerInnerResourceOuterResourcePage.getOuterObjectByName(newName)).delete();
  });
});
