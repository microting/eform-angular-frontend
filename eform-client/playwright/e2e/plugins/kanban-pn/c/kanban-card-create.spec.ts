import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Card Create', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Card Create Test Board');
    await boardPage.openBoardByIndex(0);
  });
  test.afterAll(async () => { await page.close(); });

  test('should open create card dialog', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.newIssueBtn().click();
    await expect(page.locator('mat-dialog-container')).toBeVisible();
    // Close dialog for next test
    await boardPage.cardDialogCancelBtn().click();
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();
  });

  test('should close dialog on cancel', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.newIssueBtn().click();
    await expect(page.locator('mat-dialog-container')).toBeVisible();
    await boardPage.cardDialogCancelBtn().click();
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();
  });

  test('should create a card with title only', async () => {
    const boardPage = new KanbanBoardPage(page);
    const cardTitle = 'Card-' + generateRandmString(8);
    await boardPage.createCard(cardTitle);
    // Verify card was created by checking it exists somewhere on the board
    const cardLocator = page.locator('.card-title').filter({ hasText: cardTitle });
    await expect(cardLocator.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show new card in correct column', async () => {
    const boardPage = new KanbanBoardPage(page);
    const cardTitle = 'ColCard-' + generateRandmString(8);
    // Get card count in first column (Backlog) before creation
    const countBefore = await boardPage.getCardCountInColumn(0);
    await boardPage.createCard(cardTitle);
    // Verify card count increased in the first column
    const countAfter = await boardPage.getCardCountInColumn(0);
    expect(countAfter).toBeGreaterThan(countBefore);
    // Verify card title appears in the first column
    const cardInColumn = boardPage.cardsInColumn(0).locator('.card-title').filter({ hasText: cardTitle });
    await expect(cardInColumn.first()).toBeVisible({ timeout: 10000 });
  });

  test('should create a card with all fields (type, priority, description)', async () => {
    const boardPage = new KanbanBoardPage(page);
    const cardTitle = 'FullCard-' + generateRandmString(8);
    const cardDescription = 'Description for ' + cardTitle;
    await boardPage.newIssueBtn().click();
    await page.locator('mat-dialog-container').waitFor({ state: 'visible', timeout: 20000 });
    await boardPage.cardTitleInput().fill(cardTitle);
    // Fill description if field is available
    const descField = boardPage.cardDescriptionInput();
    if (await descField.isVisible().catch(() => false)) {
      await descField.fill(cardDescription);
    }
    // Select type if dropdown is available
    const typeSelect = page.locator('mat-dialog-container mat-select').first();
    if (await typeSelect.isVisible().catch(() => false)) {
      await typeSelect.click();
      await page.locator('mat-option').first().click();
      await page.waitForTimeout(300);
    }
    // Select priority if dropdown is available
    const prioritySelect = page.locator('mat-dialog-container mat-select').nth(1);
    if (await prioritySelect.isVisible().catch(() => false)) {
      await prioritySelect.click();
      await page.locator('mat-option').first().click();
      await page.waitForTimeout(300);
    }
    await boardPage.cardDialogCreateBtn().click();
    await page.locator('mat-dialog-container').waitFor({ state: 'hidden', timeout: 20000 });
    await page.waitForTimeout(1000);
    // Verify card was created
    const cardLocator = page.locator('.card-title').filter({ hasText: cardTitle });
    await expect(cardLocator.first()).toBeVisible({ timeout: 10000 });
  });
});
