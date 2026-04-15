import loginPage from 'cypress/e2e/Login.page';
import itemPlanningPage, {PlanningCreateUpdate} from '../ItemPlanning.page';
import {generateRandmString} from 'cypress/e2e/helper-functions';

let planningData: PlanningCreateUpdate = {
  name: [generateRandmString(), generateRandmString()],
  eFormName: 'test eForm 1',
  folderName: 'testFolder1',
};

describe('Items planning - Delete', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    itemPlanningPage.goToPlanningPage();
  });
  it('should delete created planning', () => {
    cy.get('app-plannings-table .mat-row').should('not.exist');
    itemPlanningPage.createPlanning(planningData);
    itemPlanningPage.deletePlanning(true);
    cy.get('app-plannings-table .mat-row').its('length').should('be.gte', 1); // ensure that planning not delete
    itemPlanningPage.deletePlanning();
    cy.get('app-plannings-table .mat-row').should('not.exist'); // ensure that planning delete
  });
});
