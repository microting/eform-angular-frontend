import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';

let page;

test.describe('Kanban - Filters', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Filter Test Board');
    await boardPage.openBoardByIndex(0);
    // Create a test card for filtering
    await boardPage.createCard('Filter Test Card');
  });
  test.afterAll(async () => { await page.close(); });

  test('should filter cards by search text', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.searchInput().fill('Filter Test');
    await page.waitForTimeout(1000);
    // Verify card is visible
    const visibleCards = page.locator('.card-title:has-text("Filter Test Card")');
    await expect(visibleCards.first()).toBeVisible();
  });

  test('should show no results for non-matching search', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.searchInput().clear();
    await boardPage.searchInput().fill('NonExistentCard12345');
    await page.waitForTimeout(1000);
    const visibleCards = page.locator('.card-title');
    expect(await visibleCards.count()).toBe(0);
  });

  test('should clear filters', async () => {
    const boardPage = new KanbanBoardPage(page);
    await boardPage.clearFiltersBtn().click();
    await page.waitForTimeout(1000);
    const visibleCards = page.locator('.card-title');
    expect(await visibleCards.count()).toBeGreaterThan(0);
  });

  test('should toggle thumbnail visibility', async () => {
    const boardPage = new KanbanBoardPage(page);
    const toggle = boardPage.showThumbnailsToggle();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await page.waitForTimeout(500);
    // Toggle back
    await toggle.click();
    await page.waitForTimeout(500);
  });
});
