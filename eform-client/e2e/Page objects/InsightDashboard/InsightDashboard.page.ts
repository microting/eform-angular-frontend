import Page from '../Page';

export class InsightDashboardPage extends Page {
  constructor() {
    super();
  }
  public InsightDashboardDropDown() {
    $(`//*[contains(@class, 'dropdown')]//*[contains(text(), 'Insight Instrumentbræt')]`).click();
  }
  public get SurveysConfigsBtn() {
    $('#insight-dashboard-pn-surveys-configs').waitForDisplayed({timeout: 30000});
    $('#insight-dashboard-pn-surveys-configs').waitForClickable({timeout: 20000});
    return $('#insight-dashboard-pn-surveys-configs');
  }
  public get DashboardsBtn() {
    $('#insight-dashboard-pn-dashboards').waitForDisplayed({timeout: 30000});
    $('#insight-dashboard-pn-dashboards').waitForClickable({timeout: 20000});
    return $('#insight-dashboard-pn-dashboards');
  }
  goToSurveysConfigs() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.SurveysConfigsBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
  goToDashboards() {
    this.InsightDashboardDropDown();
    browser.pause(1000);
    this.DashboardsBtn.click();
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
