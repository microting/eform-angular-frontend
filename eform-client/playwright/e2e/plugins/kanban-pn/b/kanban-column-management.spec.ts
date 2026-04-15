import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';

let page;

test.describe('Kanban - Column Management', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Column Test Board');
    await boardPage.openBoardByIndex(0);
  });
  test.afterAll(async () => { await page.close(); });

  test('should open column menu', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.columnMenuTrigger(0).click();
    await page.locator('.mat-mdc-menu-panel').first().waitFor({ state: 'visible', timeout: 10000 });
    await expect(page.locator('.mat-mdc-menu-panel').first()).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  });

  test('should add a new column', async () => {
    const boardPage = new KanbanBoardPage(page);
    const initialCount = await boardPage.getColumnCount();
    await boardPage.addColumnPlaceholder().click();
    await boardPage.addColumnInput().fill('Test Column');
    await boardPage.addColumnConfirmBtn().click();
    await page.waitForTimeout(2000);
    const newCount = await boardPage.getColumnCount();
    expect(newCount).toBe(initialCount + 1);
  });

  test('should rename a column via menu', async () => {
    const boardPage = new KanbanBoardPage(page);
    const lastColIndex = (await boardPage.getColumnCount()) - 1;
    await boardPage.columnMenuTrigger(lastColIndex).click();
    await page.locator('.mat-mdc-menu-panel').first().waitFor({ state: 'visible', timeout: 10000 });
    // Click Rename menu item
    const renameBtn = page.locator('.mat-mdc-menu-panel .mat-mdc-menu-item, .mat-mdc-menu-panel button[mat-menu-item]').filter({ hasText: 'Rename' }).first();
    await renameBtn.click();
    await page.waitForTimeout(300);
    // Fill inline input
    const inlineInput = page.locator('.inline-input').first();
    await inlineInput.clear();
    await inlineInput.fill('Renamed Column');
    await inlineInput.press('Enter');
    await page.waitForTimeout(1000);
    const names = await boardPage.columnNames().allInnerTexts();
    expect(names).toContain('Renamed Column');
  });

  test('should change column color', async () => {
    const boardPage = new KanbanBoardPage(page);
    const lastColIndex = (await boardPage.getColumnCount()) - 1;
    await boardPage.columnMenuTrigger(lastColIndex).click();
    await page.locator('.mat-mdc-menu-panel').first().waitFor({ state: 'visible', timeout: 10000 });
    // Click a color swatch (the second one - blue)
    await page.locator('.mat-mdc-menu-panel .color-swatch, .color-swatch').nth(1).click();
    await page.waitForTimeout(1000);
    // Menu should close after color change
  });

  test('should delete empty column', async () => {
    const boardPage = new KanbanBoardPage(page);
    const initialCount = await boardPage.getColumnCount();
    const lastColIndex = initialCount - 1;
    await boardPage.columnMenuTrigger(lastColIndex).click();
    await page.locator('.mat-mdc-menu-panel').first().waitFor({ state: 'visible', timeout: 10000 });
    const deleteBtn = page.locator('.mat-mdc-menu-panel .mat-mdc-menu-item, .mat-mdc-menu-panel button[mat-menu-item], .delete-item').filter({ hasText: 'DeleteColumn' }).first();
    await deleteBtn.click();
    await page.waitForTimeout(2000);
    const newCount = await boardPage.getColumnCount();
    expect(newCount).toBe(initialCount - 1);
  });
});
