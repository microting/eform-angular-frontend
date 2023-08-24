import {Guid} from 'guid-typescript';

const {_} = Cypress;

export function generateRandmString(length: number = 36): string {
  return Guid.raw().toString().slice(0, length);
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * This function tests the sorting functionality of a table
 * @param {string} selectorTableHeader - Selector for the table header containing the sorting arrow
 * @param {string} selectorColumnElementsForSorting - Selector for the table column to be sorted
 * @param {string} sortBy - The name of the column being sorted (optional)
 */
export function testSorting(selectorTableHeader: string | Function, selectorColumnElementsForSorting: string, sortBy: string) {
  const cellsToStrings = (cells$) => {
    return _.map(cells$, (cell$): string => {
      return cell$.textContent;
    });
  };

  // Get table header
  let tableHeader;
  if (typeof selectorTableHeader === 'string') {
    tableHeader = () => cy.get(selectorTableHeader).should('be.visible');
  } else {
    tableHeader = selectorTableHeader;
  }

  // Get all the elements to be sorted
  const elementsForSorting = () => cy.get(selectorColumnElementsForSorting);

  elementsForSorting()
    .then(cellsToStrings)
    .then((elementsBefore: string[]) => {
      for (let i = 0; i < 2; i++) {
        // Click on the header to sort the table
        tableHeader().find('.mat-sort-header-icon').should('exist').click();

        // Wait for a short time to ensure the table is sorted
        cy.wait(500);
        tableHeader()
          .find('.ng-trigger-leftPointer')
          .invoke('attr', 'style')
          .then((style) => {
            // Determine the expected sorted order based on the sorting arrow direction
            let sorted;
            if (style.includes('transform: rotate(45deg);')) {
              sorted = elementsBefore.sort().reverse();
            } else {
              sorted = elementsBefore.sort();
            }

            elementsForSorting()
              .then(cellsToStrings)
              .then((elementsAfter) => {
                expect(elementsAfter, `Sort by ${sortBy} incorrect`).deep.eq(sorted);
              });
          });
      }
    });
}

/**
 * Selects a date on the date picker widget.
 * @param {number} year - Year value of the date to select.
 * @param {number} month - Month value of the date to select.
 * @param {number} day - Day value of the date to select.
 */
export function selectDateOnDatePicker(year: number, month: number, day: number) {
  cy.wait(500);
  // Click on the date picker widget's control button.
  //cy.get('button.owl-dt-control-button .owl-dt-control-button-content span').click();
  cy.get('.mat-focus-indicator.mat-calendar-period-button.mat-button.mat-button-base').click();
  cy.wait(500);
  // Click on the year cell of the date picker widget.
  //cy.get(`tbody span.owl-dt-calendar-cell-content:eq(${year - 2016})`).click();
  cy.get(`tbody div.mat-calendar-body-cell-content.mat-focus-indicator:eq(${year - 2016})`).click();
  cy.wait(500);
  // Click on the month cell of the date picker widget.
  cy.get(`div.mat-calendar-body-cell-content.mat-focus-indicator:eq(${month - 1})`).click();
  //cy.get(`span.owl-dt-calendar-cell-content:eq(${month - 1})`).click();
  //cy.get(`span.owl-dt-calendar-cell-content:eq(${month - 1})`).click();
  cy.wait(500);
  // Click on the day cell of the date picker widget.
  //cy.get(`span.owl-dt-calendar-cell-content:not(.owl-dt-calendar-cell-out):eq(${day - 1})`).click();
  cy.get(`div.mat-calendar-body-cell-content.mat-focus-indicator:not(.owl-dt-calendar-cell-out):eq(${day - 1})`).click();
  cy.wait(500);
}

/**
 * Selects a date range on the date picker widget.
 * @param {number} yearFrom - Year value of the start date.
 * @param {number} monthFrom - Month value of the start date.
 * @param {number} dayFrom - Day value of the start date.
 * @param {number} yearTo - Year value of the end date.
 * @param {number} monthTo - Month value of the end date.
 * @param {number} dayTo - Day value of the end date.
 */
export function selectDateRangeOnDatePicker(
  yearFrom: number, monthFrom: number, dayFrom: number,
  yearTo: number, monthTo: number, dayTo: number
) {
  // Select the start date.
  selectDateOnDatePicker(yearFrom, monthFrom, dayFrom);
  // Select the end date.
  selectDateOnDatePicker(yearTo, monthTo, dayTo);
}

/**
 * Selects a date on the new date picker widget.
 * @param {number} year - Year value of the date to select.
 * @param {number} month - Month value of the date to select.
 * @param {number} day - Day value of the date to select.
 */
export function selectDateOnNewDatePicker(year: number, month: number, day: number) {
  cy.wait(500); // cy.wait(500); - wait animations, but not require
  // Click on the date picker widget's control button.
  cy.get('.mat-calendar-period-button').click();
  cy.wait(500);
  cy.get('mat-multi-year-view .mat-calendar-body-cell-content').first().then(ele => {
    const yearStart = +ele.text();
    // select year
    cy.get(`mat-multi-year-view .mat-calendar-body-cell:eq(${year - yearStart})`).click();
    cy.wait(500);
    // select month
    cy.get(`mat-year-view .mat-calendar-body-cell:eq(${month - 1})`).click();
    cy.wait(500);
    // select day
    cy.get(`mat-month-view .mat-calendar-body-cell:eq(${day - 1})`).click();
    cy.wait(500);
  });
}

/**
 * Selects a date range on the new date picker widget.
 * @param {number} yearFrom - Year value of the start date.
 * @param {number} monthFrom - Month value of the start date.
 * @param {number} dayFrom - Day value of the start date.
 * @param {number} yearTo - Year value of the end date.
 * @param {number} monthTo - Month value of the end date.
 * @param {number} dayTo - Day value of the end date.
 */
export function selectDateRangeOnNewDatePicker(
  yearFrom: number, monthFrom: number, dayFrom: number,
  yearTo: number, monthTo: number, dayTo: number
) {
  // Select the start date.
  selectDateOnNewDatePicker(yearFrom, monthFrom, dayFrom);
  // Select the end date.
  selectDateOnNewDatePicker(yearTo, monthTo, dayTo);
}

export function selectLanguage(selector: string, language) {
  cy.get(selector).should('be.visible');
  cy.get(selector).find('input').should('be.visible').clear().type(language);
  const dropdown = cy.get(selector);
  dropdown.click();
  const valueForClick = cy.get(`.ng-option`); //.should('have.text', language);
  valueForClick.should('be.visible').click();
}

export function selectValueInNgSelector(selector: string, value: string, selectorInModal = false) {
  cy.get(selector).should('be.visible');
  cy.get(selector).find('input').should('be.visible').clear().type(value);
  cy.wait(500);
  let valueForClick;
  // if selector in modal or have [appendTo]="'body'" - options not on selector, need find global(or on body, but not on selector)
  if (selectorInModal) {
    valueForClick = cy.get(`.ng-option`).should('have.text', value);
  } else {
    valueForClick = cy.get(selector).find(`.ng-option`).should('have.text', value);
  }
  valueForClick.should('be.visible').click();
  cy.wait(500);
}

export function selectValueInNgSelectorNoSelector(value: string) {
  cy.get('.ng-option .ng-star-inserted').each((item, index, list) => {
    if (item.text().includes(value)) {
      item.click();
    }
  });
}

