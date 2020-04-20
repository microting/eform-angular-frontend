import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardEditPage from '../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import dashboardsViewPage from '../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';

describe('Insight Dashboard - Dashboards - Edit', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
  });
  it('should create initial empty item', function () {
    $('#dashboardUpdateSaveBtn').waitForDisplayed({timeout: 10000});
    const itemNumsBeforeInitialItem = dashboardEditPage.rowNum;
    dashboardEditPage.createFirstItem();
    expect(itemNumsBeforeInitialItem).equal(dashboardEditPage.rowNum - 1);
  });
  it('should delete item', function () {
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const itemNumsBeforeRemoveItem = dashboardEditPage.rowNum;
    const item = dashboardEditPage.getDashboardItem(itemNumsBeforeRemoveItem);
    dashboardEditPage.deleteItem(item);
    expect(itemNumsBeforeRemoveItem).equal(dashboardEditPage.rowNum + 1);
  });
  it('should create new item', function () {
    const itemNumsBeforeInitialItem = dashboardEditPage.rowNum;
    dashboardEditPage.createFirstItem();
    expect(itemNumsBeforeInitialItem).equal(dashboardEditPage.rowNum - 1);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const itemNumsBeforeCreateItem = dashboardEditPage.rowNum;
    const item = dashboardEditPage.getDashboardItem(itemNumsBeforeCreateItem);
    dashboardEditPage.createItem(item);
    expect(itemNumsBeforeCreateItem).equal(dashboardEditPage.rowNum - 1);
  });
  it('should copy empty item', function () {
    const itemNumsBeforeCopyItem = dashboardEditPage.rowNum;
    const item = dashboardEditPage.getDashboardItem(itemNumsBeforeCopyItem);
    dashboardEditPage.copyItem(item);
    expect(itemNumsBeforeCopyItem).equal(dashboardEditPage.rowNum - 1);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  });
  it('should save filled item', function () {
    insightDashboardPage.goToDashboards();
    dashboardsPage.createDashboard();
    const itemNumsBeforeCreateItem = dashboardEditPage.rowNum;
    dashboardEditPage.createFirstItem();
    dashboardEditPage.fillItem(itemNumsBeforeCreateItem + 1);
    dashboardEditPage.dashboardUpdateSaveBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    dashboardsViewPage.returnToDashboards.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    const dashboardRowNum = dashboardsPage.rowNum;
    const createdDashboard = dashboardsPage.getDashboard(dashboardRowNum);
    createdDashboard.dashboardEditBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    expect(itemNumsBeforeCreateItem).equal(dashboardEditPage.rowNum - 1);
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    dashboardEditPage.dashboardUpdateSaveCancelBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  });
});
