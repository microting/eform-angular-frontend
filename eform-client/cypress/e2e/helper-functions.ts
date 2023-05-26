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
  cy.get('button.owl-dt-control-button .owl-dt-control-button-content span').click();
  cy.wait(500);
  // Click on the year cell of the date picker widget.
  cy.get(`tbody span.owl-dt-calendar-cell-content:eq(${year - 2016})`).click();
  cy.wait(500);
  // Click on the month cell of the date picker widget.
  cy.get(`span.owl-dt-calendar-cell-content:eq(${month - 1})`).click();
  cy.wait(500);
  // Click on the day cell of the date picker widget.
  cy.get(`span.owl-dt-calendar-cell-content:not(.owl-dt-calendar-cell-out):eq(${day - 1})`).click();
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

export function selectValueInNgSelector(
  selector: string | (() => Cypress.Chainable<JQuery<HTMLElement>>),
  value: string,
  selectorInModal = false,
  shouldChainer: string = 'have.text') {
  let select: () => Cypress.Chainable<JQuery<HTMLElement>>;
  if (typeof selector === 'string') {
    select = () => cy.get(selector).should('be.visible');
  } else {
    select = selector;
  }

  select().should('be.visible');
  select().find('input').should('be.visible').clear().type(value);
  cy.wait(500);
  let valueForClick;
  // if selector in modal or have [appendTo]="'body'" - options not on selector, need find global(or on body, but not on selector)
  if (selectorInModal) {
    valueForClick = cy.get(`.ng-option`).should(shouldChainer, value);
  } else {
    valueForClick = select().find(`.ng-option`).should(shouldChainer, value);
  }
  valueForClick.should('be.visible').click();
  cy.wait(500);
}

