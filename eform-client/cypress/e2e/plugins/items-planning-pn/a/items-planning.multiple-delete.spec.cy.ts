import loginPage from 'cypress/e2e/Login.page';
import itemPlanningPage, {PlanningCreateUpdate} from '../ItemPlanning.page';
import {generateRandmString} from 'cypress/e2e/helper-functions';

let planningData: PlanningCreateUpdate[] = [
  {
    name: [generateRandmString()],
    eFormName: 'test eForm 1',
    folderName: 'testFolder1',
  },
  {
    name: [generateRandmString()],
    eFormName: 'test eForm 2',
    folderName: 'testFolder2',
  },
  {
    name: [generateRandmString()],
    eFormName: 'test eForm 3',
    folderName: 'testFolder3',
  }
];

describe('Items planning - Multiple delete', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    itemPlanningPage.goToPlanningPage();
  });
  it('should delete created plannings', () => {
    cy.get('app-plannings-table .mat-row').should('not.exist');
    itemPlanningPage.multipleCreatePlanning(planningData);
    cy.get('app-plannings-table .mat-row').its('length').should('eq', planningData.length);
    itemPlanningPage.openMultipleDelete();
    cy.get('app-planning-multiple-delete h3').should('contain.text', planningData.length)
    itemPlanningPage.closeMultipleDelete(true);
    cy.get('app-plannings-table .mat-row').its('length').should('eq', planningData.length);
    itemPlanningPage.multipleDeletePlannings();
    cy.get('app-plannings-table .mat-row').should('not.exist');
  });
});
