import Page from '../Page';
import {expect} from "chai";
import dashboardEditPage from './InsightDashboard-DashboardEdit.page';

export const firstQuestion = 'Q2';
export const filterQuestion = 'Q3';
export const filterAnswer = 'Meget glad';
export const period = 'Måned';
export const chartType = 'Linje';

export class InsightDashboardDashboardViewPage extends Page {
  constructor() {
    super();
  }

  public get rowNum(): number {
    browser.pause(500);
    return $$('#dashboardViewItem').length;
  }

  public get returnToDashboards() {
    $('#returnToPrevious').waitForDisplayed({timeout: 30000});
    $('#returnToPrevious').waitForClickable({timeout: 20000});
    return $('#returnToPrevious');
  }

  public firstQuestion(rowNum: number) {
    return $(`#firstQuestion${rowNum}`);
  }

  public filterQuestion(rowNum: number) {
    return $(`#filterQuestion${rowNum}`);
  }

  public filterAnswer(rowNum: number) {
    return $(`#filterAnswer${rowNum}`);
  }

  public period(rowNum: number) {
    return $(`#period${rowNum}`);
  }

  public chartType(rowNum: number) {
    return $(`#chartType${rowNum}`);
  }

  compareItem(rowNum: number) {
    expect(this.firstQuestion(rowNum).getText()).equal(firstQuestion);
    expect(this.filterQuestion(rowNum).getText()).equal(filterQuestion);
    expect(this.filterAnswer(rowNum).getText()).equal(filterAnswer);
  }
}

const dashboardsViewPage = new InsightDashboardDashboardViewPage();
export default dashboardsViewPage;
