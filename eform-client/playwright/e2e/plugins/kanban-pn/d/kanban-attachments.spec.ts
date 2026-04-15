import { test, expect } from '@playwright/test';
import { LoginPage } from '../../../Page objects/Login.page';
import { KanbanBoardPage } from '../KanbanBoard.page';
import { KanbanCardDetailPage } from '../KanbanCardDetail.page';
import { generateRandmString } from '../../../helper-functions';
import * as path from 'path';
import * as fs from 'fs';

let page;

test.describe('Kanban - Attachments', () => {
  let tempFilePath: string;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    const loginPage = new LoginPage(page);
    await loginPage.open('/auth');
    await loginPage.login();
    const boardPage = new KanbanBoardPage(page);
    await boardPage.goToBoardListPage();
    await boardPage.createBoard('Attachments Test Board');
    await boardPage.openBoardByIndex(0);
    // Create a card for attachment tests
    await boardPage.createCard('AttachTestCard-' + generateRandmString(8));
    // Create a temporary test file for upload
    tempFilePath = path.join(__dirname, 'test-upload-' + generateRandmString(8) + '.txt');
    fs.writeFileSync(tempFilePath, 'Test file content for attachment upload');
  });
  test.afterAll(async () => {
    // Clean up temp file
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }
    await page.close();
  });

  test('should show attachments tab', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await expect(detailPage.attachmentsTab()).toBeVisible();
    await detailPage.close();
  });

  test('should upload a file', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.attachmentsTab().click();
    await page.waitForTimeout(500);
    const fileInput = detailPage.fileInput();
    await fileInput.setInputFiles(tempFilePath);
    await page.waitForTimeout(2000);
    await detailPage.close();
  });

  test('should display file in list', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.attachmentsTab().click();
    await page.waitForTimeout(500);
    const attachmentCount = await detailPage.attachmentItems().count();
    expect(attachmentCount).toBeGreaterThanOrEqual(1);
    await detailPage.close();
  });

  test('should delete an attachment', async () => {
    const boardPage = new KanbanBoardPage(page);
    const detailPage = new KanbanCardDetailPage(page);
    await detailPage.openCard(boardPage, 0, 0);
    await detailPage.attachmentsTab().click();
    await page.waitForTimeout(500);
    const countBefore = await detailPage.attachmentItems().count();
    if (countBefore > 0) {
      // Click delete button on the first attachment
      const deleteBtn = detailPage.attachmentItems().first().locator('button mat-icon:has-text("delete"), button mat-icon:has-text("close")').locator('..');
      await deleteBtn.first().click();
      await page.waitForTimeout(500);
      // Confirm deletion if dialog appears
      const confirmBtn = page.locator('mat-dialog-container .btn-primary, mat-dialog-container button').filter({ hasText: /Yes|Confirm|OK|Delete/ });
      if (await confirmBtn.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.first().click();
        await page.locator('mat-dialog-container').waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
      }
      await page.waitForTimeout(1000);
      const countAfter = await detailPage.attachmentItems().count();
      expect(countAfter).toBeLessThan(countBefore);
    }
    await detailPage.close();
  });
});
