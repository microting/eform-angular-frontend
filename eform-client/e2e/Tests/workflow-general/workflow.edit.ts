import loginPage from '../../Page objects/Login.page';
import workflowCasesPage, {
  WorkflowCaseForEdit,
} from '../../Page objects/Workflow/WorkflowCases.page';
import { expect } from 'chai';
import { generateRandmString } from '../../Helpers/helper-functions';
import { format } from 'date-fns';

describe('Workflow cases - Edit', function () {
  before(async () => {
    await loginPage.open('/auth');
    await loginPage.login();
    await workflowCasesPage.goToWorkflowCasesPage();
  });
  it('should not edit workflow case', async () => {
    const firstWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    const modelForUpdate = new WorkflowCaseForEdit();
    modelForUpdate.status = 'Igangværende';
    modelForUpdate.actionPlan = generateRandmString();
    modelForUpdate.description = generateRandmString();
    modelForUpdate.deadline = new Date();
    modelForUpdate.dateOfIncident = new Date();
    await firstWorkflowCase.update(modelForUpdate, true);
    const findWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    // expect(findWorkflowCase.id).equal(1);
    expect(findWorkflowCase.status, 'status has been updated').equal(
      'Vælg status'
    );
    expect(
      findWorkflowCase.dateOfIncident,
      'dateOfIncident has been updated'
    ).equal(firstWorkflowCase.dateOfIncident);
    expect(
      findWorkflowCase.deadline,
      'deadline has been updated'
    ).equal(firstWorkflowCase.deadline);
    expect(findWorkflowCase.description, 'description has been updated').equal(
      firstWorkflowCase.description
    );
    expect(findWorkflowCase.actionPlan, 'actionPlan has been updated').equal(
      firstWorkflowCase.actionPlan
    );
  });
  it('should edit workflow case', async () => {
    const firstWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    const modelForUpdate = new WorkflowCaseForEdit();
    modelForUpdate.status = 'Igangværende';
    modelForUpdate.actionPlan = generateRandmString();
    modelForUpdate.description = generateRandmString();
    modelForUpdate.deadline = new Date();
    modelForUpdate.dateOfIncident = new Date();
    await firstWorkflowCase.update(modelForUpdate);
    const findWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    expect(findWorkflowCase.id).equal(1);
    expect(findWorkflowCase.status, 'status not updated').equal(
      modelForUpdate.status
    );
    expect(
      findWorkflowCase.dateOfIncident,
      'dateOfIncident not updated'
    ).equal(format(modelForUpdate.dateOfIncident, 'dd.MM.yyyy'));
    expect(
      findWorkflowCase.deadline,
      'deadline not updated'
    ).equal(format(modelForUpdate.deadline, 'dd.MM.yyyy'));
    expect(findWorkflowCase.description, 'description not updated').equal(
      modelForUpdate.description
    );
    expect(findWorkflowCase.actionPlan, 'actionPlan not updated').equal(
      modelForUpdate.actionPlan
    );
  });
});
