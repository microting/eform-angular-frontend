import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { Workers } from '../../Page objects/Workers.page';

test.describe('Workers page should edit Worker', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let workers: Workers;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    workers = new Workers(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToWorkers();
    await page.waitForTimeout(8000);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('with first and last name', async () => {
    const name = 'Foo';
    const surName = 'Bar';
    const workerBeforEdit = await workers.getWorker(await workers.rowNum());
    await workers.editWorker(workerBeforEdit, name, surName);
    const workerAfterEdit = await workers.getWorker(await workers.rowNum());
    expect(workerAfterEdit.firstName).toBe(name);
    expect(workerAfterEdit.lastName).toBe(surName);
  });
  test('with special character', async () => {
    const name = 'tóíǻøæ';
    const surName = '¡@£$½';
    const workerBeforEdit = await workers.getWorker(await workers.rowNum());
    await workers.editWorker(workerBeforEdit, name, surName);
    const workerAfterEdit = await workers.getWorker(await workers.rowNum());
    expect(workerAfterEdit.firstName).toBe(name);
    expect(workerAfterEdit.lastName).toBe(surName);
  });
  // TODO add what it shouldn't be able to edit to.
});
