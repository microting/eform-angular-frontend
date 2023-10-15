import loginPage from '../../../Login.page';
import timePlanningWorkingHoursPage from '../TimePlanningWorkingHours.page';
import {selectDateRangeOnDatePicker, selectValueInNgSelector} from '../../../helper-functions';
import path from 'path';
import {read} from 'xlsx';

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
    timePlanningWorkingHoursPage.goToWorkingHours();
  });
  it('should enabled Time registration plugin', () => {
    timePlanningWorkingHoursPage.workingHoursRange().click();
    selectDateRangeOnDatePicker(
      dateRange.yearFrom, dateRange.monthFrom, dateRange.dayFrom,
      dateRange.yearTo, dateRange.monthTo, dateRange.dayTo); // select date range
    selectValueInNgSelector('#workingHoursSite', 'o p', true);// select worker

    cy.log('**GENERATE EXCEL REPORT**');
    timePlanningWorkingHoursPage.workingHoursExcel().click();
    const downloadedExcelFilename = path.join(downloadsFolder, `${fileNameExcelReport}.xlsx`);
    const fixturesExcelFilename = path.join(<string>fixturesFolder, `${fileNameExcelReport}.xlsx`);
    cy.readFile(fixturesExcelFilename, 'binary').then((file1Content) => {
      cy.readFile(downloadedExcelFilename, 'binary').then((file2Content) => {
        expect(read(file1Content, {type: 'binary'}), 'excel file').to.deep.equal(read(file2Content, {type: 'binary'}));
      });
    });
  });
});
