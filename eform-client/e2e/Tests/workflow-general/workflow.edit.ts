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
    // TODO investigate why this test is failing on 30th of october 2024
    const modelForUpdate = new WorkflowCaseForEdit();
    const dateNow = new Date();
    modelForUpdate.status = 'Igangværende';
    modelForUpdate.actionPlan = generateRandmString();
    modelForUpdate.description = generateRandmString();
    modelForUpdate.deadline = {day: dateNow.getDate(), month: dateNow.getMonth(), year: dateNow.getFullYear()};
    modelForUpdate.dateOfIncident = {day: dateNow.getDate(), month: dateNow.getMonth(), year: dateNow.getFullYear()};
    const firstWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
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
    const modelForUpdate = new WorkflowCaseForEdit();
    const dateNow = new Date();
    modelForUpdate.status = 'Igangværende';
    modelForUpdate.actionPlan = generateRandmString();
    modelForUpdate.description = generateRandmString();
    modelForUpdate.deadline = {day: dateNow.getDate(), month: dateNow.getMonth(), year: dateNow.getFullYear()};
    modelForUpdate.dateOfIncident = {day: dateNow.getDate(), month: dateNow.getMonth(), year: dateNow.getFullYear()};
    const firstWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    await firstWorkflowCase.update(modelForUpdate);
    const findWorkflowCase = await workflowCasesPage.getFirstWorkflowCase();
    expect(findWorkflowCase.id).equal(1);
    expect(findWorkflowCase.status, 'status not updated').equal(
      modelForUpdate.status
    );
    const dateOfIncident = new Date();
    // if (dateOfIncident.getMonth() > 1) {
    //   dateOfIncident.setFullYear(
    //     modelForUpdate.dateOfIncident.year,
    //     modelForUpdate.dateOfIncident.month - 1,
    //     modelForUpdate.dateOfIncident.day);
    // } else {
      dateOfIncident.setFullYear(
        modelForUpdate.dateOfIncident.year,
        modelForUpdate.dateOfIncident.month,
        modelForUpdate.dateOfIncident.day);
    //}

    const deadline = new Date();
    // if (deadline.getMonth() > 1) {
    //   deadline.setFullYear(
    //     modelForUpdate.deadline.year,
    //     modelForUpdate.deadline.month - 1,
    //     modelForUpdate.deadline.day);
    // } else {
      deadline.setFullYear(
        modelForUpdate.deadline.year,
        modelForUpdate.deadline.month,
        modelForUpdate.deadline.day);
    //}
    expect(
      findWorkflowCase.dateOfIncident,
      'dateOfIncident not updated'
    ).equal(format(dateOfIncident, 'dd.MM.yyyy'));
    expect(
      findWorkflowCase.deadline,
      'deadline not updated'
    ).equal(format(deadline, 'dd.MM.yyyy'));
    expect(findWorkflowCase.description, 'description not updated').equal(
      modelForUpdate.description
    );
    expect(findWorkflowCase.actionPlan, 'actionPlan not updated').equal(
      modelForUpdate.actionPlan
    );
  });
});
