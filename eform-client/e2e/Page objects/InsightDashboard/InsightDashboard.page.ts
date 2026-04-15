import Page from '../Page';
import { $ } from '@wdio/globals';
import path from "path";
import loginPage from "../Login.page";

export class InsightDashboardPage extends Page {
  constructor() {
    super();
  }

  public async InsightDashboardDropDown() {
    const ele = await $(`#insight-dashboard-pn`);
    await ele.waitForDisplayed({timeout: 30000});
    await ele.waitForClickable({timeout: 20000});
    return ele;
  }

  public async SurveysConfigsBtn() {
    const insightDashboardPnSurveysConfigs = await $('#insight-dashboard-pn-surveys-configs');
    // await insightDashboardPnSurveysConfigs.waitForDisplayed({timeout: 30000});
    // await insightDashboardPnSurveysConfigs.waitForClickable({timeout: 20000});
    return insightDashboardPnSurveysConfigs;
  }

  public async DashboardsBtn() {
    const insightDashboardPnDashboardsBtn = await $('#insight-dashboard-pn-dashboards');
    // await insightDashboardPnDashboardsBtn.waitForDisplayed({timeout: 30000});
    // await insightDashboardPnDashboardsBtn.waitForClickable({timeout: 20000});
    return insightDashboardPnDashboardsBtn;
  }

  public async AnswersBtn() {
    const answersBtn = await $('#insight-dashboard-pn-answers');
    // await answersBtn.waitForDisplayed({timeout: 30000});
    // await answersBtn.waitForClickable({timeout: 20000});
    return answersBtn;
  }

  async goToSurveysConfigs() {
    // if dropdown is not opened
    if (!await (await this.SurveysConfigsBtn()).isDisplayed()) {
      await (await this.InsightDashboardDropDown()).click();
    }
    await (await this.SurveysConfigsBtn()).waitForClickable({timeout: 20000});
    await (await this.SurveysConfigsBtn()).click();
  }

  async goToDashboards() {
    // if dropdown is not opened
    await loginPage.open('/plugins/insight-dashboard-pn/dashboards');
    // await browser.pause(2500);
    // if (!await (await this.DashboardsBtn()).isDisplayed()) {
    //   await (await this.InsightDashboardDropDown()).click();
    // }
    // await (await this.DashboardsBtn()).waitForClickable({timeout: 20000});
    // await (await this.DashboardsBtn()).click();
    await browser.pause(2500);
    await this.takeScreenshot();
    await (await $('#createDashboardBtn')).waitForDisplayed({timeout: 30000});
  }

  public async takeScreenshot() {
    const timestamp = new Date().toLocaleString('iso', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/[ ]/g, '--').replace(':', '-');

    // get current test title and clean it, to use it as file name
    const filename = encodeURIComponent(
      `chrome-${timestamp}`.replace(/[/]/g, '__')
    ).replace(/%../, '.');

    const filePath = path.resolve('./', `${filename}.png`);

    console.log('Saving screenshot to:', filePath);
    await browser.saveScreenshot(filePath);
    console.log('Saved screenshot to:', filePath);
  }

  async goToAnswers() {
    // if dropdown is not opened
    if (!await (await this.AnswersBtn()).isDisplayed()) {
      await (await this.InsightDashboardDropDown()).click();
    }
    await (await this.AnswersBtn()).waitForClickable({timeout: 20000});
    await (await this.AnswersBtn()).click();
  }
}

const insightDashboardPage = new InsightDashboardPage();
export default insightDashboardPage;
