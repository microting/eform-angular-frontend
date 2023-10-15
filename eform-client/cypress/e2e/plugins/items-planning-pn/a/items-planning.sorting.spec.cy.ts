import loginPage from 'cypress/e2e/Login.page';
import itemPlanningPage, {PlanningCreateUpdate} from '../ItemPlanning.page';
import {generateRandmString, getRandomInt, testSorting} from 'cypress/e2e/helper-functions';

const {_} = Cypress;

let planningData: PlanningCreateUpdate[] = [
  {
    name: [generateRandmString()],
    eFormName: 'test eForm 1',
    folderName: 'testFolder1',
    repeatEvery: getRandomInt(1, 29).toString(),
    repeatType: 'Dag',
  },
  {
    name: [generateRandmString()],
    eFormName: 'test eForm 2',
    folderName: 'testFolder2',
    repeatType: 'Uge',
    dayOfWeek: 'Søndag',
  },
  {
    name: [generateRandmString()],
    eFormName: 'test eForm 3',
    folderName: 'testFolder3',
    repeatType: 'Måned',
    dayOfMonth: getRandomInt(1, 29),
  }
];

describe('Items planning - Sorting', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    itemPlanningPage.goToPlanningPage();
  });
  it('should be able to sort by fields', () => {
    cy.get('app-plannings-table .mat-row').should('not.exist');
    itemPlanningPage.multipleCreatePlanning(planningData);
    cy.get('app-plannings-table .mat-row').its('length').should('eq', planningData.length);
    testSorting(itemPlanningPage.headerColumnId, itemPlanningPage.rowColumnId, 'Id');
    testSorting(itemPlanningPage.headerColumnTranslatedName, itemPlanningPage.rowColumnTranslatedName, 'Translated name');
    testSorting(itemPlanningPage.headerColumnEFormSdkFolderName, itemPlanningPage.rowColumnEFormSdkFolderName, 'Folder name');
    testSorting(itemPlanningPage.headerColumnPlanningRelatedEformName, itemPlanningPage.rowColumnPlanningRelatedEformName, 'Related eForm name');
    const cellsToStrings = (cells$): string[] => {
      return _.map(cells$, (cell$): string => {
        switch (cell$.textContent) {
          case 'Dag': {
            return '1';
          }
          case 'Uge': {
            return '2';
          }
          case 'Måned': {
            return '3';
          }
          default: {
            return '';
          }
        }
      });
    };
    testSorting(itemPlanningPage.headerColumnRepeatType, itemPlanningPage.rowColumnRepeatType, 'Repeat type', cellsToStrings);
    testSorting(itemPlanningPage.headerColumnRepeatEvery, itemPlanningPage.rowColumnRepeatEvery, 'Repeat every');
  });
  afterEach(() => {
    itemPlanningPage.multipleDeletePlannings();
    cy.get('app-plannings-table .mat-row').should('not.exist');
  });
});
