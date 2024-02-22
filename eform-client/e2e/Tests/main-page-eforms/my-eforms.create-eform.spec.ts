import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';

const expect = require('chai').expect;
let arrayNamesTag = new Array<string>();
before(async () => {
  await loginPage.open('/');
  await loginPage.login();
});
describe('My eforms', function () {
  it('should create eform without any tags', async () => {
    const newEformLabel = Guid.create().toString();
    await myEformsPage.createNewEform(newEformLabel);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).equal(0);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    const newRowCount = await myEformsPage.rowNum();
    expect(+countBeforeDelete - 1).eq(newRowCount);
  });
  it('should create eform simultaneously with creating 1 tag', async () => {
    const newEformLabel = Guid.create().toString();
    const createdTag = Guid.create().toString();
    await myEformsPage.createNewEform(newEformLabel, [createdTag]);
    arrayNamesTag.push(createdTag);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).equal(1);
    expect(await eform.tags[0].getText()).equal(createdTag);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    const newRowCount = await myEformsPage.rowNum();
    expect(countBeforeDelete - 1).eq(newRowCount);

  });
  it('should create eform simultaneously with creating 2 tags', async () => {
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString(), Guid.create().toString()];
    await myEformsPage.createNewEform(newEformLabel, [createdTags]);
    arrayNamesTag = [...arrayNamesTag, ...createdTags];
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).equal(createdTags.length);
    expect(tagsTexts).to.include.members(createdTags);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(await myEformsPage.rowNum());
  });
  it('should create eform with creating 1 tag and using 1 already prepared tag', async () => {
    const newEformLabel = Guid.create().toString();
    const createdTags = [Guid.create().toString()];
    const tagAddedNum = 1;
    const addedAndSelectedTags = await myEformsPage.createNewEform(newEformLabel, [createdTags], tagAddedNum);
    arrayNamesTag = [...arrayNamesTag, ...createdTags];
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).equal(createdTags.length + tagAddedNum);
    expect(tagsTexts).to.include.members(createdTags);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(await myEformsPage.rowNum());
  });
  it('should create eform while adding 1 already prepared tag', async () => {
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 1;
    const addedAndSelectedTags = await myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).equal(tagAddedNum);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(await myEformsPage.rowNum());
  });
  it('should create eform while adding more than 2 already prepared tags', async () => {
    const newEformLabel = Guid.create().toString();
    const tagAddedNum = 2;
    const addedAndSelectedTags = await myEformsPage.createNewEform(newEformLabel, [], tagAddedNum);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    let tagsTexts = [];
    for (let i = 0; i < eform.tags.length; i++) {
      tagsTexts.push(await eform.tags[i].getText());
    }
    expect(eform.tags.length).equal(tagAddedNum);
    expect(tagsTexts).to.include.members(addedAndSelectedTags.selected);
    const countBeforeDelete = await myEformsPage.rowNum();
    await eform.deleteEForm();
    expect(countBeforeDelete - 1).eq(await myEformsPage.rowNum());
    await myEformsPage.removeTags(arrayNamesTag);
  });
  it('should not create eform if xml is empty', async () => {
    await (await myEformsPage.newEformBtn()).click();
    await (await myEformsPage.createEformBtn()).waitForDisplayed({timeout: 5000});
    expect(await (await myEformsPage.createEformBtn()).isEnabled()).equal(false);
  });
});
