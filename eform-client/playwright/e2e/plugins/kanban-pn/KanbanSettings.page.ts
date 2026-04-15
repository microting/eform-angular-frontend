import { Page, Locator } from '@playwright/test';

export class KanbanSettingsPage {
  constructor(public page: Page) {}

  // Sprint Panel
  public createSprintBtn(): Locator { return this.page.locator('#createSprintBtn'); }
  public sprintCards(): Locator { return this.page.locator('.sprint-card'); }

  // Project List
  public addProjectBtn(): Locator { return this.page.locator('#addProjectBtn'); }
  public projectRows(): Locator { return this.page.locator('table tbody tr'); }

  // Board Settings
  public addColumnBtn(): Locator { return this.page.locator('#addColumnBtn'); }
  public columnRows(): Locator { return this.page.locator('.column-row'); }

  // Navigation
  public async goToSprintPanel(boardId: number): Promise<void> {
    await this.page.goto(`/plugins/kanban-pn/boards/${boardId}/sprints`);
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  public async goToProjectList(): Promise<void> {
    await this.page.goto('/plugins/kanban-pn/projects');
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  public async goToBoardSettings(boardId: number): Promise<void> {
    await this.page.goto(`/plugins/kanban-pn/boards/${boardId}/settings`);
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }
}
