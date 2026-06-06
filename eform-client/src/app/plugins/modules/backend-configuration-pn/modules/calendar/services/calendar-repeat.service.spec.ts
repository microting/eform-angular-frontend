import {CalendarRepeatService} from './calendar-repeat.service';
import {CalendarRepeatMeta, CalendarTaskModel} from '../../../models/calendar';
import {TranslateService} from '@ngx-translate/core';

// Monday 2026-03-16 00:00:00 UTC
const BASE_DATE = new Date('2026-03-16T00:00:00').getTime();

// Pass-through stub: `instant(key)` returns the key itself, which is the same
// fallback ngx-translate uses when a key is missing. Sufficient for tests that
// only inspect option shape, not localised strings.
const translateStub = {
  instant: (key: string, _params?: any) => key,
} as unknown as TranslateService;

function dayOf(ts: number): number {
  return new Date(ts).getDate();
}

function weekdayOf(ts: number): number {
  return new Date(ts).getDay();
}

describe('CalendarRepeatService', () => {
  let service: CalendarRepeatService;

  beforeEach(() => {
    service = new CalendarRepeatService(translateStub);
  });

  // ─── getAllOccurrences ─────────────────────────────────────────────────────

  describe('getAllOccurrences – daily', () => {
    it('returns exactly afterCount consecutive days', () => {
      const meta: CalendarRepeatMeta = {kind: 'daily', endMode: 'after', afterCount: 5};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(5);
    });

    it('consecutive days are exactly 1 day apart', () => {
      const meta: CalendarRepeatMeta = {kind: 'daily', endMode: 'after', afterCount: 3};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect((result[1] - result[0]) / 86400000).toBe(1);
      expect((result[2] - result[1]) / 86400000).toBe(1);
    });

    it('endMode: until filters to dates on or before cutoff', () => {
      const until = new Date('2026-03-20').getTime();
      const meta: CalendarRepeatMeta = {kind: 'daily', endMode: 'until', untilTs: until};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      // 16, 17, 18, 19, 20 → 5 days
      expect(result).toHaveLength(5);
      expect(new Date(result[result.length - 1]).getDate()).toBe(20);
    });

    it('endMode: never returns up to 250 results', () => {
      const meta: CalendarRepeatMeta = {kind: 'daily', endMode: 'never'};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result.length).toBeLessThanOrEqual(250);
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('getAllOccurrences – everyNd', () => {
    it('every 3 days with after=4 returns 4 dates each 3 days apart', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNd', n: 3, endMode: 'after', afterCount: 4};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(4);
      expect((result[1] - result[0]) / 86400000).toBe(3);
      expect((result[2] - result[1]) / 86400000).toBe(3);
    });
  });

  describe('getAllOccurrences – weeklyOne', () => {
    it('weekly on Monday returns only Mondays', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 1, endMode: 'after', afterCount: 4};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(4);
      result.forEach(ts => expect(weekdayOf(ts)).toBe(1));
    });

    it('consecutive weekly occurrences are 7 calendar days apart', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 1, endMode: 'after', afterCount: 3};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      // Use date arithmetic to avoid DST millisecond drift
      const d0 = new Date(result[0]), d1 = new Date(result[1]), d2 = new Date(result[2]);
      expect(d1.getDate() - d0.getDate()).toBe(7);
      expect(d2.getDate() - d1.getDate()).toBe(7);
    });

    it('weekly on Friday starting from Monday advances to that Friday', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 5, endMode: 'after', afterCount: 2};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(weekdayOf(result[0])).toBe(5); // Friday
    });
  });

  describe('getAllOccurrences – weeklyMulti', () => {
    it('Mon+Wed+Fri pattern only produces those weekdays', () => {
      const meta: CalendarRepeatMeta = {
        kind: 'weeklyMulti', weekdays: [1, 3, 5], endMode: 'after', afterCount: 6
      };
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(6);
      result.forEach(ts => expect([1, 3, 5]).toContain(weekdayOf(ts)));
    });
  });

  describe('getAllOccurrences – monthlyDom', () => {
    it('returns the same day-of-month each month', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 16, endMode: 'after', afterCount: 4};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(4);
      result.forEach(ts => expect(dayOf(ts)).toBe(16));
    });
  });

  describe('getAllOccurrences – yearlyOne', () => {
    it('returns the same month and day each year', () => {
      const meta: CalendarRepeatMeta = {kind: 'yearlyOne', dom: 16, month: 2, endMode: 'after', afterCount: 3};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(3);
      result.forEach(ts => {
        const d = new Date(ts);
        expect(d.getMonth()).toBe(2);  // March
        expect(d.getDate()).toBe(16);
      });
      // Consecutive years
      expect(new Date(result[1]).getFullYear() - new Date(result[0]).getFullYear()).toBe(1);
    });
  });

  describe('getAllOccurrences – everyNWeekOne', () => {
    it('every 2 weeks on Monday returns Mondays 14 calendar days apart', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNWeekOne', n: 2, weekday: 1, endMode: 'after', afterCount: 3};
      const result = service.getAllOccurrences(meta, BASE_DATE);
      expect(result).toHaveLength(3);
      result.forEach(ts => expect(weekdayOf(ts)).toBe(1));
      // Math.round handles ±1h DST variance in millisecond comparison
      expect(Math.round((result[1] - result[0]) / 86400000)).toBe(14);
    });
  });

  // ─── buildRepeatSelectOptions ──────────────────────────────────────────────

  describe('buildRepeatSelectOptions', () => {
    const monday = new Date('2026-03-16'); // Monday, day=16, month=2

    it('returns exactly 7 options', () => {
      expect(service.buildRepeatSelectOptions(monday)).toHaveLength(7);
    });

    it('first option is "none"', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      expect(opts[0].value).toBe('none');
    });

    it('last option is "custom"', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      expect(opts[opts.length - 1].value).toBe('custom');
    });

    it('weeklyOne option carries the correct weekday from the date', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      const weeklyOpt = opts.find(o => o.meta?.kind === 'weeklyOne');
      expect(weeklyOpt).toBeDefined();
      expect(weeklyOpt!.meta!.weekday).toBe(1); // Monday = 1
    });

    it('monthlyDom option carries the correct day-of-month', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      const monthlyOpt = opts.find(o => o.meta?.kind === 'monthlyDom');
      expect(monthlyOpt).toBeDefined();
      expect(monthlyOpt!.meta!.dom).toBe(16);
    });

    it('yearlyOne option carries the correct month and dom', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      const yearlyOpt = opts.find(o => o.meta?.kind === 'yearlyOne');
      expect(yearlyOpt).toBeDefined();
      expect(yearlyOpt!.meta!.dom).toBe(16);
      expect(yearlyOpt!.meta!.month).toBe(2); // March = index 2
    });

    it('all non-custom options except "none" have a meta object', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      opts.filter(o => o.value !== 'none' && o.value !== 'custom')
        .forEach(o => expect(o.meta).toBeDefined());
    });

    // Guard for the "Alle hverdage (mandag til fredag)" save bug: the
    // modal's save path emits repeatWeekdaysCsv by passing this option's
    // meta to metaToWeekdaysCsv. If the meta drifts (e.g. someone changes
    // weekdays:[1..5] to a different shape), the backend reverts to
    // emitting zero Mon-Fri occurrences for the week.
    it('weekdays option carries weeklyMulti meta with weekdays [1..5]', () => {
      const opts = service.buildRepeatSelectOptions(monday);
      const wkOpt = opts.find(o => o.value === 'weekdays');
      expect(wkOpt).toBeDefined();
      expect(wkOpt!.meta!.kind).toBe('weeklyMulti');
      expect(wkOpt!.meta!.weekdays).toEqual([1, 2, 3, 4, 5]);
      expect(service.metaToWeekdaysCsv(wkOpt!.meta!)).toBe('1,2,3,4,5');
    });
  });

  // ─── buildMetaFromCustomConfig ────────────────────────────────────────────

  describe('buildMetaFromCustomConfig', () => {
    it('step=1 day maps to kind "daily"', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'day', [], 'never');
      expect(meta.kind).toBe('daily');
    });

    it('step=3 day maps to kind "everyNd" with n=3', () => {
      const meta = service.buildMetaFromCustomConfig(3, 'day', [], 'after', 5);
      expect(meta.kind).toBe('everyNd');
      expect(meta.n).toBe(3);
    });

    it('step=1 week, single weekday maps to kind "weeklyOne"', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [3], 'never');
      expect(meta.kind).toBe('weeklyOne');
      expect(meta.weekday).toBe(3);
    });

    it('step=1 week, multiple weekdays maps to kind "weeklyMulti"', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [1, 3, 5], 'never');
      expect(meta.kind).toBe('weeklyMulti');
      expect(meta.weekdays).toEqual([1, 3, 5]);
    });

    it('step=1 month maps to kind "monthlyDom"', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'month', [], 'never');
      expect(meta.kind).toBe('monthlyDom');
    });

    it('yearly preserves the selected day-of-month and month (#933)', () => {
      const date = new Date(2026, 5, 4); // Thu 4 June 2026 (month is 0-indexed)
      const meta = service.buildMetaFromCustomConfig(
        1, 'year', [], 'never', undefined, undefined, date,
      );
      expect(meta.kind).toBe('yearlyOne');
      expect(meta.dom).toBe(4);
      expect(meta.month).toBe(5);
    });

    it('everyNYear preserves the selected day-of-month and month (#933)', () => {
      const date = new Date(2026, 2, 15); // 15 March 2026
      const meta = service.buildMetaFromCustomConfig(
        2, 'year', [], 'never', undefined, undefined, date,
      );
      expect(meta.kind).toBe('everyNYear');
      expect(meta.dom).toBe(15);
      expect(meta.month).toBe(2);
    });

    it('monthly custom stays anchored to day 1 regardless of start date (#933 scope)', () => {
      const date = new Date(2026, 5, 15); // 15 June 2026
      const meta = service.buildMetaFromCustomConfig(
        1, 'month', [], 'never', undefined, undefined, date,
      );
      expect(meta.kind).toBe('monthlyDom');
      expect(meta.dom).toBe(1);
    });

    it('yearly without a date falls back to Jan 1 (backward-compatible)', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'year', [], 'never');
      expect(meta.kind).toBe('yearlyOne');
      expect(meta.dom).toBe(1);
      expect(meta.month).toBe(0);
    });

    it('endMode "after" is preserved with afterCount', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'day', [], 'after', 10);
      expect(meta.endMode).toBe('after');
      expect(meta.afterCount).toBe(10);
    });

    it('endMode "until" is preserved with untilTs', () => {
      const ts = new Date('2027-01-01').getTime();
      const meta = service.buildMetaFromCustomConfig(1, 'day', [], 'until', undefined, ts);
      expect(meta.endMode).toBe('until');
      expect(meta.untilTs).toBe(ts);
    });
  });

  // ─── decomposeCustomMeta ─────────────────────────────────────────────────
  //
  // Each test builds a meta via buildMetaFromCustomConfig, decomposes it,
  // and asserts the decomposed values round-trip back to the inputs.

  describe('decomposeCustomMeta', () => {
    it('weeklyOne (step=1, weekday=Tue) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [2], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(1);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([2]);
      expect(d.endMode).toBe('never');
    });

    it('weeklyMulti (step=1, weekdays=[1,2]) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [1, 2], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(1);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([1, 2]);
    });

    it('weeklyAll (constructed directly — builder collapses to everyNWeekAll)', () => {
      // The in-app builder cannot emit `kind: 'weeklyAll'` because empty
      // weekdays always lands on `everyNWeekAll`. Construct the meta directly
      // to cover the explicit `weeklyAll` switch branch.
      const meta: CalendarRepeatMeta = {kind: 'weeklyAll', endMode: 'never'};
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(1);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([]);
    });

    it('everyNWeekAll-via-builder (step=1, weekdays=[]) → unit=week, weekdays=[]', () => {
      // Confirm the builder's collapse path: empty weekdays + step=1 still
      // collapses to everyNWeekAll, and decompose handles it.
      const meta = service.buildMetaFromCustomConfig(1, 'week', [], 'never');
      expect(meta.kind).toBe('everyNWeekAll');
      const d = service.decomposeCustomMeta(meta);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([]);
    });

    it('everyNWeekOne (n=2, weekday=1) → step=2, unit=week, weekdays=[1]', () => {
      const meta = service.buildMetaFromCustomConfig(2, 'week', [1], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(2);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([1]);
    });

    it('everyNWeekMulti (n=3, weekdays=[1,3,5]) → step=3, unit=week, weekdays=[1,3,5]', () => {
      const meta = service.buildMetaFromCustomConfig(3, 'week', [1, 3, 5], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(3);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([1, 3, 5]);
    });

    it('everyNWeekAll (n=2) → weekdays=[]', () => {
      const meta = service.buildMetaFromCustomConfig(2, 'week', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(2);
      expect(d.unit).toBe('week');
      expect(d.weekdays).toEqual([]);
    });

    it('daily (step=1, day) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'day', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(1);
      expect(d.unit).toBe('day');
      expect(d.weekdays).toEqual([]);
    });

    it('everyNd (n=4) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(4, 'day', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(4);
      expect(d.unit).toBe('day');
      expect(d.weekdays).toEqual([]);
    });

    it('monthlyDom (step=1, month) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'month', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(1);
      expect(d.unit).toBe('month');
      expect(d.weekdays).toEqual([]);
    });

    it('everyNMonthDom (n=2) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(2, 'month', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(2);
      expect(d.unit).toBe('month');
      expect(d.weekdays).toEqual([]);
    });

    it('yearlyOne (step=1, year) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'year', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(1);
      expect(d.unit).toBe('year');
      expect(d.weekdays).toEqual([]);
    });

    it('everyNYear (n=5) round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(5, 'year', [], 'never');
      const d = service.decomposeCustomMeta(meta);
      expect(d.step).toBe(5);
      expect(d.unit).toBe('year');
      expect(d.weekdays).toEqual([]);
    });

    it('endMode "after" with afterCount=7 round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [2], 'after', 7);
      const d = service.decomposeCustomMeta(meta);
      expect(d.endMode).toBe('after');
      expect(d.afterCount).toBe(7);
    });

    it('endMode "until" with untilTs=12345 round-trips', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [2], 'until', undefined, 12345);
      const d = service.decomposeCustomMeta(meta);
      expect(d.endMode).toBe('until');
      expect(d.untilTs).toBe(12345);
    });
  });

  // ─── reconstructMetaFromTask ─────────────────────────────────────────────
  //
  // Build-→-save-→-reconstruct round-trip per kind, plus per-built-in-rule
  // cases, edge cases that must return null, the legacy fallback, the
  // weekdays mapping, and the three end-mode paths. See spec
  // 2026-04-30-calendar-edit-mode-meta-reconstruction-design.md.

  describe('reconstructMetaFromTask', () => {
    // Mirrors task-create-edit-modal.component.ts:onSave's kindMap / save flow
    // — the minimum task shape the modal would emit for a given meta. Used as
    // the fixture for round-trip tests so we exercise the same fields the
    // backend would actually store.
    const KIND_MAP: Record<string, number> = {
      'daily': 1, 'everyNd': 1,
      'weeklyOne': 2, 'weeklyMulti': 2, 'everyNWeekOne': 2,
      'everyNWeekMulti': 2, 'everyNWeekAll': 2, 'weeklyAll': 2,
      'monthlyDom': 3, 'everyNMonthDom': 3,
      'yearlyOne': 4, 'everyNYear': 4,
    };

    // Constructs the "fake task" the way the modal save flow would emit
    // for a given meta, then forces repeatRule='custom' so we exercise the
    // 'custom' switch branch (which is the only one populated by the modal
    // for non-trivial step sizes via calendar-container.mapRepeatType).
    // Single-step weekly cases would naturally go through the built-in
    // branches; those are covered separately by the per-built-in-rule
    // tests further down.
    function fakeTaskFromMeta(
      meta: CalendarRepeatMeta,
      taskDate: string,
    ): CalendarTaskModel {
      const repeatType = KIND_MAP[meta.kind] ?? 0;
      const repeatEvery = meta.n ?? 1;
      const repeatEndMode = meta.endMode === 'after' ? 1
        : meta.endMode === 'until' ? 2 : 0;
      const repeatOccurrences = meta.endMode === 'after'
        ? meta.afterCount ?? null : null;
      const repeatUntilDate = meta.endMode === 'until' && meta.untilTs != null
        ? new Date(meta.untilTs).toISOString() : null;
      // The save flow only writes a CSV when meta.weekdays?.length is truthy.
      // Single-weekday metas (weeklyOne/everyNWeekOne) leave it null and rely
      // on dayOfWeek; multi-day metas write the CSV.
      const repeatWeekdaysCsv = meta.weekdays?.length
        ? meta.weekdays.join(',') : null;
      const dayOfWeek = meta.weekday ?? null;
      const dayOfMonth = meta.dom ?? null;

      return {
        id: 1, title: 't', startHour: 9, duration: 1, startText: '09:00',
        endText: '10:00', tags: [], assigneeIds: [], boardId: 1, color: '',
        descriptionHtml: '', repeatRule: 'custom', taskDate,
        completed: false, propertyId: 1,
        repeatType, repeatEvery, repeatEndMode, repeatOccurrences,
        repeatUntilDate, dayOfWeek, dayOfMonth, repeatWeekdaysCsv,
      } as CalendarTaskModel;
    }

    // taskDate the fakeTask uses; UTC-March is month index 2 so yearlyOne's
    // monthFromTaskDate() reconstructs correctly.
    const TASK_DATE = '2026-03-16';

    // ----- Round-trip per kind (12) -----------------------------------------

    it('round-trip: daily (step=1)', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'day', [], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('daily');
      expect(reconstructed?.n).toBe(1);
    });

    it('round-trip: everyNd (n=4)', () => {
      const meta = service.buildMetaFromCustomConfig(4, 'day', [], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('everyNd');
      expect(reconstructed?.n).toBe(4);
    });

    // Single-weekday weekly metas (weeklyOne / everyNWeekOne) are NOT
    // round-trippable through the 'custom' branch because the save flow
    // doesn't write the weekday into RepeatWeekdaysCsv when there's only
    // one. Those rules persist via dayOfWeek + repeatType=2 and load via
    // mapRepeatType → 'weeklyOne' (built-in branch). The dedicated
    // per-built-in-rule test below covers weeklyOne from that path.

    it('round-trip: weeklyMulti (Mon+Wed+Fri)', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'week', [1, 3, 5], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('weeklyMulti');
      expect(reconstructed?.weekdays).toEqual([1, 3, 5]);
    });

    // everyNWeekOne with single weekday is the documented legacy-fallback
    // case: type=2 + step!=1 + null CSV → reconstructed as everyNWeekAll
    // (because the save flow doesn't write a single-weekday CSV). Users
    // re-save once to get a clean rule. This is intentional per spec.

    it('round-trip: everyNWeekMulti (n=3, Mon+Wed+Fri)', () => {
      const meta = service.buildMetaFromCustomConfig(3, 'week', [1, 3, 5], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('everyNWeekMulti');
      expect(reconstructed?.n).toBe(3);
      expect(reconstructed?.weekdays).toEqual([1, 3, 5]);
    });

    it('round-trip: everyNWeekAll (n=2, no weekdays)', () => {
      const meta = service.buildMetaFromCustomConfig(2, 'week', [], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      // Builder collapses empty weekdays to everyNWeekAll → reconstruction
      // for type=2 + empty CSV maps back to the same kind.
      expect(reconstructed?.kind).toBe('everyNWeekAll');
      expect(reconstructed?.n).toBe(2);
    });

    it('round-trip: weeklyAll (constructed directly — type=2, empty CSV, n=1)', () => {
      // Builder always lands on 'everyNWeekAll' for empty weekdays, so we
      // construct the meta directly to exercise the n=1 branch of
      // reconstruction's case 2 / days.length === 0 path.
      const meta: CalendarRepeatMeta = {kind: 'weeklyAll', endMode: 'never'};
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('weeklyAll');
    });

    it('round-trip: monthlyDom (step=1)', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'month', [], 'never');
      // buildMetaFromCustomConfig sets dom=1; carry that into the fake task.
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('monthlyDom');
      expect(reconstructed?.dom).toBe(1);
    });

    it('round-trip: everyNMonthDom (n=2)', () => {
      const meta = service.buildMetaFromCustomConfig(2, 'month', [], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('everyNMonthDom');
      expect(reconstructed?.n).toBe(2);
      expect(reconstructed?.dom).toBe(1);
    });

    it('round-trip: yearlyOne (step=1)', () => {
      const meta = service.buildMetaFromCustomConfig(1, 'year', [], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('yearlyOne');
      // taskDate '2026-03-16' → getUTCMonth() === 2 (March)
      expect(reconstructed?.month).toBe(2);
      expect(reconstructed?.dom).toBe(1);
    });

    it('round-trip: everyNYear (n=5)', () => {
      const meta = service.buildMetaFromCustomConfig(5, 'year', [], 'never');
      const task = fakeTaskFromMeta(meta, TASK_DATE);
      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('everyNYear');
      expect(reconstructed?.n).toBe(5);
      expect(reconstructed?.month).toBe(2);
      expect(reconstructed?.dom).toBe(1);
    });

    // ----- Per built-in rule -------------------------------------------------

    function builtInTask(partial: Partial<CalendarTaskModel>): CalendarTaskModel {
      return {
        id: 1, title: 't', startHour: 9, duration: 1, startText: '09:00',
        endText: '10:00', tags: [], assigneeIds: [], boardId: 1, color: '',
        descriptionHtml: '', taskDate: TASK_DATE, completed: false,
        propertyId: 1, repeatRule: 'none', repeatEvery: 1, repeatEndMode: 0,
        ...partial,
      } as CalendarTaskModel;
    }

    it('built-in: repeatRule="daily" reconstructs as daily', () => {
      const r = service.reconstructMetaFromTask(builtInTask({repeatRule: 'daily'}));
      expect(r?.kind).toBe('daily');
    });

    it('built-in: repeatRule="weeklyOne" with dayOfWeek=3 reconstructs as weeklyOne', () => {
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weeklyOne', dayOfWeek: 3,
      }));
      expect(r?.kind).toBe('weeklyOne');
      expect(r?.weekday).toBe(3);
    });

    it('built-in: repeatRule="weeklyAll" reconstructs as weeklyAll', () => {
      const r = service.reconstructMetaFromTask(builtInTask({repeatRule: 'weeklyAll'}));
      expect(r?.kind).toBe('weeklyAll');
    });

    it('built-in: repeatRule="monthlyDom" with dayOfMonth=15 reconstructs as monthlyDom', () => {
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'monthlyDom', dayOfMonth: 15,
      }));
      expect(r?.kind).toBe('monthlyDom');
      expect(r?.dom).toBe(15);
    });

    it('built-in: repeatRule="yearlyOne" with dayOfMonth=20 reconstructs as yearlyOne with month from taskDate', () => {
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'yearlyOne', dayOfMonth: 20, taskDate: '2026-03-16',
      }));
      expect(r?.kind).toBe('yearlyOne');
      expect(r?.dom).toBe(20);
      expect(r?.month).toBe(2); // March, 0-indexed via getUTCMonth
    });

    // ----- Edge cases — must return null ------------------------------------

    it('returns null when repeatRule === "none"', () => {
      expect(service.reconstructMetaFromTask(builtInTask({repeatRule: 'none'}))).toBeNull();
    });

    it('returns null when repeatRule is undefined', () => {
      const t = builtInTask({});
      // tsc would normally reject this — cast to any so the runtime null guard is exercised.
      (t as any).repeatRule = undefined;
      expect(service.reconstructMetaFromTask(t)).toBeNull();
    });

    it('returns null for an unknown repeatRule string', () => {
      const t = builtInTask({});
      (t as any).repeatRule = 'someUnknownString';
      expect(service.reconstructMetaFromTask(t)).toBeNull();
    });

    it('returns null when repeatRule === "weeklyOne" but dayOfWeek is null', () => {
      expect(service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weeklyOne', dayOfWeek: null,
      }))).toBeNull();
    });

    it('returns null when repeatRule === "custom" but repeatType is undefined', () => {
      const t = builtInTask({repeatRule: 'custom'});
      (t as any).repeatType = undefined;
      expect(service.reconstructMetaFromTask(t)).toBeNull();
    });

    it('returns null when repeatRule === "monthlyDom" but dayOfMonth is null', () => {
      expect(service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'monthlyDom', dayOfMonth: null,
      }))).toBeNull();
    });

    // ----- Legacy fallback: type=2 + null CSV → weeklyAll/everyNWeekAll -----

    it('legacy fallback: repeatRule="custom", repeatType=2, repeatWeekdaysCsv=null, n=1 → weeklyAll', () => {
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'custom', repeatType: 2, repeatEvery: 1,
        repeatWeekdaysCsv: null,
      }));
      expect(r?.kind).toBe('weeklyAll');
      expect(r?.n).toBe(1);
    });

    it('legacy fallback: repeatRule="custom", repeatType=2, repeatWeekdaysCsv=null, n=3 → everyNWeekAll', () => {
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'custom', repeatType: 2, repeatEvery: 3,
        repeatWeekdaysCsv: null,
      }));
      expect(r?.kind).toBe('everyNWeekAll');
      expect(r?.n).toBe(3);
    });

    // ----- Weekdays mapping (Mon-Fri) → weeklyMulti --------------------------

    it('built-in "weekdays" with n=1 → weeklyMulti with weekdays=[1,2,3,4,5]', () => {
      // 'weekdays' is not in the CalendarRepeatRule union today — cast via
      // `as any` so this future-compat path is still exercised.
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weekdays' as any, repeatEvery: 1,
      }));
      expect(r?.kind).toBe('weeklyMulti');
      expect(r?.weekdays).toEqual([1, 2, 3, 4, 5]);
    });

    it('formatCustomRepeatLabel renders explicit Mon-Fri list, not "all days"', () => {
      // Use a local TranslateService stub that performs basic {{key}}
      // interpolation so we can read meaningful text out of the formatter.
      // The base translateStub returns keys verbatim, which is fine for
      // shape-only assertions but would mask the days substitution here.
      const interpolatingStub = {
        instant: (key: string, params?: Record<string, any>) => {
          if (!params) return key;
          return Object.entries(params).reduce(
            (out, [k, v]) => out.replace(new RegExp(`{{\\s*${k}\\s*}}`, 'g'), String(v)),
            key,
          );
        },
      } as unknown as TranslateService;
      const localService = new CalendarRepeatService(interpolatingStub);

      const r = localService.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weekdays' as any, repeatEvery: 1,
      }))!;
      // en-US locale; Intl.ListFormat handles weekday-name pluralisation.
      const label = localService.formatCustomRepeatLabel(r, 'en-US');
      // Intl.ListFormat ('en-US', conjunction, long) yields "Monday, Tuesday,
      // Wednesday, Thursday, and Friday" — assert each day is present so
      // serial-comma differences across runtimes don't break the test.
      expect(label).toContain('Monday');
      expect(label).toContain('Tuesday');
      expect(label).toContain('Wednesday');
      expect(label).toContain('Thursday');
      expect(label).toContain('Friday');
      // Must NOT collapse to the all-days summary.
      expect(label).not.toContain('Weekly on all days');
    });

    // ----- weeklyOne / weeklyAll promote to multi-day when CSV present -------

    it('weeklyOne with repeatWeekdaysCsv="1,3,5" promotes to weeklyMulti', () => {
      // Production case: a multi-day weekly rule saved at step=1.
      // calendar-container.mapRepeatType(2, 1) returns 'weeklyOne' regardless
      // of CSV, so the helper must consult the CSV column to recover the
      // multi-day intent rather than degrading to a single-day rule.
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weeklyOne',
        repeatType: 2,
        repeatEvery: 1,
        repeatWeekdaysCsv: '1,3,5',
        dayOfWeek: 1,
      }));
      expect(r?.kind).toBe('weeklyMulti');
      expect(r?.weekdays).toEqual([1, 3, 5]);
      expect(r?.n).toBe(1);
    });

    it('weeklyOne with repeatWeekdaysCsv (single day) stays weeklyOne with that day', () => {
      // Edge case: CSV present with exactly one day. Should still resolve
      // through the CSV path so weekday=CSV[0], not task.dayOfWeek (which
      // could be stale from an earlier multi-day rule).
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weeklyOne',
        repeatType: 2,
        repeatEvery: 1,
        repeatWeekdaysCsv: '4',
        dayOfWeek: 1,  // intentionally different — CSV must win
      }));
      expect(r?.kind).toBe('weeklyOne');
      expect(r?.weekday).toBe(4);
    });

    it('weeklyAll with CSV promotes to weeklyMulti (Mon-Fri example)', () => {
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weeklyAll',
        repeatType: 2,
        repeatEvery: 1,
        repeatWeekdaysCsv: '1,2,3,4,5',
      }));
      expect(r?.kind).toBe('weeklyMulti');
      expect(r?.weekdays).toEqual([1, 2, 3, 4, 5]);
    });

    it('weeklyOne with no CSV (legacy single-day) reads task.dayOfWeek', () => {
      // Existing behaviour for pre-migration rows: no CSV, use the seeded
      // dayOfWeek field. Confirms the promotion is opt-in on CSV presence.
      const r = service.reconstructMetaFromTask(builtInTask({
        repeatRule: 'weeklyOne',
        repeatType: 2,
        repeatEvery: 1,
        repeatWeekdaysCsv: null,
        dayOfWeek: 3,
      }));
      expect(r?.kind).toBe('weeklyOne');
      expect(r?.weekday).toBe(3);
    });

    // ----- End-mode round-trip ---------------------------------------------

    it('end-mode "never" round-trips', () => {
      const t = builtInTask({
        repeatRule: 'daily', repeatEndMode: 0,
      });
      const r = service.reconstructMetaFromTask(t);
      expect(r?.endMode).toBe('never');
      expect(r?.afterCount).toBeUndefined();
      expect(r?.untilTs).toBeUndefined();
    });

    it('end-mode "after" with afterCount=7 round-trips', () => {
      const t = builtInTask({
        repeatRule: 'daily', repeatEndMode: 1, repeatOccurrences: 7,
      });
      const r = service.reconstructMetaFromTask(t);
      expect(r?.endMode).toBe('after');
      expect(r?.afterCount).toBe(7);
    });

    it('end-mode "until" with untilTs read from repeatUntilDate', () => {
      const ts = 12345;
      const t = builtInTask({
        repeatRule: 'daily', repeatEndMode: 2,
        repeatUntilDate: new Date(ts).toISOString(),
      });
      const r = service.reconstructMetaFromTask(t);
      expect(r?.endMode).toBe('until');
      expect(r?.untilTs).toBe(ts);
    });
  });

  // ─── metaToWeekdaysCsv ───────────────────────────────────────────────────
  // Wire-format serializer used by the modal's save flow to produce the
  // request payload's `repeatWeekdaysCsv` field. Pre-fix the modal inlined a
  // `meta.weekdays?.length ? meta.weekdays.join(',') : null` ternary, which
  // shipped `null` for single-weekday rules — those store the chosen day in
  // `meta.weekday` (singular). The server's AreaRulePlanning.DayOfWeek then
  // kept its `int` default of 0, so reopening a Tuesday-only event read
  // back as "Sunday". This suite + the regression test below pin the
  // wire-format down so that class of bug can't regress unnoticed.
  describe('metaToWeekdaysCsv', () => {
    it('null meta → null', () => {
      expect(service.metaToWeekdaysCsv(null)).toBeNull();
    });

    it('undefined meta → null', () => {
      expect(service.metaToWeekdaysCsv(undefined)).toBeNull();
    });

    it('weeklyOne with weekday=2 (Tuesday) → "2"', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 2, endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBe('2');
    });

    it('weeklyOne with weekday=0 (Sunday) → "0"', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 0, endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBe('0');
    });

    it('everyNWeekOne with weekday=5 (Friday) → "5"', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNWeekOne', weekday: 5, endMode: 'never', n: 3};
      expect(service.metaToWeekdaysCsv(meta)).toBe('5');
    });

    it('weeklyMulti with weekdays=[1,3,5] → "1,3,5"', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyMulti', weekdays: [1, 3, 5], endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBe('1,3,5');
    });

    it('everyNWeekMulti with weekdays=[0,6] → "0,6"', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNWeekMulti', weekdays: [0, 6], endMode: 'never', n: 2};
      expect(service.metaToWeekdaysCsv(meta)).toBe('0,6');
    });

    it('weeklyOne with no weekday → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBeNull();
    });

    it('non-weekly: monthlyDom → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 15, endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBeNull();
    });

    it('non-weekly: daily → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'daily', endMode: 'never'};
      expect(service.metaToWeekdaysCsv(meta)).toBeNull();
    });

    it('non-weekly: yearlyOne → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'yearlyOne', dom: 1, month: 0, endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBeNull();
    });

    it('weeklyMulti where weekdays=[] (empty) → null (no plural shape)', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyMulti', weekdays: [], endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBeNull();
    });

    it('everyNWeekAll (no weekday list) → full 7-day CSV (#922)', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNWeekAll', endMode: 'never', n: 2};
      expect(service.metaToWeekdaysCsv(meta)).toBe('0,1,2,3,4,5,6');
    });

    it('weeklyAll (no weekday list) → full 7-day CSV (#922)', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyAll', endMode: 'never', n: 1};
      expect(service.metaToWeekdaysCsv(meta)).toBe('0,1,2,3,4,5,6');
    });
  });

  // ─── metaToDayOfMonth ────────────────────────────────────────────────────
  // Wire-format serializer for the request payload's `dayOfMonth` field.
  // Pre-fix the modal didn't ship this field, the request model had no
  // DayOfMonth property, and AreaRulePlanning.DayOfMonth defaulted to its
  // int 0 — so "Månedlig på dag 21" read back as "dag 0". This suite pins
  // the wire-format down and the regression test below catches a future
  // regression even if the round-trip mocking accidentally hides it.
  describe('metaToDayOfMonth', () => {
    it('null meta → null', () => {
      expect(service.metaToDayOfMonth(null)).toBeNull();
    });

    it('undefined meta → null', () => {
      expect(service.metaToDayOfMonth(undefined)).toBeNull();
    });

    it('monthlyDom with dom=21 → 21', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 21, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBe(21);
    });

    it('monthlyDom with dom=1 → 1', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 1, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBe(1);
    });

    it('monthlyDom with dom=31 → 31', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 31, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBe(31);
    });

    it('everyNMonthDom with dom=15, n=2 → 15', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNMonthDom', dom: 15, endMode: 'never', n: 2};
      expect(service.metaToDayOfMonth(meta)).toBe(15);
    });

    it('yearlyOne carries dom for the picked day → 25', () => {
      const meta: CalendarRepeatMeta = {kind: 'yearlyOne', dom: 25, month: 11, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBe(25);
    });

    it('everyNYear carries dom too → 10', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNYear', dom: 10, month: 5, endMode: 'never', n: 3};
      expect(service.metaToDayOfMonth(meta)).toBe(10);
    });

    it('monthlyDom with no dom (undefined) → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('monthlyDom with dom=0 → null (would render "day 0")', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 0, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('monthlyDom with dom=32 → null (out of range)', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 32, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('monthlyDom with dom=-5 → null (negative)', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: -5, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('non-DOM kind: daily → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'daily', endMode: 'never'};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('non-DOM kind: weeklyOne → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 2, endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('non-DOM kind: weeklyMulti → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyMulti', weekdays: [1, 3, 5], endMode: 'never', n: 1};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });

    it('non-DOM kind: everyNd → null', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNd', endMode: 'never', n: 3};
      expect(service.metaToDayOfMonth(meta)).toBeNull();
    });
  });

  // Regression test for the "Månedlig på dag 0" bug:
  // build a monthlyDom rule for day 21 via the same path the modal uses,
  // serialise via metaToDayOfMonth, then feed the resulting payload back
  // into reconstructMetaFromTask. The dom must come back as 21, not 0.
  // Pre-fix the helper didn't exist, the request model had no DayOfMonth
  // field, the backend defaulted DayOfMonth to 0 on save, and the
  // reconstruction read back 0 → label "Månedlig på dag 0".
  //
  // Coverage gap acknowledged: this test calls `metaToDayOfMonth` directly,
  // so if the modal's onSave were refactored to stop calling the helper or
  // to ship `null` unconditionally, this spec would still pass while the
  // user-visible bug returned. A modal-component test of the emitted
  // payload would close that gap; tracked as a follow-up.
  describe('monthly day-21 round-trip (regression)', () => {
    it('monthlyDom dom=21 survives metaToDayOfMonth → reconstructMetaFromTask', () => {
      // 1. Build the meta the way buildMetaFromCustomConfig would. The
      //    "Månedligt på dag 21" option in buildRepeatSelectOptions feeds
      //    monthlyDom + dom=21 directly; the custom modal builds month-
      //    unit metas through buildMetaFromCustomConfig which sets
      //    dom: 1 by default — both paths funnel through this helper.
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 21, endMode: 'never', n: 1};

      // 2. Modal's save path now flows through this helper.
      const dayOfMonth = service.metaToDayOfMonth(meta);
      expect(dayOfMonth).toBe(21);

      // 3. Simulate the backend response: DayOfMonth is now persisted
      //    correctly (after the request-model + write-path fixes).
      //    Reconstruction reads it back as 21, not 0.
      const task: CalendarTaskModel = {
        id: 1, title: 't', startHour: 9, duration: 1, startText: '09:00',
        endText: '10:00', tags: [], assigneeIds: [], boardId: 1, color: '',
        descriptionHtml: '', taskDate: '2026-05-21', completed: false,
        propertyId: 1, repeatRule: 'monthlyDom', repeatEvery: 1, repeatEndMode: 0,
        dayOfMonth: dayOfMonth ?? 0,
      } as CalendarTaskModel;

      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('monthlyDom');
      expect(reconstructed?.dom).toBe(21);
    });
  });

  // Regression test for the "Ugentligt hver søndag" bug:
  // build a single-weekday Tuesday rule via the same path the modal uses,
  // serialise via metaToWeekdaysCsv, then feed the resulting payload back
  // into reconstructMetaFromTask while simulating the backend's broken
  // DayOfWeek = 0 default. The CSV must win and the weekday must come back
  // as Tuesday (2), not Sunday (0). Pre-fix this would have failed because
  // the modal serialised the same meta as `null` and the dayOfWeek=0
  // fallback rewrote it to Sunday.
  describe('custom-repeat Tuesday round-trip (regression)', () => {
    it('weeklyOne Tuesday survives metaToWeekdaysCsv → reconstructMetaFromTask even when dayOfWeek is the server default 0', () => {
      // 1. Build the meta the way buildMetaFromCustomConfig would for
      //    "Tilpasset" → "Gentag på" T (Tuesday) → step 1 → no end.
      const meta = service.buildMetaFromCustomConfig(1, 'week', [2], 'never');
      expect(meta.kind).toBe('weeklyOne');
      expect(meta.weekday).toBe(2);

      // 2. Modal's save path now flows through this helper.
      const csv = service.metaToWeekdaysCsv(meta);
      expect(csv).toBe('2');

      // 3. Simulate the backend response: CSV is persisted correctly, but
      //    arp.DayOfWeek defaults to 0 because Create/Update don't write
      //    it. The reconstruction must prefer the CSV. (Use csv directly —
      //    the field's type accepts string | null, and we want the fixture
      //    to surface a string-vs-null mismatch if the helper ever regresses
      //    to null for this kind.)
      const task: CalendarTaskModel = {
        id: 1, title: 't', startHour: 9, duration: 1, startText: '09:00',
        endText: '10:00', tags: [], assigneeIds: [], boardId: 1, color: '',
        descriptionHtml: '', taskDate: '2026-05-19', completed: false,
        propertyId: 1, repeatRule: 'weeklyOne', repeatEvery: 1, repeatEndMode: 0,
        repeatWeekdaysCsv: csv, dayOfWeek: 0,
      } as CalendarTaskModel;

      const reconstructed = service.reconstructMetaFromTask(task);
      expect(reconstructed?.kind).toBe('weeklyOne');
      expect(reconstructed?.weekday).toBe(2);
    });
  });

  // ─── reanchorMetaToDate ────────────────────────────────────────────────────
  // When the edit-modal date changes, the "Gentag" rule must follow the new
  // date for single-anchor kinds (the start date IS the anchor). #960.

  describe('reanchorMetaToDate', () => {
    // JS getDay(): Sun=0, Mon=1, ... Thu=4, Fri=5.
    const THU = new Date(2026, 6, 2);  // 1st Thursday of July 2026 (getDate=2)

    it('monthlyByDay: 1st Friday → 1st Thursday (the exact reported case)', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyByDay', ordinalWeek: 1, weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out.kind).toBe('monthlyByDay');
      expect(out.weekday).toBe(4);
      expect(out.ordinalWeek).toBe(1);
    });

    it('monthlyByDay: a 3rd-week date yields ordinalWeek 3', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyByDay', ordinalWeek: 1, weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, new Date(2026, 6, 15));  // 15th
      expect(out.ordinalWeek).toBe(3);
      expect(out.weekday).toBe(new Date(2026, 6, 15).getDay());
    });

    it('monthlyByDay: the 29th yields ordinalWeek 5 (boundary)', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyByDay', ordinalWeek: 1, weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, new Date(2026, 6, 29));  // 29th
      expect(out.ordinalWeek).toBe(5);
    });

    it('everyNMonthByDay: re-anchors while preserving interval n', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNMonthByDay', n: 3, ordinalWeek: 1, weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out.kind).toBe('everyNMonthByDay');
      expect(out.n).toBe(3);
      expect(out.weekday).toBe(4);
      expect(out.ordinalWeek).toBe(1);
    });

    it('weeklyOne: Friday → Thursday', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyOne', weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out.kind).toBe('weeklyOne');
      expect(out.weekday).toBe(4);
    });

    it('everyNWeekOne: re-anchors weekday, preserving n', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNWeekOne', n: 2, weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out.weekday).toBe(4);
      expect(out.n).toBe(2);
    });

    it('monthlyDom: day 15 → day 20', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyDom', dom: 15, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, new Date(2026, 6, 20));
      expect(out.kind).toBe('monthlyDom');
      expect(out.dom).toBe(20);
    });

    it('everyNMonthDom: re-anchors dom, preserving n', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNMonthDom', n: 2, dom: 15, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, new Date(2026, 6, 20));
      expect(out.dom).toBe(20);
      expect(out.n).toBe(2);
    });

    it('yearlyOne: re-anchors both month and day-of-month', () => {
      const meta: CalendarRepeatMeta = {kind: 'yearlyOne', month: 0, dom: 1, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);  // July (month 6), day 2
      expect(out.kind).toBe('yearlyOne');
      expect(out.month).toBe(6);
      expect(out.dom).toBe(2);
    });

    it('everyNYear: re-anchors month+dom, preserving n', () => {
      const meta: CalendarRepeatMeta = {kind: 'everyNYear', n: 2, month: 0, dom: 1, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out.month).toBe(6);
      expect(out.dom).toBe(2);
      expect(out.n).toBe(2);
    });

    it('preserves endMode/afterCount/untilTs (non-anchor fields)', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyByDay', ordinalWeek: 1, weekday: 5, endMode: 'after', afterCount: 7};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out.endMode).toBe('after');
      expect(out.afterCount).toBe(7);
    });

    it('multi-weekday weekly sets are returned unchanged (no single anchor)', () => {
      const meta: CalendarRepeatMeta = {kind: 'weeklyMulti', weekdays: [1, 3, 5], endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      expect(out).toEqual(meta);
    });

    it('daily / everyNd / alwaysRepeat-style kinds are returned unchanged', () => {
      const daily: CalendarRepeatMeta = {kind: 'daily', endMode: 'never'};
      expect(service.reanchorMetaToDate(daily, THU)).toEqual(daily);
      const everyNd: CalendarRepeatMeta = {kind: 'everyNd', n: 3, endMode: 'never'};
      expect(service.reanchorMetaToDate(everyNd, THU)).toEqual(everyNd);
      const weeklyAll: CalendarRepeatMeta = {kind: 'weeklyAll', endMode: 'never'};
      expect(service.reanchorMetaToDate(weeklyAll, THU)).toEqual(weeklyAll);
    });

    it('does not mutate the input meta', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyByDay', ordinalWeek: 1, weekday: 5, endMode: 'never'};
      service.reanchorMetaToDate(meta, THU);
      expect(meta.weekday).toBe(5);
      expect(meta.ordinalWeek).toBe(1);
    });

    it('round-trip: re-anchored meta drives buildRepeatSelectOptions customCurrent', () => {
      const meta: CalendarRepeatMeta = {kind: 'monthlyByDay', ordinalWeek: 1, weekday: 5, endMode: 'never'};
      const out = service.reanchorMetaToDate(meta, THU);
      const opts = service.buildRepeatSelectOptions(THU, out);
      const current = opts.find(o => o.value === 'customCurrent');
      expect(current?.meta?.weekday).toBe(4);
      expect(current?.meta?.ordinalWeek).toBe(1);
    });
  });
});

