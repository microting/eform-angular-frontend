import loginPage from '../../../../Page objects/Login.page';
import insightDashboardPage from '../../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardsViewPage from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel
} from '../../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import {dashboardTotalDataJson, dashboardTotalItems} from '../../../../Page objects/InsightDashboard/ChartData/DashboardTotal.data';
import {$} from '@wdio/globals';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 0, // January
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 5,
    dayTo: 14
  },
  today: true
};

describe('InSight Dashboard - Dashboards - Total', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();

    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Total');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.generateItems(dashboardTotalItems);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 50000, reverse: true });
  });
  it('should compare items headers', async () => {
    await dashboardsViewPage.compareHeaders(dashboardTotalDataJson);
  });
  it('should compare items percentage', async () => {
    await dashboardsViewPage.comparePercentage(dashboardTotalDataJson);
  });
  it('should compare items amounts', async () => {
    await dashboardsViewPage.compareAmounts(dashboardTotalDataJson);
  });
  after(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
  });
});
