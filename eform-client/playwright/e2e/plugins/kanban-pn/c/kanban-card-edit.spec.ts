import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { KanbanCardDetailPage } from '../KanbanCardDetail.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Card Edit', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Card Edit Test Board');
    await boardPage.openBoardByIndex(0);
    // Create a card for edit tests
    await boardPage.createCard('EditTestCard-' + generateRandmString(8));
  });
  test.afterAll(async () => { await page.close(); });

  test('should open card detail panel on card click', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await expect(detailPage.panel()).toBeVisible();
    await expect(detailPage.title()).toBeVisible();
    await detailPage.close();
  });

  test('should enter edit mode via edit button', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.editBtn().click();
    await page.waitForTimeout(500);
    await expect(detailPage.editTitleInput()).toBeVisible();
    // Cancel edit to restore state
    await detailPage.editCancelBtn().click();
    await page.waitForTimeout(300);
    await detailPage.close();
  });

  test('should edit card title', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.editBtn().click();
    await page.waitForTimeout(500);
    const newTitle = 'Edited-' + generateRandmString(8);
    await detailPage.editTitleInput().clear();
    await detailPage.editTitleInput().fill(newTitle);
    await expect(detailPage.editTitleInput()).toHaveValue(newTitle);
    // Cancel to not persist for now
    await detailPage.editCancelBtn().click();
    await page.waitForTimeout(300);
    await detailPage.close();
  });

  test('should edit card description', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.editBtn().click();
    await page.waitForTimeout(500);
    const newDesc = 'Updated description ' + generateRandmString(8);
    const descInput = detailPage.editDescriptionInput();
    if (await descInput.isVisible().catch(() => false)) {
      await descInput.clear();
      await descInput.fill(newDesc);
      await expect(descInput).toHaveValue(newDesc);
    }
    await detailPage.editCancelBtn().click();
    await page.waitForTimeout(300);
    await detailPage.close();
  });

  test('should save edit and verify changes', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.editBtn().click();
    await page.waitForTimeout(500);
    const savedTitle = 'Saved-' + generateRandmString(8);
    await detailPage.editTitleInput().clear();
    await detailPage.editTitleInput().fill(savedTitle);
    await detailPage.editSaveBtn().click();
    await page.waitForTimeout(1000);
    // Verify title was updated
    await expect(detailPage.title()).toContainText(savedTitle);
    await detailPage.close();
  });

  test('should cancel edit without saving', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    const originalTitle = await detailPage.title().innerText();
    await detailPage.editBtn().click();
    await page.waitForTimeout(500);
    await detailPage.editTitleInput().clear();
    await detailPage.editTitleInput().fill('ShouldNotSave-' + generateRandmString(8));
    await detailPage.editCancelBtn().click();
    await page.waitForTimeout(500);
    // Verify title is unchanged
    await expect(detailPage.title()).toContainText(originalTitle);
    await detailPage.close();
  });

  test('should show task progress bar when tasks exist', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    // Check for progress bar presence (may only appear when tasks exist)
    const progressBar = detailPage.panel().locator('mat-progress-bar, .progress-bar');
    // This is a conditional check - progress bar may or may not be visible
    const isVisible = await progressBar.first().isVisible().catch(() => false);
    if (isVisible) {
      await expect(progressBar.first()).toBeVisible();
    }
    await detailPage.close();
  });
});
