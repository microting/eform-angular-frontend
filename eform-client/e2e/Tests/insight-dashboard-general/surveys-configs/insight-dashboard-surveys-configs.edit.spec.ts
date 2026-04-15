import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage, {configName} from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';
import { $ } from '@wdio/globals';

describe('InSight Dashboard - Survey Configs - Edit', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToSurveysConfigs();
    await surveyConfigsPage.createSurveyConfig(configName);
  });
  it('Should not update survey config', async () => {
    const surveyConfig = await surveyConfigsPage.rowNum();
    await (await $('#createSurveyConfigBtn')).waitForDisplayed({timeout: 30000});
    await surveyConfigsPage.updateSurveyConfig_Cancels(surveyConfig);
  });
  it('Should update survey config', async () => {
    const surveyConfig = await surveyConfigsPage.rowNum();
    await (await $('#createSurveyConfigBtn')).waitForDisplayed({timeout: 30000});
    await surveyConfigsPage.updateSurveyConfig(surveyConfig);
  });
});
