import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { KanbanCardDetailPage } from '../KanbanCardDetail.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Board List', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
  });
  test.afterAll(async () => { await page.close(); });

  test('should display board list page', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await expect(boardPage.createBoardBtn()).toBeVisible();
  });

  test('should open create board dialog', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.createBoardBtn().click();
    await expect(page.locator('mat-dialog-container')).toBeVisible();
  });

  test('should close dialog on cancel', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.cancelBoardBtn().click();
    await expect(page.locator('mat-dialog-container')).not.toBeVisible();
  });

  test('should create a new board', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.createBoard('Test Board', 'A test kanban board');
    await page.waitForTimeout(1000);
    const cards = boardPage.boardCards();
    await expect(cards.first()).toBeVisible();
  });

  test('should show card count on board card', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Board has 0 cards initially
    const stats = boardPage.boardCardStats(0);
    await expect(stats).toBeVisible();
    const cardCount = boardPage.boardCardCount(0);
    await expect(cardCount).toContainText('0');
  });

  test('should not show task progress when no tasks exist', async () => {
    const boardPage = new KanbanBoardPage(page);
    const progress = boardPage.boardTaskProgress(0);
    await expect(progress).not.toBeVisible();
  });

  test('should update card count after creating a card', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Open board, create a card, go back to list
    await boardPage.openBoardByIndex(0);
    await boardPage.createCard('StatsTestCard-' + generateRandmString(8));
    await boardPage.goToBoardListPage();
    // Card count should now be 1
    const cardCount = boardPage.boardCardCount(0);
    await expect(cardCount).toContainText('1');
  });

  test('should show task progress after adding a task', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    // Open board and card detail
    await boardPage.openBoardByIndex(0);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.tasksTab().click();
    await page.waitForTimeout(500);
    // Create a task
    await detailPage.addTaskBtn().click();
    const overlayPane = page.locator('.cdk-overlay-pane:has(mat-dialog-container), .cdk-overlay-pane:has(.mat-mdc-dialog-container)').last();
    await overlayPane.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(500);
    const titleInput = overlayPane.locator('input[formcontrolname="title"]').first();
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await titleInput.fill('TestTask-' + generateRandmString(8));
    await page.waitForTimeout(300);
    const saveBtn = overlayPane.locator('.btn-primary').first();
    await saveBtn.click();
    await overlayPane.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    // Close detail panel
    await detailPage.close();
    // Go back to board list
    await boardPage.goToBoardListPage();
    // Task progress should now be visible
    const progress = boardPage.boardTaskProgress(0);
    await expect(progress).toBeVisible({ timeout: 10000 });
    const label = boardPage.boardTaskProgressLabel(0);
    await expect(label).toContainText('0/1');
  });

  test('should navigate to board view', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.openBoardByIndex(0);
    await expect(boardPage.boardName()).toBeVisible();
    await expect(boardPage.columnsContainer()).toBeVisible();
  });
});
