import loginPage from '../../../Login.page';
import backendConfigurationPropertiesPage from '../BackendConfigurationProperties.page';
import {PropertyCreateUpdate} from '../../../../../e2e/Page objects/BackendConfiguration/BackendConfigurationProperties.page';
import {generateRandmString} from '../../../../../e2e/Helpers/helper-functions';
import backendConfigurationPropertyWorkersPage, {PropertyWorker} from '../BackendConfigurationPropertyWorkers.page';
import {testSorting} from '../../../helper-functions';

const property: PropertyCreateUpdate = {
  name: generateRandmString(),
  chrNumber: generateRandmString(),
  address: generateRandmString(),
  cvrNumber: '1111111',
};

const workerForCreate: PropertyWorker = {
  name: generateRandmString(),
  surname: generateRandmString(),
  language: 'Dansk',
  properties: [property.name],
};

const nameArea: string = '00. Logbøger';

describe('Area rules type 1', () => {
  before(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
  });
  it('should sorting table', () => {
    backendConfigurationPropertiesPage.goToProperties();
    cy.get('app-properties-table').should('exist');
    backendConfigurationPropertiesPage.createProperty(property);
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.create(workerForCreate);
    backendConfigurationPropertiesPage.goToProperties();
    const propertyInTable = backendConfigurationPropertiesPage.getRowObjectByName(property.name);
    propertyInTable.goToAreas();
    propertyInTable.bindAreasByName([nameArea]);
    cy.wait(500);
    propertyInTable.goToPropertyAreaByName(nameArea);
    // TODO add rules before test
    // testSorting('.mat-header-cell.mat-column-id', '.mat-cell.mat-column-id', 'ID');
    // testSorting('.mat-header-cell.mat-column-translatedName', '.mat-cell.mat-column-translatedName', 'Name');
    // testSorting('.mat-header-cell.mat-column-eformName', '.mat-cell.mat-column-eformName', 'eForm');
    // testSorting('.mat-header-cell.mat-column-startDate', '.mat-cell.mat-column-startDate', 'start date');
    // testSorting('.mat-header-cell.mat-column-repeatType', '.mat-cell.mat-column-repeatType', 'Repeat type');
    // testSorting('.mat-header-cell.mat-column-repeatEvery', '.mat-cell.mat-column-repeatEvery', 'Repeat every');
    // testSorting('.mat-header-cell.mat-column-planningStatus', '.mat-cell.mat-column-planningStatus', 'Status');
  });
  after(() => {
    backendConfigurationPropertiesPage.goToProperties();
    cy.wait(500);
    backendConfigurationPropertiesPage.clearTable();
    backendConfigurationPropertyWorkersPage.goToPropertyWorkers();
    backendConfigurationPropertyWorkersPage.clearTable();
  });
});
