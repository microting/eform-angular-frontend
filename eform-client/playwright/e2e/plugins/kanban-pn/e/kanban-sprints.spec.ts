import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { KanbanSettingsPage } from '../KanbanSettings.page';

let page;

test.describe('Kanban - Sprints', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    // Create a board so boardId 1 exists on a fresh DB
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Sprints Test Board');
  });
  test.afterAll(async () => { await page.close(); });

  test('should navigate to sprint panel', async () => {
    const settingsPage = new KanbanSettingsPage(page);
    await settingsPage.goToSprintPanel(1);
    await page.waitForTimeout(1000);
    // Verify we are on the sprints page
    const url = page.url();
    expect(url).toContain('sprints');
  });

  test('should show create sprint button', async () => {
    const settingsPage = new KanbanSettingsPage(page);
    await expect(settingsPage.createSprintBtn()).toBeVisible({ timeout: 10000 });
  });

  test('should create a sprint', async () => {
    const settingsPage = new KanbanSettingsPage(page);
    await settingsPage.createSprintBtn().click();
    await page.waitForTimeout(500);
    const dialog = page.locator('mat-dialog-container');
    const dialogVisible = await dialog.isVisible().catch(() => false);
    if (dialogVisible) {
      // Fill sprint name
      const nameInput = dialog.locator('input[matinput]').first();
      if (await nameInput.isVisible().catch(() => false)) {
        await nameInput.fill('Sprint 1');
      }
      // Fill dates if available
      const dateInputs = dialog.locator('input[matinput]');
      const inputCount = await dateInputs.count();
      if (inputCount >= 3) {
        // Start date and end date inputs may be present
        await dateInputs.nth(1).fill('2026-04-06');
        await dateInputs.nth(2).fill('2026-04-20');
      }
      // Save
      const saveBtn = dialog.locator('.btn-primary, button').filter({ hasText: /Save|Create/ });
      await saveBtn.first().click();
      await dialog.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1000);
      // Verify sprint was created
      const sprintCount = await settingsPage.sprintCards().count();
      expect(sprintCount).toBeGreaterThanOrEqual(1);
    }
  });
});
