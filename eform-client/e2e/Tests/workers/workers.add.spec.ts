import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import workers from '../../Page objects/Workers.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';

const expect = require('chai').expect;

describe('Workers page ', function () {
  before(async () => {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    deviceUsersPage.createNewDeviceUser('Gurkemine', 'Ralphine');
    browser.pause(3000);
    myEformsPage.Navbar.goToWorkers();
    $('#workerCreateBtn ').waitForDisplayed({timeout: 8000});
  });
  it('should add new Worker with first and last name', async () => {
    const name = 'Monty';
    const surName = 'Python';
    workers.createNewWorker(name, surName);
    browser.pause(2000);
    const newWorker = workers.getWorker(workers.rowNum);
    expect(newWorker.firstName).equal(name);
    expect(newWorker.lastName).equal(surName);
  });
  it('should add new Worker with special character', async () => {
    const name = 'René';
    const surName = 'Éhl©µ';
    workers.createNewWorker(name, surName);
    browser.pause(2000);
    const newWorker = workers.getWorker(workers.rowNum + 1);
    expect(newWorker.firstName).equal(name);
    expect(newWorker.lastName).equal(surName);
  });
  // TODO
  // it('should NOT add new worker with first name only', async () => {
  //   const name = 'Anders';
  //   workers.createNewWorker(name, '');
  //   const newWorker = workers.getWorker(workers.rowNum);
  //   expect(newWorker.firstName).equal(name);
  // });
  // it('should NOT add new worker with last name only', async () => {
  //   const surName = 'Kragh';
  //   workers.createNewWorker('' , surName);
  //   const newWorker = workers.getWorker(workers.rowNum);
  //   expect(newWorker.lastName).equal(surName);
  // });
  // it('should NOT add new worker with no name', async () => {
  //   const name = '';
  //   const surName = '';
  //   workers.createNewWorker(name , surName);
  //   const newWorker = workers.getWorker(workers.rowNum);
  //   expect(newWorker.firstName).equal('');
  //   expect(newWorker.lastName).equal('');
  // });

});
