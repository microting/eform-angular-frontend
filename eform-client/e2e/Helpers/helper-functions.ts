import { Guid } from 'guid-typescript';

const expect = require('chai').expect;

export function generateRandmString() {
  return Guid.raw();
}

export function testSorting(
  tableHeader: WebdriverIO.Element,
  htmlIdElementsForSorting: string,
  sortBy: string
) {
  browser.pause(1000);
  const elementsForSorting = $$(htmlIdElementsForSorting);
  const elementsBefore = elementsForSorting.map((ele) => {
    return ele.getText();
  });
  const spinnerAnimation = $('#spinner-animation');
  // check that sorting is correct in both directions
  for (let i = 0; i < 2; i++) {
    tableHeader.click();
    spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

    const elementsAfter = elementsForSorting.map((ele) => {
      return ele.getText();
    });

    // get current direction of sorting
    const sortIcon = tableHeader.$('i').getText();
    let sorted;
    if (sortIcon === 'expand_more') {
      sorted = elementsBefore.sort().reverse();
    } else if (sortIcon === 'expand_less') {
      sorted = elementsBefore.sort();
    } else {
      sorted = elementsBefore;
    }
    expect(sorted, `Sort by ${sortBy} incorrect`).deep.equal(elementsAfter);
  }
  spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
}
