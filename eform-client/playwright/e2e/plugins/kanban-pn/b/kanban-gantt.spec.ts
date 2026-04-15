import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';

let page;

test.describe('Kanban - Gantt Chart', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Gantt Test Board');
    await boardPage.openBoardByIndex(0);
    await page.locator('#ganttChartBtn').click();
    await page.waitForTimeout(2000);
  });
  test.afterAll(async () => { await page.close(); });

  test('should display Gantt chart page', async () => {
    expect(page.url()).toContain('/gantt');
  });

  test('should show Gantt toolbar with title', async () => {
    await expect(page.locator('.gantt-toolbar h2')).toBeVisible();
  });

  test('should show empty state or gantt body', async () => {
    const emptyMsg = page.locator('.gantt-empty');
    const ganttBody = page.locator('.gantt-body');
    const isEmpty = await emptyMsg.isVisible().catch(() => false);
    const hasBody = await ganttBody.isVisible().catch(() => false);
    expect(isEmpty || hasBody).toBeTruthy();
  });
});
