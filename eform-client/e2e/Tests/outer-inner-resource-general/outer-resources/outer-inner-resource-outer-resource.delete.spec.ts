import outerInnerResourceOuterResourcePage, {
  ListRowObject,
} from '../../../Page objects/OuterInnerResource/OuterInnerResourceOuterResource.page';
import loginPage from '../../../Page objects/Login.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const newName = generateRandmString();

describe('Machine Area Machine delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await outerInnerResourceOuterResourcePage.goToOuterResource();
  });
  it('should add machine', async () => {
    await outerInnerResourceOuterResourcePage.createNewInnerResource(newName);
  });
  it('should not delete machine', async () => {
    const rowNumBeforeDelete = await outerInnerResourceOuterResourcePage.rowNum();
    await (await outerInnerResourceOuterResourcePage
      .getOuterObjectByName(newName))
      .delete(true);
    expect(await outerInnerResourceOuterResourcePage.rowNum(), 'Area is deleted').eq(
      rowNumBeforeDelete
    );
  });
  it('should delete machine', async () => {
    const rowNumBeforeDelete = await outerInnerResourceOuterResourcePage.rowNum();
    await (await outerInnerResourceOuterResourcePage.getOuterObjectByName(newName)).delete();
    expect(await
        outerInnerResourceOuterResourcePage.rowNum(),
      'Area is not deleted'
    ).eq(rowNumBeforeDelete - 1);
  });
});
