import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import dashboardsPage from '../../../Page objects/InsightDashboard/InsightDashboard-Dashboards.page';
import dashboardEditPage, {
  DashboardTestConfigEditModel,
  DashboardTestItemEditModel
} from '../../../Page objects/InsightDashboard/InsightDashboard-DashboardEdit.page';
import dashboardsViewPage from '../../../Page objects/InsightDashboard/InsightDashboard-DashboardView.page';
import { $ } from '@wdio/globals';

const dashboardConfig: DashboardTestConfigEditModel = {
  locationTagName: 'Location 1',
  dateRange: {
    yearFrom: 2016,
    monthFrom: 1,
    dayFrom: 1,
    yearTo: 2020,
    monthTo: 5,
    dayTo: 14
  },
  today: false
};

const item: DashboardTestItemEditModel = {
  firstQuestion: 'Q2',
  filterQuestion: 'Q3',
  firstQuestionForSelect: '2 - Q2',
  filterQuestionForSelect: '3 - Q3',
  // firstQuestion: 'Q2: Er personalet på afsnittet venligt og imødekommende?',
  // filterQuestion: 'Q3: Oplever du, at personalet er forberedt til samtaler med dig om din udredning/behandling?',
  filterAnswer: 'Meget glad',
  period: 'Måned',
  chartType: 'Linje',
  calculateAverage: false,
  ignoredAnswerIds: [],
  comparedItems: []
};

describe('InSight Dashboard - Dashboards - View', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard('Test View');
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
  });
  it('should observe filled item', async () => {
    await dashboardEditPage.generateItems([item]);
    await browser.pause(1000);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
    await browser.pause(5000);
    await (await $('#firstQuestion1')).waitForDisplayed({timeout: 30000});
    await dashboardsViewPage.returnToDashboards();
    await dashboardsViewPage.compareItem(1, item, dashboardConfig);
  });
  after(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
  });
});
