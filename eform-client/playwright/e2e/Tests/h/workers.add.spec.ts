import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { MyEformsPage } from '../../Page objects/MyEforms.page';
import { Workers } from '../../Page objects/Workers.page';
import { DeviceUsersPage } from '../../Page objects/DeviceUsers.page';

test.describe('Workers page ', () => {
  let page;
  let loginPage: LoginPage;
  let myEformsPage: MyEformsPage;
  let workers: Workers;
  let deviceUsersPage: DeviceUsersPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    myEformsPage = new MyEformsPage(page);
    workers = new Workers(page);
    deviceUsersPage = new DeviceUsersPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    await deviceUsersPage.createNewDeviceUser('Gurkemine', 'Ralphine');
    await page.waitForTimeout(3000);
    await myEformsPage.Navbar.goToWorkers();
    await page.locator('#workerCreateBtn').waitFor({ state: 'visible', timeout: 40000 });
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('should add new Worker with first and last name', async () => {
    const name = 'Monty';
    const surName = 'Python';
    await workers.createNewWorker(name, surName);
    await page.waitForTimeout(2000);
    const newWorker = await workers.getWorker(await workers.rowNum());
    expect(newWorker.firstName).toBe(name);
    expect(newWorker.lastName).toBe(surName);
  });
  test('should add new Worker with special character', async () => {
    const name = 'René';
    const surName = 'Éhl©µ';
    await workers.createNewWorker(name, surName);
    await page.waitForTimeout(2000);
    const newWorker = await workers.getWorker((await workers.rowNum()) + 1);
    expect(newWorker.firstName).toBe(name);
    expect(newWorker.lastName).toBe(surName);
  });
  // TODO
  // test('should NOT add new worker with first name only', async () => {
  //   const name = 'Anders';
  //   workers.createNewWorker(name, '');
  //   const newWorker = workers.getWorker(workers.rowNum);
  //   expect(newWorker.firstName).toBe(name);
  // });
  // test('should NOT add new worker with last name only', async () => {
  //   const surName = 'Kragh';
  //   workers.createNewWorker('' , surName);
  //   const newWorker = workers.getWorker(workers.rowNum);
  //   expect(newWorker.lastName).toBe(surName);
  // });
  // test('should NOT add new worker with no name', async () => {
  //   const name = '';
  //   const surName = '';
  //   workers.createNewWorker(name , surName);
  //   const newWorker = workers.getWorker(workers.rowNum);
  //   expect(newWorker.firstName).toBe('');
  //   expect(newWorker.lastName).toBe('');
  // });
});
