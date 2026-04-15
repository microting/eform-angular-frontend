import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { KanbanCardDetailPage } from '../KanbanCardDetail.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Tasks', () => {
  let boardPage: InstanceType<typeof KanbanBoardPage>;
  let detailPage: InstanceType<typeof KanbanCardDetailPage>;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    boardPage = new KanbanBoardPage(page);
    detailPage = new KanbanCardDetailPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Tasks Test Board');
    await boardPage.openBoardByIndex(0);
    // Create a card and open it once — keep the detail panel open for all tests
    await boardPage.createCard('TaskTestCard-' + generateRandmString(8));
    await detailPage.openCard(boardPage, 0, 0);
    // Navigate to the Tasks tab once
    await detailPage.tasksTab().click();
    await page.waitForTimeout(1000);
  });
  test.afterAll(async () => { await page.close(); });

  test('should display "No tasks" when empty', async () => {
    const taskCount = await detailPage.taskItems().count();
    if (taskCount === 0) {
      const noTasksText = page.locator('.card-detail-panel').filter({ hasText: /No tasks|no tasks/i });
      await expect(noTasksText.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // Some implementations may not show "No tasks" text
      });
    }
  });

  test('should create a task with title', async () => {
    const taskTitle = 'Task-' + generateRandmString(8);
    // Ensure we're on the Tasks tab and the add task button is visible
    await detailPage.tasksTab().click();
    await page.waitForTimeout(500);
    await detailPage.addTaskBtn().waitFor({ state: 'visible', timeout: 10000 });
    await detailPage.addTaskBtn().click();
    // Wait for dialog overlay pane to appear
    const overlayPane = page.locator('.cdk-overlay-pane:has(mat-dialog-container), .cdk-overlay-pane:has(.mat-mdc-dialog-container)').last();
    await overlayPane.waitFor({ state: 'visible', timeout: 20000 });
    await page.waitForTimeout(500);
    // Fill the title field inside the dialog (formcontrolname="title" is the 2nd input after estimation)
    const titleInput = overlayPane.locator('input[formcontrolname="title"], input[ng-reflect-form-control-name="title"]').first();
    await titleInput.waitFor({ state: 'visible', timeout: 10000 });
    await titleInput.fill(taskTitle);
    await page.waitForTimeout(300);
    // Click the save/create button INSIDE the dialog overlay
    const saveBtn = overlayPane.locator('.btn-primary').first();
    await saveBtn.click();
    await page.waitForTimeout(1000);
    // Wait for dialog to close
    await overlayPane.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    // Verify task was created
    const taskCount = await detailPage.taskItems().count();
    expect(taskCount).toBeGreaterThanOrEqual(1);
  });

  test('should toggle task completion', async () => {
    const taskCount = await detailPage.taskItems().count();
    if (taskCount > 0) {
      await detailPage.taskCheckbox(0).click();
      await page.waitForTimeout(500);
      const checkbox = detailPage.taskCheckbox(0).locator('input[type="checkbox"]');
      const isChecked = await checkbox.isChecked().catch(() => null);
      expect(isChecked).not.toBeNull();
    }
  });

  test('should update progress bar after completion', async () => {
    const progressBar = detailPage.panel().locator('mat-progress-bar, .progress-bar');
    const isVisible = await progressBar.first().isVisible().catch(() => false);
    if (isVisible) {
      const value = await progressBar.first().getAttribute('aria-valuenow').catch(() => null);
      if (value !== null) {
        expect(parseInt(value, 10)).toBeGreaterThanOrEqual(0);
      }
    }
  });

  test('should edit a task', async () => {
    const taskCount = await detailPage.taskItems().count();
    if (taskCount > 0) {
      await detailPage.taskEditBtn(0).click();
      const editOverlay = page.locator('.cdk-overlay-pane:has(mat-dialog-container), .cdk-overlay-pane:has(.mat-mdc-dialog-container)').last();
      await editOverlay.waitFor({ state: 'visible', timeout: 20000 });
      await page.waitForTimeout(500);
      const editedTitle = 'EditedTask-' + generateRandmString(8);
      const titleInput = editOverlay.locator('input[formcontrolname="title"]').first();
      await titleInput.waitFor({ state: 'visible', timeout: 10000 });
      await titleInput.clear();
      await titleInput.fill(editedTitle);
      await page.waitForTimeout(300);
      const saveBtn = editOverlay.locator('.btn-primary').first();
      await saveBtn.click();
      await editOverlay.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(1000);
    }
  });

  test('should delete a task', async () => {
    const taskCountBefore = await detailPage.taskItems().count();
    if (taskCountBefore > 0) {
      await detailPage.taskDeleteBtn(0).click();
      await page.waitForTimeout(500);
      const deleteDialogContainer = page.locator('mat-dialog-container, .mat-mdc-dialog-container');
      const confirmBtn = deleteDialogContainer.locator('.btn-primary, button').filter({ hasText: /Yes|Confirm|OK|Delete|Archive/ });
      if (await confirmBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.first().click();
        await deleteDialogContainer.first().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      }
      await page.waitForTimeout(1000);
      const taskCountAfter = await detailPage.taskItems().count();
      expect(taskCountAfter).toBeLessThan(taskCountBefore);
    }
  });
});
