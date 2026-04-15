import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage, {configName} from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';
import { $ } from '@wdio/globals';


describe('InSight Dashboard - Survey Config - Add', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToSurveysConfigs();
  });
  it('Should create survey config', async () => {
    await (await $('#createSurveyConfigBtn')).waitForDisplayed({timeout: 30000});
    await surveyConfigsPage.createSurveyConfig(configName);
    const surveyConfig = await surveyConfigsPage.getFirstRowObject();
    expect(surveyConfig.surveyName).equal(configName);
  });
  it('Should not create survey config', async () => {
    const rowNumsBeforeCreate = await surveyConfigsPage.rowNum();
    await (await $('#createSurveyConfigBtn')).waitForDisplayed({timeout: 10000});
    await surveyConfigsPage.createSurveyConfig_Cancels();
    expect(rowNumsBeforeCreate).equal(await surveyConfigsPage.rowNum());
  });
});
