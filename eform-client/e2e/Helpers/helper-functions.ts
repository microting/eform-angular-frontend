import { Guid } from 'guid-typescript';

import {expect} from 'chai';

export function generateRandmString(length: number = 36): string {
  return Guid.raw().toString().slice(0, length);
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
    mapFunc = async (ele) => await ele.getText();
  }
  const getElementsForSorting = async () => await $$(htmlIdElementsForSorting);
  //const elementsBefore = await Promise.all((await getElementsForSorting()).map(mapFunc));
  const elements = await getElementsForSorting(); // Assuming this returns a list of elements
  let elementsBefore = [];
  for (let i = 0; i < elements.length; i++) {
    elementsBefore.push(await elements[i].getText());
  }

  // check that sorting is correct in both directions
  for (let i = 0; i < 2; i++) {
    await tableHeader.click();
    await browser.pause(500);
    //const elementsAfter = await Promise.all((await getElementsForSorting()).map(mapFunc));
    const elements = await getElementsForSorting(); // Assuming this returns a list of elements
    let elementsAfter = [];
    for (let i = 0; i < elements.length; i++) {
      elementsAfter.push(await elements[i].getText());
    }
    // // get current direction of sorting
    const sortIcon = await tableHeader.$('.ng-trigger-leftPointer').getAttribute('style');
    let sorted;
    if (sortIcon === 'transform: rotate(45deg);') {
      sorted = elementsBefore.sort().reverse();
    } else if (sortIcon === 'expand_less') {
      sorted = elementsBefore;
    } else {
      sorted = elementsBefore.sort();
    }
    expect(sorted, `Sort by ${sortBy} incorrect`).deep.equal(elementsAfter);
  }
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export async function selectDateOnDatePicker(
  year: number,
  month: number,
  day: number
) {
  // need open selector years (selected year can be not needed year)
  const selectYearAndMonthButton = await $(`.mat-calendar-period-button`);
  await selectYearAndMonthButton.waitForClickable({timeout: 20000});
  await browser.pause(1000);
  await selectYearAndMonthButton.click();
  // select year. after select year we can select month
  const yearStart = +(await (await $('mat-multi-year-view .mat-calendar-body-cell-content')).getText());
  const yearForSelect = await $$(`mat-multi-year-view .mat-calendar-body-cell`)[year - yearStart];
  await yearForSelect.waitForClickable({timeout: 20000});
  await browser.pause(1000);
  await yearForSelect.click();
  // select month. after select month we can select day
  if (month > 1) {
    const monthForSelect = await $$(`mat-year-view .mat-calendar-body-cell`)[month - 1];
    await monthForSelect.waitForClickable({timeout: 20000});
    await browser.pause(1000);
    await monthForSelect.click();
  }
  else {
    const monthForSelect = await $$(`mat-year-view .mat-calendar-body-cell`)[month];
    await monthForSelect.waitForClickable({timeout: 20000});
    await browser.pause(1000);
    await monthForSelect.click();
  }
  // select day
  const dayForSelect = await $$(`mat-month-view .mat-calendar-body-cell`)[day - 1];
  await dayForSelect.waitForClickable({timeout: 20000});
  await browser.pause(1000);
  await dayForSelect.click();
}

export async function selectDateRangeOnDatePicker(
  yearFrom: number,
  monthFrom: number,
  dayFrom: number,
  yearTo: number,
  monthTo: number,
  dayTo: number,
) {
  await (await $('.mat-datepicker-popup')).waitForDisplayed({timeout: 20000})
  await selectDateOnDatePicker(yearFrom, monthFrom, dayFrom);
  await selectDateOnDatePicker(yearTo, monthTo, dayTo);
}

export async function selectValueInNgSelector(selector: WebdriverIO.Element, value: string, selectorInModal: boolean = false,) {
  await selector.waitForDisplayed({ timeout: 40000 });
  const input = await selector.$('input');
  await input.waitForDisplayed({ timeout: 40000 })
  await browser.pause(1500);
  await input.setValue(value);
  await browser.pause(1500);
  let valueForClick: WebdriverIO.Element;
  await $('ng-dropdown-panel').waitForDisplayed({ timeout: 40000 });
  // if selector in modal or have [appendTo]="'body'" - options not on selector, need find global(or on body, but not on selector)

  // const value = await (
  //   await $('ng-dropdown-panel')
  // ).$(`.ng-option=${areaRule.type}`);
  if(selectorInModal) {
    valueForClick = await (
      await $('ng-dropdown-panel')
    ).$(`.ng-option`);
    await valueForClick.waitForClickable({ timeout: 40000 });
    // valueForClick = await (
    //   await $('ng-dropdown-panel')
    // ).$(`//*[@class='ng-option-label ng-star-inserted' and contains(text(), '${value}')]`);
    // valueForClick = await $(
    //   `.ng-option*=${value}`
    // );
    await valueForClick.click();
  } else {
    valueForClick = await (
      await $('ng-dropdown-panel')
    ).$(`.ng-option=${value}`);
    await valueForClick.waitForClickable({ timeout: 40000 });
    await valueForClick.click();
    // valueForClick = await selector.$(
    //   `.ng-option*=${value}`
    // );
  }
  // await valueForClick.waitForDisplayed({ timeout: 40000 });
  await browser.pause(500);
}

export async function selectValueInNgSelectorWithSeparateValueAndSearchValue(selector: WebdriverIO.Element, valueForSearch: string, valueForSelect: string = '', selectorInModal: boolean = false,) {
  await selector.waitForDisplayed({ timeout: 40000 });
  const input = await selector.$('input');
  await input.waitForDisplayed({ timeout: 40000 })
  await (await input).setValue(valueForSearch);
  await browser.pause(500);
  let valueForClick: WebdriverIO.Element;
  // if selector in modal or have [appendTo]="'body'" - options not on selector, need find global(or on body, but not on selector)
  if(selectorInModal) {
    valueForClick = await (
      await $('ng-dropdown-panel')
    ).$(`.ng-option=${valueForSelect ? valueForSelect : valueForSearch}`);
    // valueForClick = await $(
    //   `.ng-option*=${valueForSelect ? valueForSelect : valueForSearch}`
    // );
  } else {
    valueForClick = await (
      await $('ng-dropdown-panel')
    ).$(`.ng-option=${valueForSelect ? valueForSelect : valueForSearch}`);
    // valueForClick = await selector.$(
    //   `.ng-option*=${valueForSelect ? valueForSelect : valueForSearch}`
    // );
  }
  // await valueForClick.waitForDisplayed({ timeout: 40000 });
  await valueForClick.waitForClickable({ timeout: 40000 });
  await valueForClick.click();
  await browser.pause(500);
}
