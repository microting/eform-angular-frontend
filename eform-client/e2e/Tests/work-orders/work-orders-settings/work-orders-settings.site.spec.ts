import loginPage from '../../../Page objects/Login.page';
import myEformsPage from '../../../Page objects/MyEforms.page';
import {Guid} from 'guid-typescript';
import deviceUsersPage, {DeviceUsersRowObject} from '../../../Page objects/DeviceUsers.page';
import workOrdersPage from '../../../Page objects/WorkOrders.page';

const expect = require('chai').expect;

describe('Work Order Settings Site', function () {
  before(function () {
    loginPage.open('/');
    loginPage.login();
    myEformsPage.Navbar.goToDeviceUsersPage();
    $('#newDeviceUserBtn').waitForDisplayed({timeout: 20000});
  });
  it('Create Device User', function () {
    const name = Guid.create().toString();
    const surname = Guid.create().toString();
    const rowCountBeforeCreation = deviceUsersPage.rowNum;
    deviceUsersPage.createNewDeviceUser(name, surname);
    const rowCountAfterCreation = deviceUsersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after creating new user').equal(rowCountBeforeCreation + 1);
    const lastDeviceUser: DeviceUsersRowObject = deviceUsersPage.getDeviceUser(deviceUsersPage.rowNum);
    expect(lastDeviceUser.firstName, 'Name of created user is incorrect').equal(name);
    expect(lastDeviceUser.lastName, 'Last name of created user is incorrect').equal(surname);
  });
  it('Add Site', function() {
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountBeforeCreation = workOrdersPage.rowNum;
    $('#addNewSiteBtn').click();
    $('#selectDeviceUser').waitForDisplayed({timeout: 20000});
    $('#selectDeviceUser').click();
    $$('#selectDeviceUser .ng-option')[0].click();
    $('#siteAssignBtnSave').click();
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountAfterCreation = workOrdersPage.rowNum;
    expect(rowCountAfterCreation, 'Number of rows hasn\'t changed after adding site').equal(rowCountBeforeCreation + 1);
  });
  it('Cancel Removing Site', function () {
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#removeSiteBtn').waitForEnabled({timeout: 20000});
    const rowCountBefore = workOrdersPage.rowNum;
    $$('#removeSiteBtn')[$$('#removeSiteBtn').length - 1].click();
    $('#removeSiteSaveCancelBtn').waitForDisplayed({timeout: 20000});
    $('#removeSiteSaveCancelBtn').click();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore);
  });
  it('Remove Site', function () {
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#removeSiteBtn').waitForEnabled({timeout: 20000});
    const rowCountBefore = workOrdersPage.rowNum;
    $$('#removeSiteBtn')[$$('#removeSiteBtn').length - 1].click();
    $('#removeSiteSaveBtn').waitForDisplayed({timeout: 20000});
    $('#removeSiteSaveBtn').click();
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#removeSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore - 1);
  });
  it('Cancel Adding Site', function() {
    workOrdersPage.goToWorkOrdersSettingsPage();
    $('#addNewSiteBtn').waitForDisplayed({timeout: 20000});
    const rowCountBefore = workOrdersPage.rowNum;
    $('#addNewSiteBtn').click();
    $('#selectDeviceUser').waitForDisplayed({timeout: 20000});
    $('#selectDeviceUser').click();
    $$('#selectDeviceUser .ng-option')[0].click();
    $('#siteAssignBtnSaveCancel').click();
    const rowCountAfter = workOrdersPage.rowNum;
    expect(rowCountAfter, 'Number of rows has changed').equal(rowCountBefore);
  });
});
