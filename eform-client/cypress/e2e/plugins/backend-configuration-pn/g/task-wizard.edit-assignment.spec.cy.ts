import loginPage from '../../../Login.page';
import backendConfigurationPropertiesPage, {PropertyCreateUpdate} from '../BackendConfigurationProperties.page';
import backendConfigurationPropertyWorkersPage, {PropertyWorker} from '../BackendConfigurationPropertyWorkers.page';
import {
  selectValueInNgSelector,
  generateRandmString,
  selectValueInNgSelectorNoSelector, selectDateOnNewDatePicker
} from '../../../helper-functions';

const property: PropertyCreateUpdate = {
  name: generateRandmString(5),
  chrNumber: generateRandmString(5),
  address: generateRandmString(5),
  cvrNumber: '1111111',
};

const workerForCreate: PropertyWorker = {
  name: 'a',
  surname: 'x',
  language: 'Dansk',
  properties: [property.name],
  workerEmail: generateRandmString(5) + '@test.com',
};
const workerForCreate2: PropertyWorker = {
  name: 'b',
  surname: 'x',
  language: 'Dansk',
  properties: [property.name],
  workerEmail: generateRandmString(5) + '@test.com',
};

const task = {
  property: property.name,
  translations: [
    generateRandmString(12),
    generateRandmString(12),
    generateRandmString(12),
  ],
  eformName: 'Kvittering',
  startFrom: {
    year: 2023,
    month: 7,
    day: 21
  },
  repeatType: 'Dag',
  repeatEvery: '2',
};

const editedTask = {
  property: property.name,
  translations: [
    generateRandmString(12),
    generateRandmString(12),
    generateRandmString(12),
  ],
  eformName: 'Kontrol flydelag',
  startFrom: {
    year: 2022,
    month: 6,
    day: 24
  },
  repeatType: 'Uge',
  repeatEvery: '5',
};

