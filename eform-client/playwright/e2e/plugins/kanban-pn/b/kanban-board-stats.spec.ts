import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';

let page;

test.describe('Kanban - Board Stats & Navigation', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('StatsNav Board');
    await boardPage.openBoardByIndex(0);
  });
  test.afterAll(async () => { await page.close(); });

  test('should show Gantt icon button in filter bar', async () => {
    await expect(page.locator('#ganttChartBtn')).toBeVisible();
  });

  test('should navigate to Gantt chart via button', async () => {
    await page.locator('#ganttChartBtn').click();
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/gantt');
    await page.goBack();
    await page.waitForTimeout(1000);
  });

  test('should show Statistics icon button in filter bar', async () => {
    await expect(page.locator('#statisticsBtn')).toBeVisible();
  });

  test('should navigate to Reports page via button', async () => {
    await page.locator('#statisticsBtn').click();
    await page.waitForTimeout(2000);
    expect(page.url()).toContain('/reports');
    await page.goBack();
    await page.waitForTimeout(1000);
  });
});
