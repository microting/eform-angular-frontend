import { Page, expect } from '@playwright/test';

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
  await ngSelector.waitFor({ state: 'visible' });
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
  const option = selectorInModal
    ? page.locator('.ng-option').filter({ hasText: value }).first()
    : ngSelector.locator('.ng-option').filter({ hasText: value }).first();
  await option.scrollIntoViewIfNeeded();
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

    const style = await page.locator(selectorTableHeader).locator('.ng-trigger-leftPointer').getAttribute('style') ?? '';
    const sorted = style.includes('transform: rotate(45deg)')
      ? [...elementsBefore].sort().reverse()
      : [...elementsBefore].sort();

    const elementsAfter = await getCells();
    expect(elementsAfter, `Sort by ${sortBy} incorrect`).toEqual(sorted);
  }
}
