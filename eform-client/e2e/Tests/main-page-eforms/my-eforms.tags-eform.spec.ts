import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import { generateRandmString } from '../../Helpers/helper-functions';
import { $ } from '@wdio/globals';

const expect = require('chai').expect;
const testTag = 'Test tag';
const newEformLabel = generateRandmString();
describe('Main page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
  });
  it('should create eform', async () => {
    await (await myEformsPage.idSortBtn()).click();
    const rowCountBeforeCreation = await myEformsPage.rowNum();
    await myEformsPage.createNewEform(newEformLabel);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.eFormName).eq(newEformLabel);
    const rowCountAfterCreation = await myEformsPage.rowNum();
    expect(rowCountBeforeCreation + 1).eq(rowCountAfterCreation);
  });
  it('should not perform any changes by doing nothing and clicking "Save" in tag edit window', async () => {
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    await eform.editTagsBtn.click();
    await (await myEformsPage.tagEditSaveBtn()).click();
    expect(
      (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).tags.length
    ).eq(0);
  });
  it('should create tag', async () => {
    const elem = await $('#toast-container');
    await elem.waitForDisplayed({ timeout: 40000, reverse: true });
    await myEformsPage.createNewTag(testTag);
    await elem.waitForDisplayed({ timeout: 40000 });
    expect(await elem.getText()).eq(`Tag "${testTag}" oprettet`);
  });
  it('should add already prepared tag to eform', async () => {
    await (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).addTag(testTag);
    await browser.pause(500);
    expect(
      await (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).tags[0].getText()
    ).eq(testTag);
  });
  it('should delete eForm tag from eform', async () => {
    let eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    const elem = await $('#toast-container');
    await elem.waitForDisplayed({ timeout: 40000, reverse: true });
    await eform.deleteTags([testTag]);
    await elem.waitForDisplayed({ timeout: 40000 });
    await elem.click();
    await browser.pause(500);
    eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).eq(0);
  });
  it('should delete tag from list', async () => {
    const elem = await $('#toast-container');
    await elem.waitForDisplayed({ timeout: 40000, reverse: true });
    await myEformsPage.removeTag(testTag);
    await elem.waitForDisplayed({ timeout: 40000 });
    expect(await elem.getText()).eq(`Tag slettet`);
  });
  it('should delete existing eform', async () => {
    const rowCountBeforeDelete = await myEformsPage.rowNum();
    await (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).deleteEForm();
    await browser.pause(500);
    const rowCountAfterDelete = await myEformsPage.rowNum();
    expect(rowCountBeforeDelete - 1).eq(rowCountAfterDelete);
  });
});
