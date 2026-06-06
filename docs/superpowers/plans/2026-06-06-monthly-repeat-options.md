# Monthly Repeat Sub-Type Options — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Gentagelsestype" row to `custom-repeat-modal` that lets users choose between "Månedligt dag N" (day-of-month, 1–28) and "Månedligt på den første [ugedag]" (first weekday of month) when unit = Måned.

**Architecture:** All changes are Angular-only. The backend `EnumerateOccurrences` already handles both monthly patterns via `RepeatOrdinalWeek` + `DayOfWeek` (first-weekday path) and `DayOfMonth` (DOM path). The Angular repeat service gains two new `kind` values (`monthlyFirstWeekday` / `everyNMonthFirstWeekday`) and the `buildMetaFromCustomConfig` monthly-branch is fixed (it currently hardcodes `dom: 1`). The modal component gets three new state properties wired to a new conditional template row.

**Tech Stack:** Angular 17+, `mtx-select` (MtxSelect), `@ngx-translate/core`, Jasmine/Karma unit tests, `mat-form-field` / `mat-radio-group`.

---

## File Map

| Action | File |
|--------|------|
| Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.ts` |
| Create/Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.spec.ts` |
| Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/modals/custom-repeat-modal/custom-repeat-modal.component.ts` |
| Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/modals/custom-repeat-modal/custom-repeat-modal.component.html` |
| Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/translates.ts` |
| Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/da.ts` |
| Modify | `eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/enUS.ts` |

**Base path for all files:** `/home/rene/Documents/workspace/microting/eform-angular-frontend/`

---

## Task 1: Extend `calendar-repeat.service.ts` — new kinds + fix `dom: 1` hardcode

**Files:**
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.ts` (lines 495–568, 825–862)
- Create/Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.spec.ts`

### Background

`buildMetaFromCustomConfig` currently produces `dom: 1` for every monthly rule (line ~854). This is wrong — tasks always land on the 1st of every month regardless of what the user picks. We fix this while adding the new `monthlyFirstWeekday` kind.

