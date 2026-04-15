import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage, {configName} from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';
import { $ } from '@wdio/globals';

describe('InSight Dashboard - Survey Config - Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToSurveysConfigs();
    await surveyConfigsPage.createSurveyConfig(configName);
  });
  it('Should not delete survey config', async () => {
    const rowNumsBeforeDelete = await surveyConfigsPage.rowNum();
    await (await $('#createSurveyConfigBtn')).waitForDisplayed({timeout: 10000});
    await surveyConfigsPage.deleteSurveyConfig_Cancels(rowNumsBeforeDelete);
    expect(rowNumsBeforeDelete).equal(await surveyConfigsPage.rowNum());
  });
  it('Should delete survey config', async () => {
    const rowNumsBeforeDelete = await surveyConfigsPage.rowNum();
    await (await $('#createSurveyConfigBtn')).waitForDisplayed({timeout: 10000});
    await surveyConfigsPage.deleteSurveyConfig(rowNumsBeforeDelete);
    const rowsAfterDelete = await surveyConfigsPage.rowNum();
    expect(rowsAfterDelete).equal(rowNumsBeforeDelete - 1);
  });
});
