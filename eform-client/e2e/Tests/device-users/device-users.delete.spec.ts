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
  it('should not delete if cancel was clicked', function () {
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    $('#deviceUserId').waitForDisplayed({timeout: 20000});
    const lastDeviceUser = deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    lastDeviceUser.deleteBtn.waitForDisplayed({timeout: 5000});
    lastDeviceUser.deleteBtn.waitForClickable({ timeout: 20000});
    lastDeviceUser.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    deviceUsersPage.cancelDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const rowNumAfterCancelDelete = deviceUsersPage.rowNum;
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
  it('should delete user', function () {
    loginPage.open('/');
    myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = deviceUsersPage.rowNum;
    $('#deviceUserId').waitForDisplayed({timeout: 20000});
    const lastDeviceUser = deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    lastDeviceUser.deleteBtn.waitForDisplayed({timeout: 5000});
    lastDeviceUser.deleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    deviceUsersPage.saveDeleteBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 90000, reverse: true});
    const rowNumAfterDelete = deviceUsersPage.rowNum;
    expect(rowNumBeforeDelete, 'User deleted incorrectly').equal(rowNumAfterDelete + 1);
  });
});
