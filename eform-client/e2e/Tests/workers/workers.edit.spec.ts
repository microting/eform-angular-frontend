import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import workers from '../../Page objects/Workers.page';


const expect = require('chai').expect;

describe('Workers page should edit Worker', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToWorkers();
    browser.pause(8000);
  });
  it('with first and last name', async () => {
    const name = 'Foo';
    const surName = 'Bar';
    const workerBeforEdit = workers.getWorker(workers.rowNum);
    workers.editWorker(workerBeforEdit, name,  surName);
    const workerAfterEdit = workers.getWorker(workers.rowNum );
    expect(workerAfterEdit.firstName).equal(name);
    expect(workerAfterEdit.lastName).equal(surName);
  });
  it('with special character', async () => {
    const name = 'tóíǻøæ';
    const surName = '¡@£$½';
    const workerBeforEdit = workers.getWorker(workers.rowNum + 1);
    workers.editWorker(workerBeforEdit, name , surName);
    const workerAfterEdit = workers.getWorker(workers.rowNum + 1);
    expect(workerAfterEdit.firstName).equal(name);
    expect(workerAfterEdit.lastName).equal(surName);
  });
// TODO add what it shouldn't be able to edit to.
});
