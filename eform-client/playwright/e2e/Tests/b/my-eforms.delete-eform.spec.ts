import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { Guid } from 'guid-typescript';

let page;

test.describe('Main Page', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/');
    await loginPage.login();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should create eform', async () => {
    const myEformsPage = new MyEformsPage(page);
    await (await myEformsPage.idSortBtn()).click();
    const rowCountBeforeCreation = await myEformsPage.rowNum();
    const newEformLabel = Guid.create().toString();
    await myEformsPage.createNewEform(newEformLabel);
    const eform = await myEformsPage.getFirstMyEformsRowObj();
    expect(eform.eFormName).toBe(newEformLabel);
    const rowCountAfterCreation = await myEformsPage.rowNum();
    expect(rowCountBeforeCreation + 1).toBe(rowCountAfterCreation);
  });

  test('should delete existing eform', async () => {
    const myEformsPage = new MyEformsPage(page);
    const rowCountBeforeDelete = await myEformsPage.rowNum();
    const eform = await myEformsPage.getFirstMyEformsRowObj();
    await eform.deleteEForm();
    await page.waitForTimeout(1000);
    const rowCountAfterDelete = await myEformsPage.rowNum();
    expect(rowCountBeforeDelete - 1).toBe(rowCountAfterDelete);
  });
});
