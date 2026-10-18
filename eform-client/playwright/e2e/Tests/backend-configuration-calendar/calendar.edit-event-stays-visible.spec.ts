import { test, expect } from '@playwright/test';
import { LoginPage } from '../../Page objects/Login.page';
import { BackendConfigurationCalendarPage } from '../../Page objects/BackendConfigurationCalendar.page';

/**
 * Regression guard for the critical bug where editing ANY calendar event made
 * it disappear from the week view.
 *
 * Root cause: a weekly task whose StartDate landed on the trailing Sunday of a
 * Mon-Sun week was dropped by GetOccurrencesInWeek (Sunday-aligned bucket math
 * computed weeksFromAnchor = -1). Editing an event moved its StartDate onto the
 * clicked occurrence's date, so any edit of a Sunday occurrence triggered it.
 *
 * This spec reproduces the exact shape end-to-end: a weekly event on Sunday
 * (which pre-fix would not even render in its own week) is created, then edited,
 * asserting it stays visible both times.
 *
 * Idempotency: a stable title is used and the event is only created when
 * missing, so reruns reuse the same event instead of accumulating tiles (which
 * would otherwise occupy the create slot and break click-to-create).
 */
test.describe('Backend configuration calendar - edit keeps event visible', () => {
  let page;
  let loginPage: LoginPage;
  let calendar: BackendConfigurationCalendarPage;

  const SUNDAY = 6; // 0=Mon .. 6=Sun
  const CREATE_HOUR = 3; // empty early-morning slot
  // BASE is a substring of EDITED, so eventByTitle(BASE) matches the tile in
  // both states — keeping create-if-missing and the assertions rerun-safe.
  const BASE = 'PW Regression Weekly Sunday';
  const EDITED = `${BASE} edited`;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    loginPage = new LoginPage(page);
    calendar = new BackendConfigurationCalendarPage(page);
    await loginPage.open('/');
    await loginPage.login();
    await calendar.goto();

    if ((await calendar.eventByTitle(BASE).count()) === 0) {
      await calendar.createWeeklyEvent(SUNDAY, CREATE_HOUR, BASE, 'Ugentlig');
    }
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('a weekly Sunday event renders in its own week', async () => {
    // Pre-fix this failed: a weekly-Sunday event generated no occurrences in
    // its own week.
    await expect(calendar.eventByTitle(BASE).first()).toBeVisible({ timeout: 20000 });
  });

  test('editing the event does not make it disappear', async () => {
    await calendar.openEditForEvent(BASE);
    await calendar.setTitle(EDITED);
    await calendar.save();

    // The exact regression: after a successful edit the event must still be
    // present in the week grid (pre-fix it vanished).
    await expect(calendar.eventByTitle(EDITED).first()).toBeVisible({ timeout: 20000 });
  });
});
