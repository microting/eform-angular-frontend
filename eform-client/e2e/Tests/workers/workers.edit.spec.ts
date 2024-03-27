import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import workers from '../../Page objects/Workers.page';


import {expect} from 'chai';

describe('Workers page should edit Worker', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToWorkers();
    await browser.pause(8000);
  });
  it('with first and last name', async () => {
    const name = 'Foo';
    const surName = 'Bar';
    const workerBeforEdit = await workers.getWorker(await workers.rowNum());
    await workers.editWorker(workerBeforEdit, name,  surName);
    const workerAfterEdit = await workers.getWorker(await workers.rowNum());
    expect(workerAfterEdit.firstName).equal(name);
    expect(workerAfterEdit.lastName).equal(surName);
  });
  it('with special character', async () => {
    const name = 'tóíǻøæ';
    const surName = '¡@£$½';
    const workerBeforEdit = await workers.getWorker((await workers.rowNum()) + 1);
    await workers.editWorker(workerBeforEdit, name , surName);
    const workerAfterEdit = workers.getWorker((await workers.rowNum()) + 1);
    expect(workerAfterEdit.firstName).equal(name);
    expect(workerAfterEdit.lastName).equal(surName);
  });
// TODO add what it shouldn't be able to edit to.
});
