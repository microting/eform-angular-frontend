import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import surveyConfigsPage, {configName} from '../../../Page objects/InsightDashboard/InsightDashboard-SurveysConfigs.page';

describe('Insight Dashboard - Survey Configs - Edit', function () {
  before(function () {
    loginPage.open('/auth');
    loginPage.login();
    insightDashboardPage.goToSurveysConfigs();
    surveyConfigsPage.createSurveyConfig(configName);
  });
  it('Should not update survey config', function () {
    const surveyConfig = surveyConfigsPage.getSurveyConfig(surveyConfigsPage.rowNum);
    const locationsBeforeUpdate = surveyConfig.locations ? surveyConfig.locations.length : 0;
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#createSurveyConfigBtn').waitForDisplayed({timeout: 30000});
    surveyConfigsPage.updateSurveyConfig_Cancels(surveyConfig);
    const locationsAfterUpdate = surveyConfig.locations ? surveyConfig.locations.length : 0;
    expect(locationsAfterUpdate).equal(locationsBeforeUpdate);
  });
  it('Should update survey config', function () {
    const surveyConfig = surveyConfigsPage.getSurveyConfig(surveyConfigsPage.rowNum);
    const locationsBeforeUpdate = surveyConfig.locations ? surveyConfig.locations.length : 0;
    $('#spinner-animation').waitForDisplayed({timeout: 30000, reverse: true});
    $('#createSurveyConfigBtn').waitForDisplayed({timeout: 30000});
    surveyConfigsPage.updateSurveyConfig(surveyConfig);
    const locationsAfterUpdate = surveyConfig.locations ? surveyConfig.locations.length : 0;
    expect(locationsAfterUpdate).equal(locationsBeforeUpdate);
  });
});
