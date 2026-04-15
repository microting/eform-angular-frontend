import {expect} from 'chai';
import loginPage from '../../../Page objects/Login.page';
import insightDashboardPage from '../../../Page objects/InsightDashboard/InsightDashboard.page';
import answersPage from '../../../Page objects/InsightDashboard/InsightDashboard-Answers.page';
import { $ } from '@wdio/globals';

const microtingUId = 1413005;
describe('InSight Dashboard - Answers - Delete', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await insightDashboardPage.goToAnswers();
  });
  it('should be delete answer', async () => {
    await answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    await answersPage.deleteAnswer();
    await answersPage.searchAnswerByMicrotingUId(microtingUId.toString());
    expect(await answersPage.rowNum()).eq(19);
  });
});
