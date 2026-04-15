import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';

let page;

test.describe('Kanban - Board View', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Test Board', 'A test kanban board');
    await boardPage.openBoardByIndex(0);
  });
  test.afterAll(async () => { await page.close(); });

  test('should display board name', async () => {
    const boardPage = new KanbanBoardPage(page);
    const name = await boardPage.boardName().innerText();
    expect(name.length).toBeGreaterThan(0);
  });

  test('should show default columns', async () => {
    const boardPage = new KanbanBoardPage(page);
    const count = await boardPage.getColumnCount();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should display column names', async () => {
    const boardPage = new KanbanBoardPage(page);
    const names = await boardPage.columnNames().allInnerTexts();
    expect(names).toContain('Backlog');
    expect(names).toContain('Done');
  });

  test('should show add column placeholder', async () => {
    const boardPage = new KanbanBoardPage(page);
    await expect(boardPage.addColumnPlaceholder()).toBeVisible();
  });
});
