import BasePage from './Page';
import { Page, Locator } from '@playwright/test';

const HOUR_HEIGHT = 52; // px per hour, mirrors calendar-task-block.component.ts

/**
 * Page object for the backend-configuration calendar
 * (/plugins/backend-configuration-pn/calendar).
 *
 * Encapsulates the create/edit-event flows used by the
 * "edit must not make the event disappear" regression spec.
 */
export class BackendConfigurationCalendarPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.open('/plugins/backend-configuration-pn/calendar');
    await this.dayColumns().first().waitFor({ state: 'visible', timeout: 60000 });
  }

  /** Clickable day cells in the week grid (#cal-day-0 .. #cal-day-6). */
  dayColumns(): Locator {
    return this.page.locator('.day-cell-content');
  }

  /** All rendered event tiles in the week grid. */
  eventTiles(): Locator {
    return this.page.locator('.task-content');
  }

  eventByTitle(title: string): Locator {
    return this.eventTiles().filter({ hasText: title });
  }

  /**
   * Click an empty slot in the given day column (0=Mon .. 6=Sun) at the given
   * hour to open the create-event modal. Avoids the left edge so the cdk drop
   * list / task tiles aren't hit.
   */
  async openCreateModalOnDay(dayIndex: number, hour: number) {
    const column = this.page.locator(`#cal-day-${dayIndex}`);
    await column.waitFor({ state: 'visible', timeout: 40000 });
    // relY in onCellClick is measured from the cell's own top (no header
    // offset), so the y position maps directly to the hour.
    const y = hour * HOUR_HEIGHT;
    await column.click({ position: { x: 24, y } });
    await this.page.locator('#calendarEventTitle').waitFor({ state: 'visible', timeout: 20000 });
  }

  /** Open the first available option of an mtx-select (wraps ng-select). */
  private async pickFirstOption(triggerSelector: string) {
    await this.page.locator(triggerSelector).click();
    const firstOption = this.page.locator('ng-dropdown-panel .ng-option').first();
    await firstOption.waitFor({ state: 'visible', timeout: 20000 });
    await firstOption.click();
  }

  /** Select the repeat option whose label contains the given text (e.g. "Ugentlig"). */
  private async pickRepeatContaining(text: string) {
    await this.page.locator('#calendarEventRepeat').click();
    const option = this.page.locator('ng-dropdown-panel .ng-option').filter({ hasText: text }).first();
    await option.waitFor({ state: 'visible', timeout: 20000 });
    await option.click();
  }

  /**
   * Create a weekly-recurring event on the given day. This is the exact shape
   * that triggered the disappear bug: a weekly task whose start lands on a
   * (trailing-Sunday) day, persisted with a multi-day weekday CSV.
   */
  async createWeeklyEvent(dayIndex: number, hour: number, title: string, repeatLabel: string) {
    await this.openCreateModalOnDay(dayIndex, hour);
    await this.page.locator('#calendarEventTitle').fill(title);
    await this.pickRepeatContaining(repeatLabel);
    // At least one worker must be assigned or the backend rejects the create.
    await this.pickFirstOption('#calendarEventAssignee');
    // A report headline (itemPlanningTag) is also required on create.
    await this.pickFirstOption('#calendarEventPlanningTag');
    await this.save();
  }

  /** Open an event's preview popover and click its edit (pencil) button. */
  async openEditForEvent(title: string) {
    await this.eventByTitle(title).first().click();
    const editBtn = this.page.locator('#calendarEventEditBtn');
    await editBtn.waitFor({ state: 'visible', timeout: 20000 });
    await editBtn.click();
    await this.page.locator('#calendarEventTitle').waitFor({ state: 'visible', timeout: 20000 });
  }

  async setTitle(title: string) {
    await this.page.locator('#calendarEventTitle').fill(title);
  }

  /**
   * Click Save and confirm the recurring-scope dialog if it appears (defaults
   * to the pre-selected scope — "Only this").
   */
  async save() {
    await this.page.locator('#calendarEventSaveBtn').click();
    // A recurring series shows a scope dialog first. Target it by id so the
    // assertion is locale-independent (the visible label is translated).
    const confirm = this.page.locator('#repeatScopeConfirmBtn');
    try {
      await confirm.waitFor({ state: 'visible', timeout: 2500 });
      await confirm.click();
    } catch {
      // No scope dialog — event was not part of a recurring series, or the
      // save went straight through.
    }
    // Wait for the modal to close (save succeeded + week reloaded) rather than
    // sleeping a fixed amount, so the test isn't flaky under CI load.
    await this.page.locator('#calendarEventSaveBtn').waitFor({ state: 'hidden', timeout: 20000 });
    await this.dayColumns().first().waitFor({ state: 'visible', timeout: 20000 });
  }
}
