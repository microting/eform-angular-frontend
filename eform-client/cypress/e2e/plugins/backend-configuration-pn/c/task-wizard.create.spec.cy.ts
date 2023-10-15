import loginPage from '../../../Login.page';
import backendConfigurationPropertiesPage, {PropertyCreateUpdate} from '../BackendConfigurationProperties.page';
import backendConfigurationPropertyWorkersPage, {PropertyWorker} from '../BackendConfigurationPropertyWorkers.page';
import {
  selectValueInNgSelector,
  generateRandmString,
  selectValueInNgSelectorNoSelector, selectDateOnNewDatePicker
} from 'cypress/e2e/helper-functions';

const property: PropertyCreateUpdate = {
  name: generateRandmString(5),
  chrNumber: generateRandmString(5),
  address: generateRandmString(5),
  cvrNumber: '1111111',
};

const workerForCreate: PropertyWorker = {
  name: generateRandmString(5),
  surname: generateRandmString(5),
  language: 'Dansk',
  properties: [property.name],
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

describe('Area rules type 1', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  it('should create task', () => {
    backendConfigurationPropertiesPage.goToProperties();
    backendConfigurationPropertiesPage.createProperty(property);
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.create(workerForCreate);
    backendConfigurationPropertiesPage.goToProperties();
    const propertyEl = backendConfigurationPropertiesPage.getFirstRowObject();
    const bindArea = '00. Logbøger';
    propertyEl.goToAreas();
    propertyEl.bindAreasByName([bindArea]);
    cy.intercept('GET', '**/api/backend-configuration-pn/task-wizard/properties?**').as('getProperties');
    cy.get('#backend-configuration-pn-task-wizard').click();
    cy.wait('@getProperties', { timeout: 60000 });
    cy.wait(3000);
    cy.get('#createNewTaskBtn').should('be.enabled').click();
    cy.wait(500);
    cy.intercept('GET', '**/api/backend-configuration-pn/properties/get-folder-dtos?**').as('getFolders');
    cy.get('#createProperty').click();
    //selectValueInNgSelectorNoSelector(`${property.cvrNumber} - ${property.chrNumber} - ${property.name}`);
    selectValueInNgSelectorNoSelector(`${property.name}`);
    cy.wait('@getFolders', { timeout: 60000 });
    cy.wait(500);
    cy.get('#createFolder').click({force: true});
    cy.wait(500);
    cy.get('.mat-tree-node > .mat-focus-indicator > .mat-button-wrapper > .mat-icon').click();
    cy.wait(500);
    cy.contains('.folder-tree-name', bindArea).first().click();
    cy.get('#createTableTags').click();
    cy.wait(500);
    selectValueInNgSelectorNoSelector('0. '+property.name + ' - '+property.address);
    cy.get('#createTags').click();
    cy.wait(500);
    selectValueInNgSelectorNoSelector('0. '+property.name + ' - '+property.address);
    cy.wait(500);
    for (let i = 0; i < task.translations.length; i++) {
      cy.get(`#createName${i}`).type(task.translations[i]);
    }
    selectValueInNgSelector('#createTemplateSelector', task.eformName, true);
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
    cy.get('.cdk-row .cdk-column-folder span').should('have.text', bindArea);
    cy.get('.cdk-row .cdk-column-taskName span').should('have.text', task.translations[0]);
    cy.get('.cdk-row .cdk-column-eform span').should('have.text', task.eformName);
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${task.startFrom.day}.${task.startFrom.month >= 10 ? '' : '0'}${task.startFrom.month}.${task.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat span').should('have.text', `${task.repeatEvery} ${task.repeatType}`);
    cy.get('.cdk-row .cdk-column-status span').should('have.text', 'Aktiv');
    cy.get('.cdk-row .cdk-column-assignedTo span').should('have.text', `${workerForCreate.name} ${workerForCreate.surname}`);
  });
  after(() => {
    backendConfigurationPropertiesPage.goToProperties();
    cy.wait(500);
    backendConfigurationPropertiesPage.clearTable();
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.clearTable();
  });
});