describe('Area rules type 1', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  it('should edit task', () => {
    backendConfigurationPropertiesPage.goToProperties();
    backendConfigurationPropertiesPage.createProperty(property);
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    cy.wait(500);
    backendConfigurationPropertyWorkersPage.create(workerForCreate);
    cy.wait(1000);
    backendConfigurationPropertyWorkersPage.create(workerForCreate2);
    backendConfigurationPropertiesPage.goToProperties();
    // for (let i = 0; i < 1; i++) {
    //   const propertyEl = backendConfigurationPropertiesPage.getRowObjectByNum(i);
    //   propertyEl.goToAreas();
    //   propertyEl.bindAreasByName(['00. Logbøger'], false, true);
    // }
    cy.get('#backend-configuration-pn-task-wizard').click();
    cy.wait(3000);
    cy.get('#createNewTaskBtn').should('be.enabled').click();
    cy.wait(500);
    // fill and create task
    cy.get('#createProperty').click();
    cy.intercept('GET', '**/api/backend-configuration-pn/properties/get-folder-dtos?**').as('getFolders');
    //selectValueInNgSelectorNoSelector(`${property.cvrNumber} - ${property.chrNumber} - ${property.name}`);
    selectValueInNgSelectorNoSelector(`${property.name}`);
    cy.wait('@getFolders', { timeout: 60000 });
    cy.wait(1000);
    // cy.get('#createFolder').click({force: true});
    cy.get('#createFolder mat-select .mat-mdc-select-trigger')
      .should('exist')
      .click({ force: true });
    cy.wait(500);
    cy.get('mat-tree-node > button').click();
    cy.wait(500);
    cy.contains('.folder-tree-name', `00. Logbøger`).first().click();
    cy.wait(500);
    cy.get('#createTableTags').click();
    cy.wait(500);
    selectValueInNgSelectorNoSelector('0. '+property.name + ' - '+property.address);
    cy.get('#createTags').click();
    cy.wait(500);
    selectValueInNgSelectorNoSelector('0. '+property.name + ' - '+property.address);
    cy.wait(500);
    for (let i = 0; i < task.translations.length; i++) {
      cy.get(`[for='createName${i}']`).scrollIntoView();
      cy.get(`[for='createName${i}']`).should('be.visible');
      cy.wait(500);
      cy.get(`[for='createName${i}']`).type(task.translations[i]);
      //cy.get(`#createName${i}`).click().type(task.translations[i]);
    }
    //selectValueInNgSelector('#createTemplateSelector', task.eformName, true);
    cy.get('#createStartFrom').click();
    selectDateOnNewDatePicker(task.startFrom.year, task.startFrom.month, task.startFrom.day);
    selectValueInNgSelector('#createRepeatType', task.repeatType, true);
    cy.get('#createRepeatEvery').should('be.visible').find('input').should('be.visible').clear().type(task.repeatEvery);
    cy.get(`.ng-option`).first().should('have.text', task.repeatEvery).should('be.visible').click();
    cy.get('mat-checkbox#checkboxCreateAssignment0').click();
    cy.intercept('POST', '**/api/backend-configuration-pn/task-wizard').as('createTask');
    cy.get('#createTaskBtn').click();
    cy.wait('@createTask', { timeout: 60000 });
    cy.wait(500);
    // check table
    cy.get('.cdk-row').should('have.length', 1);
    cy.get('.cdk-row .cdk-column-property span').should('have.text', task.property);
    cy.get('.cdk-row .cdk-column-folder span').should('have.text', '00. Logbøger');
    cy.get('.cdk-row .cdk-column-taskName span').should('have.text', task.translations[0]);
    cy.get('.cdk-row .cdk-column-eform span').invoke('text').should('match', new RegExp(`${task.eformName} \\(\\d+\\)`));
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${task.startFrom.day}.${task.startFrom.month >= 10 ? '' : '0'}${task.startFrom.month}.${task.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat mat-chip span.mat-mdc-chip-action-label')
      .invoke('text')
      .should('eq', `${task.repeatEvery} ${task.repeatType}`);
    cy.get('.cdk-row .cdk-column-status mat-chip span.mat-mdc-chip-action-label')
      .invoke('text')
      .should('eq', 'Aktiv');
    cy.get('.cdk-row .cdk-column-assignedTo mat-chip span.mat-mdc-chip-action-label')
      .invoke('text')
      .should('eq', `${workerForCreate.name} ${workerForCreate.surname}`);
    /* ==== Generated with Cypress Studio ==== */
    cy.get('#mat-expansion-panel-header-2 > .mat-content').click();

    backendConfigurationPropertiesPage.goToPlanningPage();
    cy.get('.planningAssignmentBtn.mat-accent').click();
    //cy.get('.planningAssignmentBtn.mat-accent > .mat-mdc-button-touch-target').click();
    //cy.get('#pairingModalTableBody > div > div > div > table > tbody > .mat-mdc-row > .mat-column-name');
    let row = () => cy.get('#pairingModalTableBody > div > div > div > table > tbody > .mat-mdc-row').contains(workerForCreate.name).parent().parent().parent().scrollIntoView();
    row().find('mat-checkbox').should('have.class', 'mat-mdc-checkbox-checked');
    cy.get('#changeAssignmentsCancel > .mdc-button__label').click();
    cy.get('#backend-configuration-pn-task-wizard').click();
    cy.intercept('GET', '**/api/backend-configuration-pn/properties/get-folder-dtos?**').as('getFolders');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    // cy.get('.editBtn').click();
    cy.get('[id^=action-items]')
      .first()
      .find('#actionMenu')
      .should('be.visible')
      .click({ force: true });

    // Now click the Copy Task button inside the opened menu
    cy.get('.cdk-overlay-container')
      .find('[id^=editTaskBtn]')
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait('@getFolders', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    //cy.get('.editBtn > .mat-mdc-button-touch-target').click();
    cy.get('#checkboxUpdateAssignment1-input').check();
    cy.intercept('PUT', '**/api/backend-configuration-pn/task-wizard').as('updateTask');
    cy.get('#updateTaskBtn').click();
    cy.wait('@updateTask', { timeout: 60000 });
    cy.wait(500);
    backendConfigurationPropertiesPage.goToPlanningPage();
    cy.get('.planningAssignmentBtn.mat-accent').click();
    //cy.get('.planningAssignmentBtn.mat-accent > .mat-mdc-button-touch-target').click();
    row = () => cy.get('#pairingModalTableBody > div > div > div > table > tbody > .mat-mdc-row').contains(workerForCreate.name).parent().parent().parent().scrollIntoView();
    row().find('mat-checkbox').should('have.class', 'mat-mdc-checkbox-checked');
    row = () => cy.get('#pairingModalTableBody > div > div > div > table > tbody > .mat-mdc-row').contains(workerForCreate2.name).parent().parent().parent().scrollIntoView();
    row().find('mat-checkbox').should('have.class', 'mat-mdc-checkbox-checked');
    cy.get('#changeAssignmentsCancel').click();
    cy.get('#backend-configuration-pn-task-wizard').click();
    cy.intercept('GET', '**/api/backend-configuration-pn/properties/get-folder-dtos?**').as('getFolders');
    cy.intercept('POST', '**/api/templates/index').as('getTemplates');
    // cy.get('.editBtn').click();
    cy.get('[id^=action-items]')
      .first()
      .find('#actionMenu')
      .should('be.visible')
      .click({ force: true });

    // Now click the Copy Task button inside the opened menu
    cy.get('.cdk-overlay-container')
      .find('[id^=editTaskBtn]')
      .should('be.visible')
      .first()
      .click({ force: true });
    cy.wait('@getFolders', { timeout: 60000 });
    cy.wait('@getTemplates', { timeout: 60000 });
    //cy.get('.editBtn > .mat-mdc-button-touch-target').click();
    cy.get('#checkboxUpdateAssignment0-input').uncheck();
    cy.intercept('PUT', '**/api/backend-configuration-pn/task-wizard').as('updateTask');
    cy.get('#updateTaskBtn').click();
    cy.wait('@updateTask', { timeout: 60000 });
    cy.wait(500);
    backendConfigurationPropertiesPage.goToPlanningPage();
    //cy.get('.planningAssignmentBtn.mat-accent > .mat-mdc-button-touch-target').click();
    cy.get('.planningAssignmentBtn.mat-accent').click();
    row = () => cy.get('#pairingModalTableBody > div > div > div > table > tbody > .mat-mdc-row').contains(workerForCreate.name).parent().parent().parent().scrollIntoView();
    row().find('mat-checkbox').should('not.have.class', 'mat-mdc-checkbox-checked');
    row = () => cy.get('#pairingModalTableBody > div > div > div > table > tbody > .mat-mdc-row').contains(workerForCreate2.name).parent().parent().parent().scrollIntoView();
    row().find('mat-checkbox').should('have.class', 'mat-mdc-checkbox-checked');
    cy.get('#changeAssignmentsCancel > .mdc-button__label').click();
    /* ==== End Cypress Studio ==== */
  });
  after(() => {
    backendConfigurationPropertiesPage.goToProperties();
    cy.wait(500);
    backendConfigurationPropertiesPage.clearTable();
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.clearTable();
  });
});