`CalendarRepeatMeta` already has `ordinalWeek?: number` (not `repeatOrdinalWeek` — note the difference from the spec's DB column name). Use `ordinalWeek` in the Angular meta object.

- [ ] **Step 1: Write failing tests**

Check whether a spec file already exists:
```bash
ls eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.spec.ts 2>/dev/null && echo exists || echo missing
```

If missing, create it. If existing, append the describe block. The tests below must be added:

```typescript
// calendar-repeat.service.spec.ts
import {TestBed} from '@angular/core/testing';
import {CalendarRepeatService} from './calendar-repeat.service';

describe('CalendarRepeatService — monthly kinds', () => {
  let service: CalendarRepeatService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [CalendarRepeatService]});
    service = TestBed.inject(CalendarRepeatService);
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
```

- [ ] **Step 2: Run tests — confirm all 11 tests FAIL**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client
ng test --include='**/calendar-repeat.service.spec.ts' --watch=false --browsers=ChromeHeadless
```

Expected: all 11 new tests fail (methods don't accept new params yet / return wrong values).

- [ ] **Step 3: Update `buildMetaFromCustomConfig` — signature and monthly branch**

In `calendar-repeat.service.ts`, change the method signature (around line 826) and the `unit === 'month'` branch (around line 852):

**Signature** — add three optional params after `date`:
```typescript
buildMetaFromCustomConfig(
  step: number,
  unit: string,
  weekdays: number[],
  endMode: 'never' | 'after' | 'until',
  afterCount?: number,
  untilTs?: number,
  date?: Date,
  monthlyKind?: 'everyNMonthDom' | 'monthlyFirstWeekday',
  dom?: number,
  monthlyWeekday?: number,
): CalendarRepeatMeta {
```

**Monthly branch** — replace the existing `} else if (unit === 'month') {` block with:
```typescript
} else if (unit === 'month') {
  if (monthlyKind === 'monthlyFirstWeekday') {
    const wd = monthlyWeekday ?? (date ? date.getDay() : 1);
    return {
      ...base,
      kind: step === 1 ? 'monthlyFirstWeekday' : 'everyNMonthFirstWeekday',
      ordinalWeek: 1,
      weekday: wd,
    } as CalendarRepeatMeta;
  } else {
    return {
      ...base,
      kind: step === 1 ? 'monthlyDom' : 'everyNMonthDom',
      dom: dom ?? 1,
    } as CalendarRepeatMeta;
  }
}
```

- [ ] **Step 4: Update `decomposeCustomMeta` — return type and switch cases**

**Return type** — add three fields to the inline return type (around line 496):
```typescript
decomposeCustomMeta(meta: CalendarRepeatMeta): {
  step: number;
  unit: 'day' | 'week' | 'month' | 'year';
  weekdays: number[];
  endMode: 'never' | 'after' | 'until';
  afterCount?: number;
  untilTs?: number;
  dom?: number;
  monthlyKind?: 'everyNMonthDom' | 'monthlyFirstWeekday';
  monthlyWeekday?: number;
} {
```

**Local variable declarations** — add after the existing `let weekdays` line:
```typescript
let dom: number | undefined;
let monthlyKind: 'everyNMonthDom' | 'monthlyFirstWeekday' | undefined;
let monthlyWeekday: number | undefined;
```

**Replace** the existing four monthly cases with:
```typescript
case 'monthlyDom':
  step = 1; unit = 'month'; weekdays = [];
  dom = meta.dom ?? 1; monthlyKind = 'everyNMonthDom';
  break;
case 'everyNMonthDom':
  step = meta.n ?? 1; unit = 'month'; weekdays = [];
  dom = meta.dom ?? 1; monthlyKind = 'everyNMonthDom';
  break;
case 'monthlyByDay':
  step = 1; unit = 'month'; weekdays = [];
  dom = meta.dom ?? 1; monthlyKind = 'everyNMonthDom';
  break;
case 'everyNMonthByDay':
  step = meta.n ?? 1; unit = 'month'; weekdays = [];
  dom = meta.dom ?? 1; monthlyKind = 'everyNMonthDom';
  break;
case 'monthlyFirstWeekday':
  step = 1; unit = 'month'; weekdays = [];
  monthlyKind = 'monthlyFirstWeekday'; monthlyWeekday = meta.weekday;
  break;
case 'everyNMonthFirstWeekday':
  step = meta.n ?? 1; unit = 'month'; weekdays = [];
  monthlyKind = 'monthlyFirstWeekday'; monthlyWeekday = meta.weekday;
  break;
```

**Return statement** — add the three new fields to the existing `return` at the bottom of the method:
```typescript
return {
  step,
  unit,
  weekdays,
  endMode: meta.endMode ?? 'never',
  afterCount: meta.afterCount,
  untilTs: meta.untilTs,
  dom,
  monthlyKind,
  monthlyWeekday,
};
```

- [ ] **Step 5: Run tests — confirm all 11 pass**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client
ng test --include='**/calendar-repeat.service.spec.ts' --watch=false --browsers=ChromeHeadless
```

Expected: 11 new tests PASS. If any fail, read the error and fix before continuing.

- [ ] **Step 6: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.ts
git add eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/services/calendar-repeat.service.spec.ts
git commit -m "feat(calendar): add monthlyFirstWeekday kind + fix dom:1 hardcode in repeat service"
```

---

## Task 2: Update `custom-repeat-modal.component.ts`

**Files:**
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/modals/custom-repeat-modal/custom-repeat-modal.component.ts`

- [ ] **Step 1: Add new state properties**

After the existing `showMiniPicker = false;` line (line 31), add:

```typescript
monthlyKind: 'everyNMonthDom' | 'monthlyFirstWeekday' = 'everyNMonthDom';
monthlyDom = 1;
monthlyWeekday = 1;

readonly monthlyDomOptions: {value: number; label: string}[] =
  Array.from({length: 28}, (_, i) => ({value: i + 1, label: String(i + 1)}));

monthlyKindOptions: {value: string; label: string}[] = [];
monthlyWeekdayOptions: {value: number; label: string}[] = [];
```

- [ ] **Step 2: Populate `monthlyKindOptions` and `monthlyWeekdayOptions` in `ngOnInit`**

Add at the **end** of the `ngOnInit` body (before the closing `}`), after the existing `this.weekdays = [...]` block:

```typescript
this.monthlyKindOptions = [
  {value: 'everyNMonthDom', label: this.translate.instant('Monthly day')},
  {value: 'monthlyFirstWeekday', label: this.translate.instant('Monthly on the first')},
];

// Generate full weekday names in the current locale (Mon=1 … Sun=0, order Mon–Sun).
this.monthlyWeekdayOptions = [1, 2, 3, 4, 5, 6, 0].map(v => {
  // Jan 6 2025 = Monday; offsets give Mon(1)..Sat(6) at Jan 6-11, Sun(0) at Jan 12.
  const d = new Date(2025, 0, v === 0 ? 12 : 5 + v);
  const name = d.toLocaleDateString(getCurrentLocale(this.translate), {weekday: 'long'});
  return {value: v, label: name.charAt(0).toUpperCase() + name.slice(1)};
});
```

- [ ] **Step 3: Seed monthly defaults for fresh open and hydrate from existing meta**

In the **fresh open** branch (the `else` block at line 89):

```typescript
} else {
  // Pre-select the weekday matching the task date.
  const wdVal = this.data.date.getDay();
  const circle = this.weekdays.find(w => w.value === wdVal);
  if (circle) circle.active = true;

  // Seed monthly defaults from start date.
  this.monthlyDom = Math.min(this.data.date.getDate(), 28);
  this.monthlyWeekday = this.data.date.getDay();
}
```

In the **hydration** branch (inside `if (this.data.meta)`), after the existing `if (decomposed.untilTs != null)` block:

```typescript
if (decomposed.monthlyKind) {
  this.monthlyKind = decomposed.monthlyKind;
}
if (decomposed.dom != null) {
  this.monthlyDom = decomposed.dom;
}
if (decomposed.monthlyWeekday != null) {
  this.monthlyWeekday = decomposed.monthlyWeekday;
}
```

- [ ] **Step 4: Add `onUnitChange` method to reset monthly state when leaving Måned**

Add after the existing `toggleWeekday` method:

```typescript
onUnitChange(val: 'day' | 'week' | 'month' | 'year') {
  this.unit = val;
  if (val !== 'month') {
    this.monthlyKind = 'everyNMonthDom';
    this.monthlyDom = Math.min(this.data.date.getDate(), 28);
    this.monthlyWeekday = this.data.date.getDay();
  }
}
```

- [ ] **Step 5: Pass monthly params in `onConfirm()`**

Replace the existing `this.repeatService.buildMetaFromCustomConfig(...)` call in `onConfirm()` with:

```typescript
const meta: CalendarRepeatMeta = this.repeatService.buildMetaFromCustomConfig(
  this.step,
  this.unit,
  this.activeWeekdays,
  this.endMode,
  this.endMode === 'after' ? this.afterCount : undefined,
  untilTs,
  this.data.date,
  this.unit === 'month' ? this.monthlyKind : undefined,
  this.unit === 'month' ? this.monthlyDom : undefined,
  this.unit === 'month' ? this.monthlyWeekday : undefined,
);
```

- [ ] **Step 6: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/modals/custom-repeat-modal/custom-repeat-modal.component.ts
git commit -m "feat(calendar): add monthly sub-type state + hydration to custom-repeat-modal"
```

---

## Task 3: Update `custom-repeat-modal.component.html`

**Files:**
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/modals/custom-repeat-modal/custom-repeat-modal.component.html`

- [ ] **Step 1: Wire `onUnitChange` to the unit select and add the new monthly row**

**Change 1:** In the existing `repeat-every-row`, find the unit `<mtx-select>` and change `[(ngModel)]="unit"` to use the change handler:

```html
<!-- BEFORE -->
<mtx-select
  [(ngModel)]="unit"
  ...
></mtx-select>

<!-- AFTER -->
<mtx-select
  [ngModel]="unit"
  (ngModelChange)="onUnitChange($event)"
  [items]="unitOptions"
  bindValue="value"
  bindLabel="label"
  [clearable]="false"
  [searchable]="false"
></mtx-select>
```

**Change 2:** After the closing `</div>` of `repeat-every-row` (line 21) and before the `weekday-row` div (line 24), insert the new monthly row:

```html
<!-- Monthly sub-type row (visible when unit = month) -->
<div class="monthly-kind-row" *ngIf="unit === 'month'">
  <mat-form-field class="monthly-kind-select" appearance="outline">
    <mtx-select
      [(ngModel)]="monthlyKind"
      [items]="monthlyKindOptions"
      bindValue="value"
      bindLabel="label"
      [clearable]="false"
      [searchable]="false"
    ></mtx-select>
  </mat-form-field>
  <mat-form-field class="monthly-dom-select" appearance="outline"
                  *ngIf="monthlyKind === 'everyNMonthDom'">
    <mtx-select
      [(ngModel)]="monthlyDom"
      [items]="monthlyDomOptions"
      bindValue="value"
      bindLabel="label"
      [clearable]="false"
      [searchable]="false"
    ></mtx-select>
  </mat-form-field>
  <mat-form-field class="monthly-weekday-select" appearance="outline"
                  *ngIf="monthlyKind === 'monthlyFirstWeekday'">
    <mtx-select
      [(ngModel)]="monthlyWeekday"
      [items]="monthlyWeekdayOptions"
      bindValue="value"
      bindLabel="label"
      [clearable]="false"
      [searchable]="false"
    ></mtx-select>
  </mat-form-field>
</div>
```

- [ ] **Step 2: Compile check**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend/eform-client
npx ng build --configuration=development 2>&1 | grep -E 'error|ERROR' | head -20
```

Expected: no errors. If you see `NG0100` or template errors, fix them before continuing.

- [ ] **Step 3: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/modals/custom-repeat-modal/custom-repeat-modal.component.html
git commit -m "feat(calendar): add monthly sub-type row to custom-repeat-modal template"
```

---

## Task 4: Add i18n keys

**Files:**
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/translates.ts`
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/da.ts`
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/enUS.ts`

Each file is a TypeScript object export. Find the section near the existing `'Repeat every'` / `'Repeat Type'` keys and add the two new entries.

- [ ] **Step 1: Add keys to `translates.ts`** (the base/reference file — English values)

Find the line containing `'Repeat every': 'Repeat every'` (or similar) and add after it:

```typescript
'Monthly day': 'Monthly day',
'Monthly on the first': 'Monthly on the first',
```

- [ ] **Step 2: Add keys to `da.ts`** (Danish)

Find the line containing `'Repeat every': 'Gentagelsesfrekvens'` (line 45) and add after it:

```typescript
'Monthly day': 'Månedligt dag',
'Monthly on the first': 'Månedligt på den første',
```

- [ ] **Step 3: Add keys to `enUS.ts`** (English US)

Find the equivalent `'Repeat every'` entry and add after it:

```typescript
'Monthly day': 'Monthly day',
'Monthly on the first': 'Monthly on the first',
```

- [ ] **Step 4: Commit**

```bash
cd /home/rene/Documents/workspace/microting/eform-angular-frontend
git add eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/translates.ts
git add eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/da.ts
git add eform-client/src/app/plugins/modules/backend-configuration-pn/i18n/enUS.ts
git commit -m "feat(calendar): add i18n keys for monthly repeat sub-type options"
```

---

## Task 5: Backend verification (read-only — no code change expected)

**Files:**
- Read: `eform-backendconfiguration-plugin/.../BackendConfigurationCalendarService.cs` lines 3071–3110

- [ ] **Step 1: Confirm `RepeatOrdinalWeek=1` produces "first weekday of month"**

Read lines 3071–3110 of `BackendConfigurationCalendarService.cs`. Verify:
1. The `if (repeatOrdinalWeek.HasValue)` branch calls `NthWeekdayOfMonth(year, month, ordinal, targetDow)` where `ordinal = repeatOrdinalWeek.Value` (so `1` = first occurrence).
2. `targetDow` = `dayOfWeekOverride ?? (int)startDate.DayOfWeek` — the weekday we store in `DayOfWeek`.
3. `NthWeekdayOfMonth` with `ordinal=1` returns the first matching weekday in the month.

This was confirmed during design (the code was read). No code change needed if the logic matches. If for any reason `NthWeekdayOfMonth(year, month, 1, dow)` returns something other than the first matching weekday, file a separate bug — out of scope here.

- [ ] **Step 2: Confirm `DayOfMonth` is stored for option 1**

In `BackendConfigurationCalendarService.CreateTask()` (around line 1051), verify `DayOfMonth` is persisted from `CalendarTaskCreateRequestModel.DayOfMonth`. No code change needed.

---

## Task 6: Manual smoke verification

Prerequisites: backend running on `:5000`/`:5001`, Angular dev server on `:4200`, logged in as `rm@microting.com` / `secretpassword123!`.

- [ ] **Step 1: Open calendar and create a task with Måned + "Månedligt dag"**

1. Navigate to `http://localhost:4200/plugins/backend-configuration-pn/calendar`
2. Click a time slot to create a new task
3. Set "Gentag" → "Gentag tilpasset"
4. In the custom repeat modal: set Gentagelsesfrekvens=1, unit=Måned
5. Verify the new "Gentagelsestype" row appears
6. Select "Månedligt dag", pick day **10**
7. Save. Confirm the task recurs on the 10th of subsequent months in the calendar view.

- [ ] **Step 2: Create a task with "Månedligt på den første Mandag"**

1. Repeat steps 1–4 above
2. Select "Månedligt på den første", confirm the weekday picker shows the start date's weekday pre-selected
3. Change the weekday to **Mandag** (Monday) if not already
4. Save. Confirm the task recurs on the first Monday of each month.

- [ ] **Step 3: Edit an existing monthly task of each kind**

1. Click on one of the tasks created above → Edit
2. Open custom repeat modal → verify both pickers correctly pre-fill from the saved meta (not reset to defaults)
3. Repeat for the other kind.

- [ ] **Step 4: Switch unit away and back**

1. Open custom repeat modal with unit=Måned and sub-type set
2. Switch unit to "Uge", then back to "Måned"
3. Confirm sub-type picker resets to defaults (day 1 of month / start-date weekday)
