import loginPage from '../../Page objects/Login.page';
import itemsPlanningPlanningPage from '../../Page objects/ItemsPlanning/ItemsPlanningPlanningPage';
import tagsModalPage, { TagRowObject } from '../../Page objects/TagsModal.page';

const expect = require('chai').expect;

const tagName = 'Test tag';
const updatedTagName = 'Test tag 2';

describe('Items planning - Tags', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await itemsPlanningPlanningPage.goToPlanningsPage();
    await (await itemsPlanningPlanningPage.planningManageTagsBtn()).click();
  });
  it('should create tag', async () => {
    const tagsRowsBeforeCreate = await tagsModalPage.rowNum();
    await tagsModalPage.createTag(tagName);
    const tagsRowsAfterCreate = await tagsModalPage.rowNum();
    const tagRowObject = new TagRowObject();
    const tagRowObj = await tagRowObject.getRow(tagsRowsAfterCreate);
    expect(
      tagsRowsAfterCreate,
      'Number of rows hasn\'t changed after creating tag'
    ).equal(tagsRowsBeforeCreate + 1);
    expect(tagRowObj.name, 'Saved Name is incorrect').equal(tagName);
  });
  it('should not create tag', async () => {
    const tagsRowsBeforeCreate = await tagsModalPage.rowNum();
    await tagsModalPage.cancelCreateTag(tagName);
    const tagsRowsAfterCreate = await tagsModalPage.rowNum();
    expect(
      tagsRowsAfterCreate,
      'Number of rows changed after not creatings tag'
    ).equal(tagsRowsBeforeCreate);
  });
  it('should update tag', async () => {
    const rowNum = await tagsModalPage.rowNum();
    await tagsModalPage.editTag(rowNum, updatedTagName);
    const tagRowObjectAfterEdit = new TagRowObject();
    const tagRowObj = await tagRowObjectAfterEdit.getRow(rowNum);
    expect(tagRowObj.name, 'Updated tag name is incorrect').equal(
      updatedTagName
    );
  });
  it('should not update tag', async () => {
    const rowNum = await tagsModalPage.rowNum();
    await tagsModalPage.cancelEditTag(rowNum, updatedTagName);
    const tagRowObjectAfterCancelEdit = new TagRowObject();
    const tagRowObj = await tagRowObjectAfterCancelEdit.getRow(rowNum);
    expect(
      tagRowObj.name,
      'Updated tag name is incorrect'
    ).equal(updatedTagName);
  });
  it('should not delete tag', async () => {
    const tagsRowsBeforeDelete = await tagsModalPage.rowNum();
    await (await tagsModalPage.getTagByName(updatedTagName)).deleteTag(true);
    const tagsRowsAfterCancelDelete = await tagsModalPage.rowNum();
    expect(
      tagsRowsAfterCancelDelete,
      'Number of rows changed after cancel delete tag'
    ).equal(tagsRowsBeforeDelete);
  });
  it('should delete tag', async () => {
    const tagsRowsBeforeDelete = await tagsModalPage.rowNum();
    await (await tagsModalPage.getTagByName(updatedTagName)).deleteTag();
    await browser.pause(500);
    const tagsRowsAfterDelete = await tagsModalPage.rowNum();
    expect(
      tagsRowsAfterDelete,
      `Number of rows hasn't changed after delete tag`
    ).equal(tagsRowsBeforeDelete - 1);
  });
});
