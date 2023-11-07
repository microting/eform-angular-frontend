import loginPage from 'cypress/e2e/Login.page';
import itemPlanningPage, {PlanningCreateUpdate} from '../ItemPlanning.page';
import {generateRandmString, getRandomInt} from 'cypress/e2e/helper-functions';

let planningData: PlanningCreateUpdate = {
  name: [generateRandmString(), generateRandmString()],
  eFormName: 'test eForm 1',
  folderName: 'testFolder1',
  description: generateRandmString(),
  repeatEvery: '1',
  repeatType: 'Dag',
  startFrom: { year: 2020, month: 7, day: 9 },
  repeatUntil: { year: 2021, month: 6, day: 10 },
  type: generateRandmString(),
  buildYear: '10',
  locationCode: '12345',
  number: getRandomInt(1, 27).toString(),
  pushMessageEnabled: false,
  daysBeforeRedeploymentPushMessage: getRandomInt(1, 27),
};

let planningDataEdited: PlanningCreateUpdate = {
  name: [generateRandmString(), generateRandmString()],
  eFormName: 'test eForm 2',
  folderName: 'testFolder2',
  description: generateRandmString(),
  repeatEvery: '2',
  repeatType: 'Dag',
  startFrom: { year: 2020, month: 7, day: 3 },
  repeatUntil: { year: 2021, month: 10, day: 18 },
  type: generateRandmString(),
  buildYear: '20',
  locationCode: '54321',
  number: getRandomInt(1, 27).toString(),
  pushMessageEnabled: true,
  daysBeforeRedeploymentPushMessage: getRandomInt(1, 27),
};

describe('Items planning - Update', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    itemPlanningPage.goToPlanningPage();
    // itemPlanningPage.clearTable(); // not working if table is empty
  });
  it('should edit planning all fields', () => {
    cy.get('app-plannings-table .mat-row').should('not.exist');
    itemPlanningPage.createPlanning(planningData);
    itemPlanningPage.editPlanning(planningDataEdited);

    // full check
    cy.get('app-plannings-table .mat-row').its('length').should('be.gte', 1);
    cy.get('.mat-row .cdk-column-translatedName span').should('have.text', planningDataEdited.name[0]); // 0 - it's danish translate
    cy.get('.mat-row .cdk-column-description span').should('have.text', planningDataEdited.description);
    cy.get('.mat-row .cdk-column-folder-eFormSdkFolderName span').should('have.text', planningDataEdited.folderName);
    cy.get('.mat-row .cdk-column-planningRelatedEformName span').should('have.text', ` ${planningDataEdited.eFormName} `);
    cy.get('.mat-row .cdk-column-reiteration-repeatEvery span').should('have.text', planningDataEdited.repeatEvery);
    cy.get('.mat-row .cdk-column-reiteration-repeatType span').should('have.text', planningDataEdited.repeatType);
    itemPlanningPage.openEditPlanning();

    for (let i = 0; i < planningDataEdited.name.length; i++) {
      itemPlanningPage.editPlanningItemName(i).should('have.value', planningDataEdited.name[i]);
    }
    itemPlanningPage.editPlanningDescription().should('have.value', planningDataEdited.description);
    itemPlanningPage.folderName().should('have.text', planningDataEdited.folderName);
    itemPlanningPage.editPlanningSelector().find('.ng-value').should('have.text', ` ${planningDataEdited.eFormName} `);
    itemPlanningPage.editRepeatEvery().should('have.value', planningDataEdited.repeatEvery);
    itemPlanningPage.editRepeatType().find('.ng-value-label').should('have.text', planningDataEdited.repeatType);
    itemPlanningPage.editStartFrom().should('have.value',`${
      planningDataEdited.startFrom.day < 10 ? '0' + planningDataEdited.startFrom.day : planningDataEdited.startFrom.day}.${
      planningDataEdited.startFrom.month < 10 ? '0' + planningDataEdited.startFrom.month : planningDataEdited.startFrom.month}.${planningDataEdited.startFrom.year}`);
    itemPlanningPage.editRepeatUntil().should('have.value',`${
      planningDataEdited.repeatUntil.day < 10 ? '0' + planningDataEdited.repeatUntil.day : planningDataEdited.repeatUntil.day}.${
      planningDataEdited.repeatUntil.month < 10 ? '0' + planningDataEdited.repeatUntil.month : planningDataEdited.repeatUntil.month}.${planningDataEdited.repeatUntil.year}`);
    itemPlanningPage.editItemNumber().should('have.value', planningDataEdited.number);
    itemPlanningPage.editItemLocationCode().should('have.value', planningDataEdited.locationCode);
    itemPlanningPage.editItemBuildYear().should('have.value', planningDataEdited.buildYear);
    itemPlanningPage.editItemType().should('have.value', planningDataEdited.type);
    itemPlanningPage.pushMessageEnabledEdit().find('.ng-value-label').should('have.text', planningDataEdited.pushMessageEnabled ? 'Aktiveret' : 'Deaktiveret');
    itemPlanningPage.editDaysBeforeRedeploymentPushMessage().find('.ng-value-label').should('have.text', planningDataEdited.daysBeforeRedeploymentPushMessage);

    itemPlanningPage.closeEditPlanning();
  });
  afterEach(() => {
    itemPlanningPage.clearTable();
  });
});
