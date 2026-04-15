import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import { $ } from '@wdio/globals';

describe('InSight Dashboard - Dashboards - Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard();
    await insightDashboardPage.goToDashboards();
  });
  it('should not delete dashboard', async () => {
    const rowNumsBeforeDelete = await dashboardsPage.rowNum();
    await (await $('#createDashboardBtn')).waitForDisplayed({timeout: 10000});
    await dashboardsPage.deleteDashboard_Cancels(rowNumsBeforeDelete);
    expect(rowNumsBeforeDelete).equal(await dashboardsPage.rowNum());
  });
  it('should delete dashboard', async () => {
    await $('#createDashboardBtn').waitForDisplayed({timeout: 10000});
    const rowNumsBeforeDelete = await dashboardsPage.rowNum();
    await dashboardsPage.deleteDashboard(rowNumsBeforeDelete);
    await insightDashboardPage.goToDashboards();
    expect(rowNumsBeforeDelete).equal(await dashboardsPage.rowNum() + 1);
  });
  after(async () => {
    await dashboardsPage.clearTable();
  })
});
