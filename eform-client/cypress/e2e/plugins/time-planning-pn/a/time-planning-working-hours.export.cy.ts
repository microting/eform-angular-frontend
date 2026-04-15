import loginPage from '../../../Login.page';
import timePlanningWorkingHoursPage from '../TimePlanningWorkingHours.page';
import {selectDateRangeOnNewDatePicker, selectValueInNgSelector} from '../../../helper-functions';

import {read, utils} from 'xlsx';
import path = require('path');

const dateRange = {
  yearFrom: 2023,
  monthFrom: 1,
  dayFrom: 1,
  yearTo: 2023,
  monthTo: 5,
  dayTo: 11,
};
const fileNameExcelReport: string = '2023-01-01_2023-05-11_report';
const downloadsFolder: string = Cypress.config('downloadsFolder');
const fixturesFolder = Cypress.config('fixturesFolder');

describe('Time planning plugin working hours export', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    cy.intercept('GET', '/api/time-planning-pn/settings/sites').as('getData');
    timePlanningWorkingHoursPage.goToWorkingHours();
    cy.wait('@getData');
  });
  it('should enabled Time registration plugin', () => {

    timePlanningWorkingHoursPage.workingHoursRange().click();
    selectDateRangeOnNewDatePicker(
      dateRange.yearFrom, dateRange.monthFrom, dateRange.dayFrom,
      dateRange.yearTo, dateRange.monthTo, dateRange.dayTo); // select date range
    cy.intercept('POST', '/api/time-planning-pn/working-hours/index').as('postData');
    selectValueInNgSelector('#workingHoursSite', 'o p', true);// select worker
    cy.wait('@postData');

    cy.log('**GENERATE EXCEL REPORT**');
    cy.intercept('GET', '**').as('getData');
    timePlanningWorkingHoursPage.workingHoursExcel().click();
    cy.wait('@getData');
    const downloadedExcelFilename = path.join(downloadsFolder, `${fileNameExcelReport}.xlsx`);
    const fixturesExcelFilename = path.join(<string>fixturesFolder, `${fileNameExcelReport}.xlsx`);

    // Save the generated Excel file to a location for GitHub Actions artifact upload
    cy.readFile(downloadedExcelFilename, 'binary').then((generatedContent) => {
      // Copy the generated file to cypress/downloads for artifact collection
      cy.writeFile(path.join(downloadsFolder, 'generated-excel-report.xlsx'), generatedContent, 'binary');
      
      cy.log('Generated Excel file saved for artifact upload');
      
      // Compare with fixture file
      cy.readFile(fixturesExcelFilename, 'binary').then((fixtureContent) => {
        const workbookGenerated = read(generatedContent, { type: 'binary' });
        const sheetGenerated = workbookGenerated.Sheets[workbookGenerated.SheetNames[0]];
        const jsonDataGenerated = utils.sheet_to_json(sheetGenerated, { header: 1 });
        
        const workbookFixture = read(fixtureContent, { type: 'binary' });
        const sheetFixture = workbookFixture.Sheets[workbookFixture.SheetNames[0]];
        const jsonDataFixture = utils.sheet_to_json(sheetFixture, { header: 1 });
        
        console.log('Generated:', jsonDataGenerated);
        console.log('Fixture:', jsonDataFixture);
        expect(jsonDataGenerated).to.deep.equal(jsonDataFixture);
      });
    });
  });
});
