import {expect} from 'chai';
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

const testItem: DashboardTestItemEditModel = {
  firstQuestion: 'Q2',
  filterQuestion: 'Q3',
  firstQuestionForSelect: '2 - Q2',
  filterQuestionForSelect: '3 - Q3',
  filterAnswer: 'Meget glad',
  period: 'Måned',
  chartType: 'Linje',
  calculateAverage: false,
  ignoredAnswerIds: [],
  comparedItems: []
};

describe('InSight Dashboard - Dashboards - Edit', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard();
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
  });
  it('should create initial empty item', async () => {
    await (await $('#dashboardUpdateSaveBtn')).waitForDisplayed({timeout: 40000});
    const itemNumsBeforeInitialItem = await dashboardEditPage.rowNum();
    await dashboardEditPage.createFirstItem();
    expect(itemNumsBeforeInitialItem).equal(await dashboardEditPage.rowNum() - 1);
  });
  it('should delete item', async () => {
    const itemNumsBeforeRemoveItem = await dashboardEditPage.rowNum();
    const item = await dashboardEditPage.getDashboardItem(itemNumsBeforeRemoveItem);
    await dashboardEditPage.deleteItem(item);
    expect(itemNumsBeforeRemoveItem).equal(await dashboardEditPage.rowNum() + 1);
  });
  it('should create new item', async () => {
    const itemNumsBeforeInitialItem = await dashboardEditPage.rowNum();
    await dashboardEditPage.createFirstItem();
    expect(itemNumsBeforeInitialItem).equal(await dashboardEditPage.rowNum() - 1);
    const itemNumsBeforeCreateItem = await dashboardEditPage.rowNum();
    const item = await dashboardEditPage.getDashboardItem(itemNumsBeforeCreateItem);
    await dashboardEditPage.createItem(item);
    expect(itemNumsBeforeCreateItem).equal(await dashboardEditPage.rowNum() - 1);
  });
  it('should copy empty item', async () => {
    const itemNumsBeforeCopyItem = await dashboardEditPage.rowNum();
    const item = await dashboardEditPage.getDashboardItem(itemNumsBeforeCopyItem);
    await dashboardEditPage.copyItem(item);
    expect(itemNumsBeforeCopyItem).equal(await dashboardEditPage.rowNum() - 1);
  });
  it('should save filled item', async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.createDashboard();
    const itemNumsBeforeCreateItem = await dashboardEditPage.rowNum();
    await dashboardEditPage.setDashboardSettings(dashboardConfig);
    await dashboardEditPage.createFirstItem();
    await dashboardEditPage.fillItem(itemNumsBeforeCreateItem + 1, testItem);
    await (await dashboardEditPage.dashboardUpdateSaveBtn()).click();
    await (await dashboardsViewPage.returnToDashboards()).click();
    await loginPage.waitForSpinnerHide(40000);
    const dashboardRowNum = await dashboardsPage.rowNum();
    const createdDashboard = await dashboardsPage.getDashboard(dashboardRowNum);
    await createdDashboard.clickActionsMenu(dashboardRowNum - 1);
    await createdDashboard.dashboardEditBtn.click();
    await loginPage.waitForSpinnerHide(40000);
    expect(itemNumsBeforeCreateItem).equal(await dashboardEditPage.rowNum() - 1);
    await (await dashboardEditPage.dashboardUpdateSaveCancelBtn()).click();
  });
  after(async () => {
    await insightDashboardPage.goToDashboards();
    await dashboardsPage.clearTable();
  });
});