// ── New monthly kinds + dom fix ───────────────────────────────────────────────

describe('CalendarRepeatService — monthly kinds', () => {
  let service: CalendarRepeatService;

  beforeEach(() => {
    service = new CalendarRepeatService(translateStub);
  });

  // ── buildMetaFromCustomConfig ──────────────────────────────────────────────

  it('buildMeta: everyNMonthDom step=1 sets kind=monthlyDom and correct dom', () => {
    const meta = service.buildMetaFromCustomConfig(
      1, 'month', [], 'never', undefined, undefined, undefined,
      'everyNMonthDom', 15, undefined,
    );
    expect(meta.kind).toBe('monthlyDom');
    expect(meta.dom).toBe(15);
  });

  it('buildMeta: everyNMonthDom step=2 sets kind=everyNMonthDom and n=2', () => {
    const meta = service.buildMetaFromCustomConfig(
      2, 'month', [], 'never', undefined, undefined, undefined,
      'everyNMonthDom', 28, undefined,
    );
    expect(meta.kind).toBe('everyNMonthDom');
    expect(meta.n).toBe(2);
    expect(meta.dom).toBe(28);
  });

  it('buildMeta: monthlyFirstWeekday step=1 sets kind, ordinalWeek=1, weekday', () => {
    const meta = service.buildMetaFromCustomConfig(
      1, 'month', [], 'never', undefined, undefined, undefined,
      'monthlyFirstWeekday', undefined, 3,
    );
    expect(meta.kind).toBe('monthlyFirstWeekday');
    expect(meta.ordinalWeek).toBe(1);
    expect(meta.weekday).toBe(3);
  });

  it('buildMeta: monthlyFirstWeekday step=2 sets kind=everyNMonthFirstWeekday', () => {
    const meta = service.buildMetaFromCustomConfig(
      2, 'month', [], 'never', undefined, undefined, undefined,
      'monthlyFirstWeekday', undefined, 5,
    );
    expect(meta.kind).toBe('everyNMonthFirstWeekday');
    expect(meta.n).toBe(2);
    expect(meta.ordinalWeek).toBe(1);
    expect(meta.weekday).toBe(5);
  });

  it('buildMeta: monthly with no monthlyKind defaults to DOM kind', () => {
    const meta = service.buildMetaFromCustomConfig(
      1, 'month', [], 'never', undefined, undefined, undefined,
      undefined, 10, undefined,
    );
    expect(meta.kind).toBe('monthlyDom');
    expect(meta.dom).toBe(10);
  });

  // ── decomposeCustomMeta ───────────────────────────────────────────────────

  it('decompose: monthlyDom returns monthlyKind=everyNMonthDom and dom', () => {
    const decomposed = service.decomposeCustomMeta({
      kind: 'monthlyDom', dom: 20, endMode: 'never',
    });
    expect(decomposed.unit).toBe('month');
    expect(decomposed.step).toBe(1);
    expect(decomposed.monthlyKind).toBe('everyNMonthDom');
    expect(decomposed.dom).toBe(20);
  });

  it('decompose: everyNMonthDom returns correct step and dom', () => {
    const decomposed = service.decomposeCustomMeta({
      kind: 'everyNMonthDom', n: 3, dom: 7, endMode: 'never',
    });
    expect(decomposed.step).toBe(3);
    expect(decomposed.monthlyKind).toBe('everyNMonthDom');
    expect(decomposed.dom).toBe(7);
  });

  it('decompose: monthlyFirstWeekday returns monthlyKind and weekday', () => {
    const decomposed = service.decomposeCustomMeta({
      kind: 'monthlyFirstWeekday', ordinalWeek: 1, weekday: 2, endMode: 'never',
    });
    expect(decomposed.unit).toBe('month');
    expect(decomposed.monthlyKind).toBe('monthlyFirstWeekday');
    expect(decomposed.monthlyWeekday).toBe(2);
  });

  it('decompose: everyNMonthFirstWeekday returns correct step and weekday', () => {
    const decomposed = service.decomposeCustomMeta({
      kind: 'everyNMonthFirstWeekday', n: 2, ordinalWeek: 1, weekday: 4, endMode: 'never',
    });
    expect(decomposed.step).toBe(2);
    expect(decomposed.monthlyKind).toBe('monthlyFirstWeekday');
    expect(decomposed.monthlyWeekday).toBe(4);
  });

  // ── round-trip ────────────────────────────────────────────────────────────

  it('round-trip: everyNMonthDom dom=15', () => {
    const meta = service.buildMetaFromCustomConfig(
      1, 'month', [], 'never', undefined, undefined, undefined,
      'everyNMonthDom', 15, undefined,
    );
    const back = service.decomposeCustomMeta(meta);
    expect(back.monthlyKind).toBe('everyNMonthDom');
    expect(back.dom).toBe(15);
  });

  it('round-trip: monthlyFirstWeekday weekday=1 (Monday)', () => {
    const meta = service.buildMetaFromCustomConfig(
      1, 'month', [], 'never', undefined, undefined, undefined,
      'monthlyFirstWeekday', undefined, 1,
    );
    const back = service.decomposeCustomMeta(meta);
    expect(back.monthlyKind).toBe('monthlyFirstWeekday');
    expect(back.monthlyWeekday).toBe(1);
  });
});
