import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';
import { generateRandmString } from '../helper-functions';

const testTag = 'Test tag';
const newEformLabel = generateRandmString();

test.describe('Main page', () => {
  let page: Page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should create eform', async () => {
    await (await myEformsPage.idSortBtn()).click();
    const rowCountBeforeCreation = await myEformsPage.rowNum();
    await myEformsPage.createNewEform(newEformLabel);
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.eFormName).toBe(newEformLabel);
    const rowCountAfterCreation = await myEformsPage.rowNum();
    expect(rowCountBeforeCreation + 1).toBe(rowCountAfterCreation);
  });

  test('should not perform any changes by doing nothing and clicking "Save" in tag edit window', async () => {
    const eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    await eform.editTagsBtn.click();
    await (await myEformsPage.tagEditSaveBtn()).click();
    expect(
      (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).tags.length
    ).toBe(0);
  });

  test('should create tag', async () => {
    await myEformsPage.createNewTag(testTag);
    await loginPage.waitForSpinnerHide(40000);
  });

  test('should add already prepared tag to eform', async () => {
    await (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).addTag(testTag);
    await page.waitForTimeout(500);
    expect(
      await (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).tags[0].textContent()
    ).toBe(testTag);
  });

  test('should delete eForm tag from eform', async () => {
    let eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    await eform.deleteTags([testTag]);
    await loginPage.waitForSpinnerHide(40000);
    await page.waitForTimeout(500);
    eform = await myEformsPage.getEformsRowObjByNameEForm(newEformLabel);
    expect(eform.tags.length).toBe(0);
  });

  test('should delete tag from list', async () => {
    await myEformsPage.removeTag(testTag);
    await loginPage.waitForSpinnerHide(40000);
  });

  test('should delete existing eform', async () => {
    const rowCountBeforeDelete = await myEformsPage.rowNum();
    await (await myEformsPage.getEformsRowObjByNameEForm(newEformLabel)).deleteEForm();
    await page.waitForTimeout(500);
    const rowCountAfterDelete = await myEformsPage.rowNum();
    expect(rowCountBeforeDelete - 1).toBe(rowCountAfterDelete);
  });
});
