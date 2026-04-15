import loginPage from '../../Page objects/Login.page';
import workflowCasesPage from '../../Page objects/Workflow/WorkflowCases.page';
import { testSorting } from '../../Helpers/helper-functions';
// import { parse } from 'date-fns';

describe('Workflow cases - Sorting', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await workflowCasesPage.goToWorkflowCasesPage();
  });
  it('should be able to sort by ID', async () => {
    await testSorting(await workflowCasesPage.idTableHeader(), '#workflowCaseId', 'ID');
  });
  it('should be able to sort by date of incident', async () => {
    await testSorting(
      await workflowCasesPage.dateOfIncidentHeader(),
      '#workflowCaseDateOfIncident',
      'date of incident'
    );
  });
  it('should be able to sort by incident type', async () => {
    await testSorting(
      await workflowCasesPage.incidentTypeHeader(),
      '#workflowCaseIncidentType',
      'incident type'
    );
  });
  it('should be able to sort by incident place', async () => {
    await testSorting(
      await workflowCasesPage.incidentPlaceHeader(),
      '#workflowCaseIncidentPlace',
      'incident place'
    );
  });
  // it('should be able to sort by photos exists', async () => {
  //   testSorting(
  //     workflowCasesPage.photosExistsHeader,
  //     '#workflowCasePhotosExists',
  //     'photos exists'
  //   );
  // });
  it('should be able to sort by description', async () => {
    await testSorting(
      await workflowCasesPage.descriptionHeader(),
      '#workflowCaseDescription',
      'description'
    );
  });
  // it('should be able to sort by deadline', async () => {
  //   testSorting(
  //     workflowCasesPage.deadlineHeader,
  //     '#workflowCaseDeadline',
  //     'deadline',
  //     (ele) => parse(ele.getText(), 'dd.MM.yyyy HH:mm:ss', new Date())
  //   );
  // });
  it('should be able to sort by action plan', async () => {
    await testSorting(
      await workflowCasesPage.actionPlanHeader(),
      '#workflowCaseActionPlan',
      'action plan'
    );
  });
});
