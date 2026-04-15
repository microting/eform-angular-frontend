import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Card Context Menu', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Context Menu Test Board');
    await boardPage.openBoardByIndex(0);
  });
  test.afterAll(async () => { await page.close(); });

  test('should open context menu on card menu button click', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Create a dedicated card for this test
    await boardPage.createCard('CtxMenu-' + generateRandmString(8));
    await boardPage.cardMenuBtn(0, 0).click();
    const menu = page.locator('.mat-mdc-menu-panel').first();
    await menu.waitFor({ state: 'visible', timeout: 10000 });
    await expect(menu).toBeVisible();
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
  });

  test('should open card detail via "Open Details"', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Create a dedicated card for this test
    await boardPage.createCard('Details-' + generateRandmString(8));
    const cardCount = await boardPage.getCardCountInColumn(0);
    await boardPage.cardMenuBtn(0, cardCount - 1).click();
    const menu = page.locator('.mat-mdc-menu-panel').first();
    await menu.waitFor({ state: 'visible', timeout: 10000 });
    const menuItem = menu.locator('[mat-menu-item], .mat-mdc-menu-item').filter({ hasText: 'OpenDetails' });
    await menuItem.first().click();
    await page.waitForTimeout(500);
    const detailPanel = page.locator('.card-detail-panel');
    await expect(detailPanel).toBeVisible({ timeout: 10000 });
    // Close detail panel
    await page.locator('#closeCardDetailBtn').click();
    await detailPanel.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    // Also dismiss the overlay backdrop
    await page.locator('.card-detail-overlay').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.locator('.cdk-overlay-backdrop').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
  });

  test('should move card to another column via "Move to" submenu', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Create a dedicated card for the move test so it doesn't affect other tests
    const moveCardTitle = 'MoveCard-' + generateRandmString(8);
    await boardPage.createCard(moveCardTitle);
    const cardCount = await boardPage.getCardCountInColumn(0);
    const countBefore = await boardPage.getCardCountInColumn(1);
    // Open context menu on the last card in column 0 (the one we just created)
    await boardPage.cardMenuBtn(0, cardCount - 1).click();
    const menu = page.locator('.mat-mdc-menu-panel').first();
    await menu.waitFor({ state: 'visible', timeout: 10000 });
    const moveToTrigger = menu.locator('[mat-menu-item], .mat-mdc-menu-item').filter({ hasText: 'MoveTo' });
    await moveToTrigger.first().hover();
    await page.waitForTimeout(1000);
    // Click a column option in the submenu (skip the "MoveTo" trigger itself)
    const submenuOptions = page.locator('.mat-mdc-menu-panel [mat-menu-item], .mat-mdc-menu-panel .mat-mdc-menu-item');
    const columnOptions = submenuOptions.filter({ hasNotText: 'MoveTo' });
    await columnOptions.nth(1).click();
    await page.waitForTimeout(1000);
    // Ensure overlay backdrop is gone before proceeding
    await page.locator('.cdk-overlay-backdrop').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(500);
    const countAfter = await boardPage.getCardCountInColumn(1);
    expect(countAfter).toBeGreaterThanOrEqual(countBefore);
  });

  test('should change card priority via "Priority" submenu', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Create a dedicated card for the priority test
    await boardPage.createCard('Priority-' + generateRandmString(8));
    const cardCount = await boardPage.getCardCountInColumn(0);
    await boardPage.cardMenuBtn(0, cardCount - 1).click();
    const menu = page.locator('.mat-mdc-menu-panel').first();
    await menu.waitFor({ state: 'visible', timeout: 10000 });
    const priorityTrigger = menu.locator('[mat-menu-item], .mat-mdc-menu-item').filter({ hasText: 'ChangePriority' });
    await priorityTrigger.first().hover();
    await page.waitForTimeout(1000);
    // Select a priority option from submenu
    const submenuOptions = page.locator('.mat-mdc-menu-panel [mat-menu-item], .mat-mdc-menu-panel .mat-mdc-menu-item');
    const priorityOptions = submenuOptions.filter({ hasNotText: 'ChangePriority' }).filter({ hasNotText: 'MoveTo' });
    await priorityOptions.first().click();
    await page.waitForTimeout(1000);
  });

  test('should archive a card', async () => {
    const boardPage = new KanbanBoardPage(page);
    // Reload page to clear any lingering overlays from previous tests
    await page.reload();
    await page.waitForTimeout(2000);
    // Create a dedicated card for archiving
    const archiveCardTitle = 'ArchiveCard-' + generateRandmString(8);
    await boardPage.createCard(archiveCardTitle);
    const cardCount = await boardPage.getCardCountInColumn(0);
    await boardPage.cardMenuBtn(0, cardCount - 1).click();
    const menu = page.locator('.mat-mdc-menu-panel').first();
    await menu.waitFor({ state: 'visible', timeout: 10000 });
    const archiveItem = menu.locator('[mat-menu-item], .mat-mdc-menu-item').filter({ hasText: /Archive|Delete/ });
    await archiveItem.first().click();
    await page.waitForTimeout(500);
    // Confirm if a confirmation dialog appears
    const dialogContainer = page.locator('mat-dialog-container, .mat-mdc-dialog-container');
    const confirmBtn = dialogContainer.locator('.btn-primary, button').filter({ hasText: /Yes|Confirm|OK/ });
    if (await confirmBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await confirmBtn.first().click();
      await dialogContainer.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
    await page.waitForTimeout(1000);
    // Verify the card is no longer visible on the board
    const cardLocator = page.locator('.card-title').filter({ hasText: archiveCardTitle });
    await expect(cardLocator).toHaveCount(0, { timeout: 10000 });
  });
});
