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
const property2: PropertyCreateUpdate = {
  name: generateRandmString(5),
  chrNumber: generateRandmString(5),
  address: generateRandmString(5),
  cvrNumber: '1111111',
};

const workerForCreate: PropertyWorker = {
  name: generateRandmString(5),
  surname: generateRandmString(5),
  language: 'Dansk',
  properties: [property.name, property2.name],
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
  property: property2.name,
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
    backendConfigurationPropertiesPage.createProperty(property2);
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.create(workerForCreate);
    backendConfigurationPropertiesPage.goToProperties();
    for (let i = 0; i < 2; i++) {
      const propertyEl = backendConfigurationPropertiesPage.getRowObjectByNum(i);
      propertyEl.goToAreas();
      propertyEl.bindAreasByName(['00. Logbøger'], false, true);
    }
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
    cy.get('#createFolder').click({force: true});
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
    cy.get('.cdk-row .cdk-column-eform span').should('have.text', task.eformName);
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${task.startFrom.day}.${task.startFrom.month >= 10 ? '' : '0'}${task.startFrom.month}.${task.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat span').should('have.text', `${task.repeatEvery} ${task.repeatType}`);
    cy.get('.cdk-row .cdk-column-status span').should('have.text', 'Aktiv');
    cy.get('.cdk-row .cdk-column-assignedTo span').should('have.text', `${workerForCreate.name} ${workerForCreate.surname}`);
    // edit task
    cy.get('#advanced').click();
    cy.get('#folders').click();
    cy.contains(property.name)
      .parent() // div
      .parent() // mat-tree-node
      .find('button')
      .last()
      .click();
    cy.get('#createFolderChildBtn').click();
    const newFolderName = generateRandmString(10);
    cy.wait(2000);
    cy.get('#createFolderNameTranslation_0').type(newFolderName);
    cy.get('#createFolderDescriptionTranslation_0 .NgxEditor__Content').type(generateRandmString());
    cy.wait(500);
    cy.get('#folderSaveBtn').click();
    cy.wait(1000);
    cy.get('#backend-configuration-pn-task-wizard').scrollIntoView().click();
    cy.get('.cdk-row .cdk-column-actions .editBtn').first().click();
    // // change task
    cy.get('#updateTaskStatusToggle').click();
    cy.get('#updateTaskBtn').click();
    cy.wait(500);
    // check table
    cy.get('.cdk-row').should('have.length', 1);
    cy.get('.cdk-row .cdk-column-property span').should('have.text', task.property);
    cy.get('.cdk-row .cdk-column-folder span').should('have.text', '00. Logbøger');
    cy.get('.cdk-row .cdk-column-taskName span').should('have.text', task.translations[0]);
    cy.get('.cdk-row .cdk-column-eform span').should('have.text', task.eformName);
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${task.startFrom.day}.${task.startFrom.month >= 10 ? '' : '0'}${task.startFrom.month}.${task.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat span').should('have.text', `${task.repeatEvery} ${task.repeatType}`);
    cy.get('.cdk-row .cdk-column-status span').should('have.text', 'Ikke aktiv');
    cy.get('.cdk-row .cdk-column-assignedTo span').should('have.text', `${workerForCreate.name} ${workerForCreate.surname}`);

    cy.get('.cdk-row .cdk-column-actions .editBtn').first().click();
    cy.intercept('GET', '**/api/backend-configuration-pn/properties/get-folder-dtos?**').as('getFolders');
    // cy.get('#updateProperty').click();
    // //selectValueInNgSelectorNoSelector(`${property2.cvrNumber} - ${property2.chrNumber} - ${property2.name}`);
    // selectValueInNgSelectorNoSelector(`${property2.name}`);
    cy.wait('@getFolders', { timeout: 60000 });
    cy.wait(1000);
    cy.get('app-task-wizard-update-modal button#updateFolder').click();
    cy.wait(1000);
    cy.get('mat-tree-node > button').click();
    cy.wait(500);
    cy.contains('.folder-tree-name', newFolderName).click();
    /*cy.wait(500);
    cy.get('#updateTableTags').find('.ng-clear-wrapper').click();
    selectValueInNgSelector('#updateTableTags', `03. Flydelag`, true);
    cy.wait(500);
    selectValueInNgSelector('#updateTags', `00. Logbøger`, true);*/
    /*selectValueInNgSelectorNoSelector(`03. Flydelag`);
    cy.get('#updateTags').click();
    cy.wait(500);
    selectValueInNgSelectorNoSelector(`00. Logbøger`);*/
    cy.wait(500);
    // disable task for enable edit names
    //cy.get('#updateTaskStatusToggle').click();
    for (let i = 0; i < editedTask.translations.length; i++) {
      cy.get(`#updateName${i}`).clear().type(editedTask.translations[i]);
    }
    selectValueInNgSelector('#updateTemplateSelector', editedTask.eformName, true);
    cy.get('#updateStartFrom').click();
    selectDateOnNewDatePicker(editedTask.startFrom.year, editedTask.startFrom.month, editedTask.startFrom.day);
    selectValueInNgSelector('#updateRepeatType', editedTask.repeatType, true);
    cy.get('#updateRepeatEvery').should('be.visible').find('input').should('be.visible').clear().type(editedTask.repeatEvery);
    cy.get(`.ng-option`).first().should('have.text', editedTask.repeatEvery).should('be.visible').click();
    //cy.get('mat-checkbox#checkboxUpdateAssignment0').click();
    // enable task
    cy.get('#updateTaskStatusToggle').click();
    cy.wait(500);
    cy.intercept('PUT', '**/api/backend-configuration-pn/task-wizard').as('updateTask');
    cy.get('#updateTaskBtn').click();
    cy.wait('@updateTask', { timeout: 60000 });
    cy.wait(500);
    // check table
    cy.get('.cdk-row').should('have.length', 1);
    cy.get('.cdk-row .cdk-column-property span').should('have.text', task.property);
    cy.get('.cdk-row .cdk-column-folder span').should('have.text', newFolderName);
    cy.get('.cdk-row .cdk-column-taskName span').should('have.text', editedTask.translations[0]);
    cy.get('.cdk-row .cdk-column-eform span').should('have.text', editedTask.eformName);
    cy.get('.cdk-row .cdk-column-startDate span')
      .should('have.text', `${editedTask.startFrom.day}.${editedTask.startFrom.month >= 10 ? '' : '0'}${editedTask.startFrom.month}.${editedTask.startFrom.year}`);
    cy.get('.cdk-row .cdk-column-repeat span').should('have.text', `${editedTask.repeatEvery} ${editedTask.repeatType}`);
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
