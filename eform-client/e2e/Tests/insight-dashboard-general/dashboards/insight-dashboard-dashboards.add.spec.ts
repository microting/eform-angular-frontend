import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage, {
  dashboardName,
} from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import { $ } from '@wdio/globals';

describe('InSight Dashboard - Dashboards - Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
  });
  it('should create dashboard', async () => {
    await (await $('#createDashboardBtn')).waitForDisplayed({timeout: 10000});
    await dashboardsPage.createDashboard();
    await insightDashboardPage.goToDashboards();
    const dashboard = await dashboardsPage.getLastRowObject();
    expect(dashboard.dashboardName).equal(dashboardName);
  });
  it('should not create dashboard', async () => {
    const rowNumsBeforeCreate = await dashboardsPage.rowNum();
    await (await $('#createDashboardBtn')).waitForDisplayed({timeout: 10000});
    await dashboardsPage.createDashboard_Cancels();
    expect(rowNumsBeforeCreate).equal(await dashboardsPage.rowNum());
  });
  after(async () => {
    await dashboardsPage.clearTable();
  });
});
