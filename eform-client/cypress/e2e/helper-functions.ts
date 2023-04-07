import { Guid } from 'guid-typescript';

export function generateRandmString(length = 36) {
  return Guid.raw().toString().slice(0, length);
}

export function testSorting(
  tableHeader,
  htmlIdElementsForSorting,
  sortBy,
  mapFunc = (value) => value.text()
) {
  const elementsForSorting = cy.get(htmlIdElementsForSorting);
  const elementsBefore = Promise.all(elementsForSorting.map(mapFunc));
  const spinnerAnimation = cy.get('#spinner-animation');
  // check that sorting is correct in both directions
  for (let i = 0; i < 2; i++) {
    tableHeader.click();
    spinnerAnimation.should('not.be.visible', { timeout: 90000 });
    cy.wait(500);
    const elementsAfter = Promise.all(elementsForSorting.map(mapFunc));
    // get current direction of sorting
    const sortIcon = tableHeader.find('.ng-trigger-leftPointer').invoke('attr', 'style');
    let sorted;
    if (sortIcon === 'transform: rotate(45deg);') {
      sorted = elementsBefore.sort().reverse();
    } else if (sortIcon === 'expand_less') {
      sorted = elementsBefore;
    } else {
      sorted = elementsBefore.sort();
    }
    expect(sorted, `Sort by ${sortBy} incorrect`).to.deep.equal(elementsAfter);
  }
  spinnerAnimation.should('not.be.visible', { timeout: 90000 });
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

export function selectValueInNgSelector(selector, value, selectorInModal = false) {
  selector.should('be.visible', { timeout: 40000 });
  const input = selector.find('input');
  input.should('be.visible', { timeout: 40000 }).type(value);
  cy.wait(500);
  let valueForClick;
  // if selector in modal or have [appendTo]="'body'" - options not on selector, need find global(or on body, but not on selector)
  if(selectorInModal) {
    valueForClick = cy.get(`.ng-option*:contains(${value})`);
  } else {
    valueForClick = selector.find(`.ng-option*:contains(${value})`);
  }
  valueForClick.should('be.visible').click();
  cy.wait(500);
}

