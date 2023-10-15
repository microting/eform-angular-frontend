import outerInnerResourceInnerResourcePage, {
  ListRowObject,
} from '../../../Page objects/OuterInnerResource/OuterInnerResourceInnerResource.page';
import outerInnerResourceModalPage from '../../../Page objects/OuterInnerResource/OuterInnerResourceModal.page';
import loginPage from '../../../Page objects/Login.page';
import { generateRandmString } from '../../../Helpers/helper-functions';

const expect = require('chai').expect;
const nameInnerResource = generateRandmString();

describe('Machine Area Area delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await outerInnerResourceInnerResourcePage.goToInnerResource();
  });
  it('should create a new area', async () => {
    await outerInnerResourceInnerResourcePage.createNewInnerResource(
      nameInnerResource
    );
  });
  it('should not delete area', async () => {
    const rowNumBeforeDelete = await outerInnerResourceInnerResourcePage.rowNum();
    const listRowObject = await outerInnerResourceInnerResourcePage.getInnerObjectByName(
      nameInnerResource
    );
    await listRowObject.delete(true);
    expect(await outerInnerResourceInnerResourcePage.rowNum(), 'Area is deleted').eq(
      rowNumBeforeDelete
    );
  });
  it('should delete area', async () => {
    const rowNumBeforeDelete = await outerInnerResourceInnerResourcePage.rowNum();
    const listRowObject = await outerInnerResourceInnerResourcePage.getInnerObjectByName(
      nameInnerResource
    );
    await listRowObject.delete();
    expect(
      await outerInnerResourceInnerResourcePage.rowNum(),
      'Area is not deleted'
    ).eq(rowNumBeforeDelete - 1);
  });
});
