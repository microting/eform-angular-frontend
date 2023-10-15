import loginPage from '../../../Login.page';
import backendConfigurationReportsPage, {ReportFilters} from '../BackendConfigurationReports.page';
import path from 'path';
import mammoth from 'mammoth';

const filters: ReportFilters[] = [
  {
    dateRange: {
      yearFrom: 2021,
      monthFrom: 11,
      dayFrom: 1,
      yearTo: 2022,
      monthTo: 4,
      dayTo: 1,
    },
  },
  {
    dateRange: {
      yearFrom: 2021,
      monthFrom: 11,
      dayFrom: 18,
      yearTo: 2021,
      monthTo: 11,
      dayTo: 18,
    },
  }
];

const fileName: string = '2021-11-01T00_00_00.000Z_2022-04-01T00_00_00.000Z_report';
const fileName2: string = '2021-11-18T00_00_00.000Z_2021-11-18T00_00_00.000Z_report';

describe('Reports', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200');
    loginPage.login();
    backendConfigurationReportsPage.goToReports();
    cy.intercept('GET', '**/api/backend-configuration-pn/report/reports/file?**').as('downloadReport');
  });
  it('should download correct files', () => {
    backendConfigurationReportsPage.fillFilters(filters[0]);
    const downloadsFolder = Cypress.config('downloadsFolder');
    const fixturesFolder = Cypress.config('fixturesFolder');

    cy.log('**GENERATE WORD REPORT**');
    backendConfigurationReportsPage.generateWordBtn().click();
    cy.wait('@downloadReport', { timeout: 90000 });
    const downloadedWordFilename = path.join(downloadsFolder, `${fileName}.docx`);
    const fixturesWordFilename = path.join(<string>fixturesFolder, `${fileName}.docx`);
    cy.readFile(fixturesWordFilename, null, {timeout: 20000}).then((fileContent1: Uint8Array) => {
      cy.readFile(downloadedWordFilename, null, {timeout: 20000}).then((fileContent2: Uint8Array) => {
        Promise.all([
          mammoth.convertToHtml({arrayBuffer: fileContent1}),
          mammoth.convertToHtml({arrayBuffer: fileContent2})])
            .then(([fileHtml1, fileHtml2]) => {
                expect(fileHtml1.value, 'word file').deep.eq(fileHtml2.value);
            });
      });
    });

    cy.log('**GENERATE EXCEL REPORT**');
    backendConfigurationReportsPage.generateExcelBtn().click();
    cy.wait('@downloadReport', { timeout: 90000 });
    const downloadedExcelFilename = path.join(downloadsFolder, `${fileName}.xlsx`);
    const fixturesExcelFilename = path.join(<string>fixturesFolder, `${fileName}.xlsx`);
    cy.task('readXlsx', {file: fixturesExcelFilename}).then((file1Content) => {
      cy.task('readXlsx', {file: downloadedExcelFilename}).then((file2Content) => {
        expect(file1Content, 'excel file').deep.eq(file2Content);
      });
    })
  });
  it('should download correct files if selected dates is same', () => {
    backendConfigurationReportsPage.fillFilters(filters[1]);
    const downloadsFolder = Cypress.config('downloadsFolder');
    const fixturesFolder = Cypress.config('fixturesFolder');

    cy.log('**GENERATE WORD REPORT**');
    backendConfigurationReportsPage.generateWordBtn().click();
    cy.wait('@downloadReport', { timeout: 90000 });
    const downloadedWordFilename = path.join(downloadsFolder, `${fileName2}.docx`);
    const fixturesWordFilename = path.join(<string>fixturesFolder, `${fileName2}.docx`);
    cy.readFile(fixturesWordFilename, null, {timeout: 20000}).then((fileContent1: Uint8Array) => {
      cy.readFile(downloadedWordFilename, null, {timeout: 20000}).then((fileContent2: Uint8Array) => {
        Promise.all([
          mammoth.convertToHtml({arrayBuffer: fileContent1}),
          mammoth.convertToHtml({arrayBuffer: fileContent2})])
            .then(([fileHtml1, fileHtml2]) => {
                expect(fileHtml1.value, 'word file').deep.eq(fileHtml2.value);
            });
      });
    });

    cy.log('**GENERATE EXCEL REPORT**');
    backendConfigurationReportsPage.generateExcelBtn().click();
    cy.wait('@downloadReport', { timeout: 90000 });
    const downloadedExcelFilename = path.join(downloadsFolder, `${fileName2}.xlsx`);
    const fixturesExcelFilename = path.join(<string>fixturesFolder, `${fileName2}.xlsx`);
    cy.task('readXlsx', {file: fixturesExcelFilename}).then((file1Content) => {
      cy.task('readXlsx', {file: downloadedExcelFilename}).then((file2Content) => {
        expect(file1Content, 'excel file').deep.eq(file2Content);
      });
    })
  });
});
