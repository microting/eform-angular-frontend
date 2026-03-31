import { Page, expect } from '@playwright/test';
import { Guid } from 'guid-typescript';

export function generateRandmString(length: number = 36): string {
  return Guid.raw().toString().slice(0, length);
}

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export async function selectDateOnNewDatePicker(page: Page, year: number, month: number, day: number) {
  await page.waitForTimeout(500);
  await page.locator('.mat-calendar-controls > .mat-calendar-period-button').click();
  await page.waitForTimeout(500);
  const startYearText = await page.locator('mat-multi-year-view .mat-calendar-body-cell-content').first().innerText();
  const startYear = parseInt(startYearText.trim(), 10);
  await page.locator('tbody span.mat-calendar-body-cell-content.mat-focus-indicator').nth(year - startYear).click();
  await page.waitForTimeout(500);
  await page.locator('span.mat-calendar-body-cell-content.mat-focus-indicator').nth(month - 1).click();
  await page.waitForTimeout(500);
  await page.locator('span.mat-calendar-body-cell-content.mat-focus-indicator:not(.owl-dt-calendar-cell-out)').nth(day - 1).click();
  await page.waitForTimeout(500);
}

export async function selectDateRangeOnNewDatePicker(
  page: Page,
  yearFrom: number, monthFrom: number, dayFrom: number,
  yearTo: number, monthTo: number, dayTo: number,
) {
  await page.locator('.mat-datepicker-popup').waitFor({ state: 'visible', timeout: 20000 });
  await selectDateOnNewDatePicker(page, yearFrom, monthFrom, dayFrom);
  await selectDateOnNewDatePicker(page, yearTo, monthTo, dayTo);
}

export async function selectValueInNgSelector(
  page: Page,
  selector: string,
  value: string,
  selectorInModal = false,
  intercept = false,
) {
  const ngSelector = page.locator(selector);
  await ngSelector.waitFor({ state: 'visible', timeout: 40000 });
  await ngSelector.click();
  await page.waitForTimeout(300);
  if (intercept) {
    await Promise.all([
      page.waitForResponse('**'),
      ngSelector.locator('input').fill(value),
    ]);
  } else {
    await ngSelector.locator('input').clear();
    await ngSelector.locator('input').fill(value);
  }
  await page.waitForTimeout(500);
  const dropdownPanel = page.locator('ng-dropdown-panel');
  await dropdownPanel.waitFor({ state: 'visible', timeout: 40000 });
  const option = dropdownPanel.locator('.ng-option').filter({ hasText: value }).first();
  await option.scrollIntoViewIfNeeded();
  await option.click();
  await page.waitForTimeout(500);
}

export async function selectValueInNgSelectorNoSelector(
  page: Page,
  value: string,
) {
  const option = page.locator('.ng-option').filter({ hasText: value }).first();
  await option.waitFor({ state: 'visible', timeout: 40000 });
  await option.scrollIntoViewIfNeeded();
  await option.click();
  await page.waitForTimeout(500);
}

export async function selectValueInNgSelectorWithSeparateValueAndSearchValue(
  page: Page,
  selector: string,
  valueForSearch: string,
  valueForSelect: string = '',
  selectorInModal = false,
) {
  const ngSelector = page.locator(selector);
  await ngSelector.waitFor({ state: 'visible', timeout: 40000 });
  const input = ngSelector.locator('input');
  await input.waitFor({ state: 'visible', timeout: 40000 });
  await input.fill(valueForSearch);
  await page.waitForTimeout(500);
  const displayValue = valueForSelect ? valueForSelect : valueForSearch;
  const dropdownPanel = page.locator('ng-dropdown-panel');
  await dropdownPanel.waitFor({ state: 'visible', timeout: 40000 });
  const option = selectorInModal
    ? dropdownPanel.locator('.ng-option').filter({ hasText: displayValue }).first()
    : dropdownPanel.locator('.ng-option').filter({ hasText: displayValue }).first();
  await option.waitFor({ state: 'visible', timeout: 40000 });
  await option.click();
  await page.waitForTimeout(500);
}

export async function testSorting(
  page: Page,
  selectorTableHeader: string,
  selectorColumnElements: string,
  sortBy: string,
) {
  const getCells = async () => {
    const cells = await page.locator(selectorColumnElements).allInnerTexts();
    return cells.map(c => (c.includes('--') ? '' : c.trim()));
  };

  const elementsBefore = await getCells();

  for (let i = 0; i < 2; i++) {
    await page.locator(selectorTableHeader).locator('.mat-sort-header-icon').click({ force: true });
    await page.waitForTimeout(500);

    const ariaSort = await page.locator(selectorTableHeader).getAttribute('aria-sort') ?? '';
    const sorted = ariaSort === 'descending'
      ? [...elementsBefore].sort().reverse()
      : [...elementsBefore].sort();

    const elementsAfter = await getCells();
    expect(elementsAfter, `Sort by ${sortBy} incorrect`).toEqual(sorted);
  }
}
