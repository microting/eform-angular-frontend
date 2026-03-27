import { test, expect, Page } from '@playwright/test';
import { LoginPage } from '../Page objects/Login.page';
import { MyEformsPage } from '../Page objects/MyEforms.page';
import { generateRandmString } from '../helper-functions';

const testTag1 = 'Test tag';
const testTag2 = 'Tag for test';
const countCreateEForm = 3;
let countRowsBeforeFiltering = 0;
const namesEForms = new Array<string>();

test.describe('My eforms', () => {
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
    // delete created checklist
    await myEformsPage.Navbar.goToMyEForms();
    await myEformsPage.clearEFormTable();
    await page.close();
  });

  test('should be able to filter by 1 word in label input', async () => {
    await (await myEformsPage.idSortBtn()).click();
    await loginPage.waitForSpinnerHide();
    for (let i = 0; i < countCreateEForm; i++) {
      const newEForm = generateRandmString();
      await myEformsPage.createNewEform(newEForm);
      namesEForms.push(newEForm);
    }
    const nameEFormForFiltering = namesEForms[1];
    countRowsBeforeFiltering = await myEformsPage.rowNum();
    expect(countRowsBeforeFiltering).toBe(3);
    await (await myEformsPage.eformFilter()).fill(nameEFormForFiltering);
    await loginPage.waitForSpinnerHide();
    await page.waitForTimeout(2000);
    const eform = myEformsPage.getEformsRowObjByNameEForm(
      nameEFormForFiltering
    );
    expect(eform).not.toBe(null);
  });

  test('should be able to see all eforms by leaving label input empty', async () => {
    await (await myEformsPage.eformFilter()).click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');
    await page.waitForTimeout(2000);
    expect(await myEformsPage.rowNum()).toBe(3);
  });

  test('should be able to filter using 1 tag', async () => {
    await myEformsPage.createNewTags([testTag1, testTag2]);
    let form = await myEformsPage.getEformsRowObjByNameEForm(namesEForms[1]);
    await form.addTag(testTag2);
    form = await myEformsPage.getEformsRowObjByNameEForm(namesEForms[2]);
    await form.addTag(testTag1);
    await myEformsPage.enterTagFilter(testTag1);
    expect(form.eFormName).toBe((await myEformsPage.getFirstMyEformsRowObj()).eFormName);
  });

  test('should be able to filter using several tags', async () => {
    await myEformsPage.enterTagFilter(testTag2);
    expect(await myEformsPage.rowNum()).toBe(2);
  });
});
