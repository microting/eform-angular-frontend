import {Guid} from 'guid-typescript';
import Page from './Page';

const {_} = Cypress;

export function generateRandmString(length = 36) {
  return Guid.raw().toString().slice(0, length);
}

/**
 * This function tests the sorting functionality of a table
 * @param {string} selectorTableHeader - Selector for the table header containing the sorting arrow
 * @param {string} selectorColumnElementsForSorting - Selector for the table column to be sorted
 * @param {string} sortBy - The name of the column being sorted (optional)
 */
export function testSorting(selectorTableHeader: string, selectorColumnElementsForSorting: string, sortBy: string) {
  const cellsToStrings = (cells$) => {
    return _.map(cells$, (cell$): string => {
      return cell$.textContent;
    });
  };

  // Get table header
  const tableHeader = () => cy.get(selectorTableHeader).should('be.visible');

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


export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function selectDateOnDatePicker(year, month, day) {
  cy.wait(1000);
  cy.get('.owl-dt-calendar-control-content span').click();
  cy.wait(1000);
  cy.get(`tbody span.owl-dt-calendar-cell-content:eq(${year - 2016})`).click();
  cy.wait(1000);
  cy.get(`span.owl-dt-calendar-cell-content:eq(${month - 1})`).click();
  cy.wait(1000);
  cy.get(`span.owl-dt-calendar-cell-content:not(.owl-dt-calendar-cell-out):eq(${day - 1})`).click();
  cy.wait(1000);
}

export function selectDateRangeOnDatePicker(yearFrom, monthFrom, dayFrom, yearTo, monthTo, dayTo) {
  selectDateOnDatePicker(yearFrom, monthFrom, dayFrom);
  selectDateOnDatePicker(yearTo, monthTo, dayTo);
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

