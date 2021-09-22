import { Guid } from 'guid-typescript';

const expect = require('chai').expect;

export function generateRandmString() {
  return Guid.raw();
}

export async function testSorting(
  tableHeader: WebdriverIO.Element,
  htmlIdElementsForSorting: string,
  sortBy: string,
  mapFunc?: (
    value: WebdriverIO.Element,
    index: number,
    array: WebdriverIO.Element[]
  ) => unknown
) {
  if (!mapFunc) {
    mapFunc = (ele) => ele.getText();
  }
  await browser.pause(1000);
  const elementsForSorting = await $$(htmlIdElementsForSorting);
  const elementsBefore = await elementsForSorting.map(mapFunc);
  const spinnerAnimation = $('#spinner-animation');
  // check that sorting is correct in both directions
  for (let i = 0; i < 2; i++) {
    await tableHeader.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

    const elementsAfter = elementsForSorting.map(mapFunc);

    // get current direction of sorting
    const sortIcon = await tableHeader.$('i').getText();
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
  await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
