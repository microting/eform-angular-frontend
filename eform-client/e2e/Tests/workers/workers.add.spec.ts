import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import workers from '../../Page objects/Workers.page';

describe('Workers page should add new Worker', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToWorkers();
    browser.pause(8000);
  });
  it('with first and last name', function () {
    const name = 'Monty';
    const surName = 'Python';
    workers.createNewWorker(name,  surName);

  });
});
