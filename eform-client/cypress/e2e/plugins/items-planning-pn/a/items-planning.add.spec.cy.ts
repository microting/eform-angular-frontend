import loginPage from 'cypress/e2e/Login.page';
import itemPlanningPage, {PlanningCreateUpdate} from '../ItemPlanning.page';
import {generateRandmString, getRandomInt} from 'cypress/e2e/helper-functions';

const planningData: PlanningCreateUpdate = {
  name: [generateRandmString(), generateRandmString()],
  eFormName: 'test eForm 1',
  folderName: 'testFolder1',
  description: generateRandmString(),
  repeatEvery: '1',
  repeatType: 'Dag',
  startFrom: {year: 2020, month: 9, day: 7,},
  repeatUntil: {year: 2020, month: 10, day: 6,},
  type: generateRandmString(),
  locationCode: '12345',
  buildYear: getRandomInt(1, 27).toString(),
  number: getRandomInt(1, 27).toString(),
  daysBeforeRedeploymentPushMessage: getRandomInt(1, 27),
  pushMessageEnabled: true,
};

describe('Items planning - Add', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    itemPlanningPage.goToPlanningPage();
    // itemPlanningPage.clearTable(); // not working if table is empty
  });
  it('should create planning with all fields', () => {
    cy.get('app-plannings-table .mat-row').should('not.exist');
    itemPlanningPage.createPlanning(planningData);
    cy.get('app-plannings-table .mat-row').its('length').should('be.gte', 1);
    cy.get('.mat-row .cdk-column-translatedName span').should('have.text', planningData.name[0]); // 0 - it's danish translate
    cy.get('.mat-row .cdk-column-description span').should('have.text', planningData.description);
    cy.get('.mat-row .cdk-column-folder-eFormSdkFolderName span').should('have.text', planningData.folderName);
    cy.get('.mat-row .cdk-column-planningRelatedEformName span').should('have.text', ` ${planningData.eFormName} `);
    cy.get('.mat-row .cdk-column-reiteration-repeatEvery span').should('have.text', planningData.repeatEvery);
    cy.get('.mat-row .cdk-column-reiteration-repeatType span').should('have.text', planningData.repeatType);
    itemPlanningPage.openEditPlanning()

    for (let i = 0; i < planningData.name.length; i++) {
      itemPlanningPage.editPlanningItemName(i).should('have.value', planningData.name[i]);
    }
    itemPlanningPage.editPlanningDescription().should('have.value', planningData.description);
    itemPlanningPage.folderName().should('have.text', planningData.folderName);
    itemPlanningPage.editPlanningSelector().find('.ng-value').should('have.text', ` ${planningData.eFormName} `);
    itemPlanningPage.editRepeatEvery().should('have.value', planningData.repeatEvery);
    itemPlanningPage.editRepeatType().find('.ng-value-label').should('have.text', planningData.repeatType);
    itemPlanningPage.editStartFrom().should('have.value',`${
      planningData.startFrom.day < 10 ? '0' + planningData.startFrom.day : planningData.startFrom.day}.${
      planningData.startFrom.month < 10 ? '0' + planningData.startFrom.month : planningData.startFrom.month}.${planningData.startFrom.year}`);
    itemPlanningPage.editRepeatUntil().should('have.value',`${
      planningData.repeatUntil.day < 10 ? '0' + planningData.repeatUntil.day : planningData.repeatUntil.day}.${
      planningData.repeatUntil.month < 10 ? '0' + planningData.repeatUntil.month : planningData.repeatUntil.month}.${planningData.repeatUntil.year}`);
    itemPlanningPage.editItemNumber().should('have.value', planningData.number);
    itemPlanningPage.editItemLocationCode().should('have.value', planningData.locationCode);
    itemPlanningPage.editItemBuildYear().should('have.value', planningData.buildYear);
    itemPlanningPage.editItemType().should('have.value', planningData.type);
    itemPlanningPage.pushMessageEnabledEdit().find('.ng-value-label').should('have.text', planningData.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret');
    itemPlanningPage.editDaysBeforeRedeploymentPushMessage().find('.ng-value-label').should('have.text', planningData.daysBeforeRedeploymentPushMessage);

    itemPlanningPage.closeEditPlanning();
  });
  afterEach(() => {
    itemPlanningPage.clearTable();
  });
});
