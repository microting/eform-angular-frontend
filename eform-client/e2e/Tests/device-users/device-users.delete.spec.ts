import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';

const expect = require('chai').expect;

describe('Device users page', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
  });
  it('should delete user', function () {
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    const lastDeviceUser = deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    lastDeviceUser.deleteBtn.waitForVisible(5000);
    lastDeviceUser.deleteBtn.leftClick();
    browser.pause(6000);
    deviceUsersPage.saveDeleteBtn.leftClick();
    browser.pause(6000);
    const rowNumAfterDelete = deviceUsersPage.rowNum;
    expect(rowNumBeforeDelete, 'User deleted incorrectly').equal(rowNumAfterDelete + 1);
  });
  it('should not delete if cancel was clicked', function () {
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    const lastDeviceUser = deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    lastDeviceUser.deleteBtn.waitForVisible(5000);
    lastDeviceUser.deleteBtn.leftClick();
    browser.pause(8000);
    deviceUsersPage.cancelDeleteBtn.leftClick();
    browser.pause(8000);
    const rowNumAfterCancelDelete = deviceUsersPage.rowNum;
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
});
