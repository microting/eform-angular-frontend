import {PageWithNavbarPage} from '../../PageWithNavbar.page';
import {selectDateRangeOnDatePicker, selectValueInNgSelector} from '../../helper-functions';

class BackendConfigurationReportsPage extends PageWithNavbarPage {
  constructor() {
    super();
  }

  backendConfigurationPnButton() {
    return cy.get('#backend-configuration-pn')
      .should('be.visible');
  }

  backendConfigurationPnReportsButton() {
    return cy.get('#backend-configuration-pn-reports');
  }

  goToReports() {
    this.backendConfigurationPnReportsButton().then(($ele) => {
      if (!$ele.is(':visible')) {
        this.backendConfigurationPnButton().click();
      }
    });
    this.backendConfigurationPnReportsButton().click();
    cy.get('app-backend-configuration-pn-report').should('exist').should('be.visible');
  }

  public rowNum() {
    return cy.get('.mat-row').its('length');
  } // todo: maybe not need

  public tagSelector() {
    return cy.get('#tagSelector').should('be.visible');
  }

  public dateFormInput() {
    return cy.get('mat-date-range-input').should('be.visible');
  }

  public generateTableBtn() {
    return cy.get('#generateTableBtn').should('be.visible').should('be.enabled');
  }

  public generateWordBtn() {
    return cy.get('#generateWordBtn').should('be.visible').should('be.enabled');
  }

  public generateExcelBtn() {
    return cy.get('#generateExcelBtn').should('be.visible').should('be.enabled');
  }

  fillFilters(filters?: ReportFilters) {
    if(filters){
      if(filters.tagNames) {
        for (let i = 0; i < filters.tagNames.length; i++) {
          selectValueInNgSelector('#tagSelector', filters.tagNames[i])
        }
      }
      if(filters.dateRange) {
        this.dateFormInput().click();
        selectDateRangeOnDatePicker(
          filters.dateRange.yearFrom, filters.dateRange.monthFrom,  filters.dateRange.dayFrom,
          filters.dateRange.yearTo, filters.dateRange.monthTo, filters.dateRange.dayTo
        )
      }
    }
  }
}

const backendConfigurationReportsPage = new BackendConfigurationReportsPage();
export default backendConfigurationReportsPage;

export class ReportsRowObject {
  row: Cypress.Chainable<JQuery<HTMLElement>>;

  getRow(rowNum: number) {
    const row = () => cy.get('.mat-row').eq(rowNum - 1);
    this.row = row();
    return this;
  }

  // find first row with text
  getRowByName(s: string) {
    const row = () => cy.get('.mat-row')
      .contains(s) // div
      .parent() // met-cell
      .parent(); // mat-row
    this.row = row();
    return this;
  }
}

export class ReportFilters {
  tagNames?: string[] = [];
  dateRange: {
    yearFrom: number;
    monthFrom: number;
    dayFrom: number;
    yearTo: number;
    monthTo: number;
    dayTo: number;
  }
}
