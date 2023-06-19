import loginPage from '../../Page objects/Login.page';
import myEformsPage from '../../Page objects/MyEforms.page';
import deviceUsersPage from '../../Page objects/DeviceUsers.page';

const expect = require('chai').expect;

describe('Device users page', function () {
  before(async () => {
    await loginPage.open('/');
    await loginPage.login();
    await myEformsPage.Navbar.goToDeviceUsersPage();
  });
  it('should not delete if cancel was clicked', async () => {
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await $('#deviceUserId').waitForDisplayed({ timeout: 40000 });
    const lastDeviceUser = await deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    await lastDeviceUser.deleteBtn.waitForDisplayed({ timeout: 5000 });
    await lastDeviceUser.deleteBtn.waitForClickable({ timeout: 40000 });
    await lastDeviceUser.deleteBtn.click();
    await (await deviceUsersPage.cancelDeleteBtn()).click();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumAfterCancelDelete = await deviceUsersPage.rowNum();
    expect(rowNumBeforeDelete).equal(rowNumAfterCancelDelete);
  });
  it('should delete user', async () => {
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumBeforeDelete = await deviceUsersPage.rowNum();
    await (await $('#deviceUserId')).waitForDisplayed({ timeout: 40000 });
    const lastDeviceUser = await deviceUsersPage.getDeviceUser(rowNumBeforeDelete);
    await lastDeviceUser.deleteBtn.waitForDisplayed({ timeout: 5000 });
    await lastDeviceUser.deleteBtn.click();
    await (await deviceUsersPage.saveDeleteBtn()).click();
    await myEformsPage.Navbar.goToDeviceUsersPage();
    const rowNumAfterDelete = await deviceUsersPage.rowNum();
    expect(rowNumBeforeDelete, 'User deleted incorrectly').equal(
      rowNumAfterDelete + 1
    );
  });
});
