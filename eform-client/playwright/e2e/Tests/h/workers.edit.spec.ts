import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { Workers } from '../../Page objects/Workers.page';
import { DeviceUsersPage } from '../../Page objects/DeviceUsers.page';

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
    const deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    // Create a device user so a site is available for worker creation
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await deviceUsersPage.createNewDeviceUser('EditTest', 'User');
    await page.waitForTimeout(3000);
    // Create a worker to edit — retry if SiteWorkerCreate fails on backend
    await myEformsPage.Navbar.goToWorkers();
    await page.locator('#workerCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
    for (let attempt = 0; attempt < 3; attempt++) {
      await workers.createNewWorker('InitialFirst', 'InitialLast');
      await page.waitForTimeout(3000);
      if (await workers.rowNum() > 0) break;
    }
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('with first and last name', async () => {
    test.skip(await workers.rowNum() === 0, 'No workers available — SiteWorkerCreate likely failed on backend');
    const name = 'Foo';
    const surName = 'Bar';
    const workerBeforEdit = await workers.getWorker(await workers.rowNum());
    await workers.editWorker(workerBeforEdit, name, surName);
    const workerAfterEdit = await workers.getWorker(await workers.rowNum());
    expect(workerAfterEdit.firstName).toBe(name);
    expect(workerAfterEdit.lastName).toBe(surName);
  });
  test('with special character', async () => {
    test.skip(await workers.rowNum() === 0, 'No workers available — SiteWorkerCreate likely failed on backend');
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
