import loginPage from '../../Page objects/Login.page';
import workflowCasesPage from '../../Page objects/Workflow/WorkflowCases.page';
import { expect } from 'chai';
import { format } from 'date-fns';

describe('Workflow cases - Filtration', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await workflowCasesPage.goToWorkflowCasesPage();
  });
  it('should be able to filtration of all workflow cases', async () => {
    (await workflowCasesPage.searchInput()).setValue(
      '9971c397-61a9-4b6d-aa68-38bf30123360'
    );
    await browser.pause(2000);
    await (await $('#spinner-animation')).waitForDisplayed({ timeout: 90000, reverse: true });
    const findWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    expect(findWorkflowCase.id).equal(3);
    expect(
      findWorkflowCase.dateOfIncident
    ).equal('26.06.2021');
    // expect(format(findWorkflowCase.updateAt, 'dd.MM.yyyy HH:mm:ss')).equal(
    //   '21.06.2021 21:05:30'
    // );
    expect(findWorkflowCase.incidentType).equal(
      '9971c397-61a9-4b6d-aa68-38bf30123360'
    );
    expect(findWorkflowCase.incidentPlace).equal(
      'd23fa495-e8d0-4545-840d-62446f16fe99'
    );
    // expect(findWorkflowCase.photo).equal(false);
    expect(findWorkflowCase.description).equal(
      'b4068568-4bc5-405a-a92f-7d4a3080fc6b'
    );
    expect(findWorkflowCase.deadline).equal(
      '01.07.2021'
    );
    expect(findWorkflowCase.actionPlan).equal(
      '591f85e9-bd96-4ed2-9041-ce6d335e79fb'
    );
    expect(findWorkflowCase.toBeSolvedBy).equal('--');
    expect(findWorkflowCase.status).equal('Igangværende');
  });
});
