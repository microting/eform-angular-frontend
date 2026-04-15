import { Page, Locator } from '@playwright/test';
import { PageWithNavbarPage } from '../../Page objects/PageWithNavbar.page';

export class KanbanBoardPage extends PageWithNavbarPage {
  constructor(page: Page) { super(page); }

  // Navigation
  public kanbanPnMenuItem(): Locator { return this.page.locator('#kanban-pn'); }
  // Check what the actual nav menu selector is — it may be different. Use a generic approach:
  // Look for link text containing 'Kanban' or 'Boards'

  // Board List Page
  public createBoardBtn(): Locator { return this.page.locator('#createBoardBtn'); }
  public boardCards(): Locator { return this.page.locator('.board-card'); }
  public boardCardStats(index: number): Locator { return this.boardCards().nth(index).locator('.board-stats'); }
  public boardCardCount(index: number): Locator { return this.boardCards().nth(index).locator('.stat'); }
  public boardTaskProgress(index: number): Locator { return this.boardCards().nth(index).locator('.task-progress'); }
  public boardTaskProgressBar(index: number): Locator { return this.boardCards().nth(index).locator('.task-progress-bar'); }
  public boardTaskProgressLabel(index: number): Locator { return this.boardCards().nth(index).locator('.task-progress-label'); }

  // Create Board Dialog
  public boardNameInput(): Locator { return this.page.locator('mat-dialog-container input[formcontrolname="name"], mat-dialog-container input[matinput]').first(); }
  public boardDescriptionInput(): Locator { return this.page.locator('mat-dialog-container textarea'); }
  public cancelBoardBtn(): Locator { return this.page.locator('#cancelBoardBtn'); }
  public saveBoardBtn(): Locator { return this.page.locator('#saveBoardBtn'); }

  // Board View
  public boardName(): Locator { return this.page.locator('.board-header h2, mat-card.board-header h2'); }
  public columnsContainer(): Locator { return this.page.locator('.columns-container'); }
  public columns(): Locator { return this.page.locator('app-kanban-board-column'); }
  public columnNames(): Locator { return this.page.locator('.column-name'); }
  public addColumnPlaceholder(): Locator { return this.page.locator('.add-column-placeholder'); }
  public addColumnInput(): Locator { return this.page.locator('.add-column-form input[matinput]'); }
  public addColumnConfirmBtn(): Locator { return this.page.locator('.add-column-form .btn-primary'); }

  // Filters
  public searchInput(): Locator { return this.page.locator('#searchInput'); }
  public clearFiltersBtn(): Locator { return this.page.locator('#clearFiltersBtn'); }
  public newIssueBtn(): Locator { return this.page.locator('#newIssueBtn'); }
  public showThumbnailsToggle(): Locator { return this.page.locator('mat-slide-toggle'); }

  // Create Card Dialog
  public cardTitleInput(): Locator { return this.page.locator('mat-dialog-container input[matinput]').first(); }
  public cardDescriptionInput(): Locator { return this.page.locator('mat-dialog-container textarea[matinput]'); }
  public cardDialogCancelBtn(): Locator { return this.page.locator('mat-dialog-container .btn-cancel'); }
  public cardDialogCreateBtn(): Locator { return this.page.locator('mat-dialog-container .btn-primary'); }

  // Column Menu
  public columnMenuTrigger(colIndex: number): Locator {
    return this.page.locator('app-kanban-column-menu button[mat-icon-button]').nth(colIndex);
  }

  // Cards
  public cardsInColumn(colIndex: number): Locator {
    return this.columns().nth(colIndex).locator('.card-item');
  }
  public cardMenuBtn(colIndex: number, cardIndex: number): Locator {
    return this.cardsInColumn(colIndex).nth(cardIndex).locator('.card-menu-btn');
  }
  public cardTitle(colIndex: number, cardIndex: number): Locator {
    return this.cardsInColumn(colIndex).nth(cardIndex).locator('.card-title');
  }

  // Helper methods
  public async goToBoardListPage(): Promise<void> {
    // Navigate to kanban plugin boards page
    await this.page.goto('/plugins/kanban-pn');
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  public async openBoardByIndex(index: number): Promise<void> {
    await this.boardCards().nth(index).click();
    await this.page.locator('#spinner-animation').waitFor({ state: 'hidden', timeout: 90000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
  }

  public async createBoard(name: string, description?: string): Promise<void> {
    await this.createBoardBtn().click();
    await this.page.locator('mat-dialog-container').waitFor({ state: 'visible', timeout: 20000 });
    await this.boardNameInput().fill(name);
    if (description) await this.boardDescriptionInput().fill(description);
    await this.saveBoardBtn().click();
    await this.page.locator('mat-dialog-container').waitFor({ state: 'hidden', timeout: 20000 });
    await this.page.waitForTimeout(1000);
  }

  public async createCard(title: string): Promise<void> {
    // Dismiss any stale CDK overlay backdrops that might block the click
    const backdrop = this.page.locator('.cdk-overlay-backdrop');
    if (await backdrop.first().isVisible().catch(() => false)) {
      await backdrop.first().click({ force: true });
      await this.page.waitForTimeout(500);
    }
    await this.newIssueBtn().click();
    await this.page.locator('mat-dialog-container').waitFor({ state: 'visible', timeout: 20000 });
    await this.cardTitleInput().fill(title);
    await this.cardDialogCreateBtn().click();
    await this.page.locator('mat-dialog-container').waitFor({ state: 'hidden', timeout: 20000 });
    await this.page.waitForTimeout(1000);
  }

  public async getColumnCount(): Promise<number> {
    return await this.columns().count();
  }

  public async getCardCountInColumn(colIndex: number): Promise<number> {
    return await this.cardsInColumn(colIndex).count();
  }
}
