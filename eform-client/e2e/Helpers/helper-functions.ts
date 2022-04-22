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
  //     this.tags = await Promise.all(list.map(element => element.getText()));
  if (!mapFunc) {
    mapFunc = (ele) => ele.getText();
  }
  await browser.pause(1000);
  const elementsForSorting = await $$(htmlIdElementsForSorting);
  const elementsBefore = await Promise.all(elementsForSorting.map(mapFunc));
  const spinnerAnimation = await $('#spinner-animation');
  // check that sorting is correct in both directions
  for (let i = 0; i < 2; i++) {
    await tableHeader.click();
    await spinnerAnimation.waitForDisplayed({ timeout: 90000, reverse: true });

    const elementsAfter = await Promise.all(elementsForSorting.map(mapFunc));

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

export async function selectDateOnDatePicker(
  year: number,
  month: number,
  day: number
) {
  await browser.pause(1000);
  await (await $(`.owl-dt-calendar-control-content span`)).click();
  await browser.pause(1000);
  await (
    await $$(`tbody span.owl-dt-calendar-cell-content`)[year - 2016]
  ).click();
  await browser.pause(1000);
  await (await $$(`span.owl-dt-calendar-cell-content`)[month - 1]).click();
  await browser.pause(1000);
  await (
    await $$(
      `span.owl-dt-calendar-cell-content:not(.owl-dt-calendar-cell-out)`
    )[day - 1]
  ).click();
  await browser.pause(1000);
}

export async function selectDateRangeOnDatePicker(
  yearFrom: number,
  monthFrom: number,
  dayFrom: number,
  yearTo: number,
  monthTo: number,
  dayTo: number,
) {
  await selectDateOnDatePicker(yearFrom, monthFrom, dayFrom);
  await selectDateOnDatePicker(yearTo, monthTo, dayTo);
}

export async function selectValueInNgSelector(selector: WebdriverIO.Element, value: string,) {
  await (await selector.$('input')).setValue(value);
  const valueForClick = await selector.$(
    `.ng-option=${value}`
  );
  valueForClick.waitForDisplayed({ timeout: 40000 });
  await valueForClick.click();
}
