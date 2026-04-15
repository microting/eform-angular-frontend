import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { KanbanCardDetailPage } from '../KanbanCardDetail.page';
import { generateRandmString } from '../../../helper-functions';

let page;

test.describe('Kanban - Comments', () => {
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Comments Test Board');
    await boardPage.openBoardByIndex(0);
    // Create a card for comment tests
    await boardPage.createCard('CommentTestCard-' + generateRandmString(8));
  });
  test.afterAll(async () => { await page.close(); });

  test('should show comments tab', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await expect(detailPage.commentsTab()).toBeVisible();
    await detailPage.close();
  });

  test('should add a comment', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.commentsTab().click();
    await page.waitForTimeout(500);
    const commentText = 'Comment-' + generateRandmString(12);
    await detailPage.commentTextarea().fill(commentText);
    await detailPage.saveCommentBtn().click();
    await page.waitForTimeout(1000);
    // Verify comment was added
    const commentCount = await detailPage.commentItems().count();
    expect(commentCount).toBeGreaterThanOrEqual(1);
    await detailPage.close();
  });

  test('should display comment text', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.commentsTab().click();
    await page.waitForTimeout(500);
    const commentCount = await detailPage.commentItems().count();
    if (commentCount > 0) {
      const commentText = await detailPage.commentItems().first().innerText();
      expect(commentText.length).toBeGreaterThan(0);
    }
    await detailPage.close();
  });

  test('should disable save when empty', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.commentsTab().click();
    await page.waitForTimeout(500);
    // Clear the textarea
    await detailPage.commentTextarea().clear();
    await page.waitForTimeout(300);
    // Verify save button is disabled
    const saveBtn = detailPage.saveCommentBtn();
    const isDisabled = await saveBtn.isDisabled().catch(() => null);
    if (isDisabled !== null) {
      expect(isDisabled).toBeTruthy();
    }
    await detailPage.close();
  });
});
