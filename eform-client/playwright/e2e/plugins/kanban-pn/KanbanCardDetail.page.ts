import { Page, Locator } from '@playwright/test';

export class KanbanCardDetailPage {
  constructor(public page: Page) {}

  // Panel
  public panel(): Locator { return this.page.locator('.card-detail-panel'); }
  public closeBtn(): Locator { return this.page.locator('#closeCardDetailBtn'); }
  public editBtn(): Locator { return this.panel().locator('button:has(mat-icon:has-text("edit"))').first(); }

  // View mode
  public title(): Locator { return this.panel().locator('.panel-header h3'); }
  public priorityBadge(): Locator { return this.panel().locator('.priority-badge'); }
  public dueDate(): Locator { return this.panel().locator('.due-date'); }
  public description(): Locator { return this.panel().locator('.card-description p'); }

  // Edit mode
  public editTitleInput(): Locator { return this.panel().locator('.panel-header mat-form-field input'); }
  public editDescriptionInput(): Locator { return this.panel().locator('textarea[formcontrolname="description"]'); }
  public editSaveBtn(): Locator { return this.panel().locator('#editSaveBtn, button.btn-primary').first(); }
  public editCancelBtn(): Locator { return this.panel().locator('#editCancelBtn, button.btn-cancel').first(); }

  // Tabs
  public tasksTab(): Locator { return this.page.locator('.mat-mdc-tab').filter({ hasText: /^Tasks$/ }); }
  public commentsTab(): Locator { return this.page.locator('.mat-mdc-tab').filter({ hasText: /^Comments$/ }); }
  public attachmentsTab(): Locator { return this.page.locator('.mat-mdc-tab').filter({ hasText: /^Attachments$/ }); }
  public dependenciesTab(): Locator { return this.page.locator('.mat-mdc-tab').filter({ hasText: /^Dependencies$/ }); }
  public activityTab(): Locator { return this.page.locator('.mat-mdc-tab').filter({ hasText: /^ActivityLog$/ }); }

  // Tasks
  public addTaskBtn(): Locator { return this.page.locator('#addTaskBtn'); }
  public taskItems(): Locator { return this.panel().locator('.task-item'); }
  public taskCheckbox(index: number): Locator { return this.taskItems().nth(index).locator('mat-checkbox'); }
  public taskTitle(index: number): Locator { return this.taskItems().nth(index).locator('.task-title'); }
  public taskEditBtn(index: number): Locator { return this.taskItems().nth(index).locator('button:has(mat-icon:has-text("edit"))').first(); }
  public taskDeleteBtn(index: number): Locator { return this.taskItems().nth(index).locator('button:has(mat-icon:has-text("delete"))').first(); }

  // Comments
  public commentTextarea(): Locator { return this.panel().locator('.comment-form textarea'); }
  public saveCommentBtn(): Locator { return this.page.locator('#saveCommentBtn'); }
  public commentItems(): Locator { return this.panel().locator('.comment-item'); }

  // Attachments
  public attachmentItems(): Locator { return this.panel().locator('.attachment-item'); }
  public uploadBtn(): Locator { return this.panel().locator('.upload-area .btn-primary'); }
  public fileInput(): Locator { return this.panel().locator('.upload-area input[type="file"]'); }

  // Dependencies
  public addDependencyBtn(): Locator { return this.panel().locator('.btn-primary:has-text("AddDependency"), .btn-primary span:has-text("AddDependency")').first(); }

  // Activity
  public activityEntries(): Locator { return this.panel().locator('.entry'); }

  // Helpers
  public async openCard(boardPage: any, colIndex: number, cardIndex: number): Promise<void> {
    const card = boardPage.cardsInColumn(colIndex).nth(cardIndex);
    await card.click();
    await this.panel().waitFor({ state: 'visible', timeout: 20000 });
    await this.page.waitForTimeout(500);
  }

  public async close(): Promise<void> {
    await this.closeBtn().click();
    await this.panel().waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    await this.page.waitForTimeout(500);
  }
}
