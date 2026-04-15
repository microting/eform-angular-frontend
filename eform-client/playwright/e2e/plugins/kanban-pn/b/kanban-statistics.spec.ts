import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Board Reports', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Reports Test Board');
    await boardPage.openBoardByIndex(0);
    await boardPage.createCard('ReportsCard-' + generateRandmString(8));
    await page.locator('#statisticsBtn').click();
    await page.waitForTimeout(3000);
  });
  test.afterAll(async () => { await page.close(); });

  test('should navigate to reports page', async () => {
    expect(page.url()).toContain('/reports');
  });

  test('should render reports container', async () => {
    const container = page.locator('.reports-container');
    await expect(container).toBeVisible({ timeout: 10000 });
  });
});
