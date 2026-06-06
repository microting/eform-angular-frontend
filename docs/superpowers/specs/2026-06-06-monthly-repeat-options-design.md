# Monthly Repeat Sub-Type Options

**Date:** 2026-06-06  
**Feature:** Add monthly repeat sub-type dropdown to the custom-repeat-modal  
**Scope:** Angular frontend (primary) + backend verification  

---

## Context

When creating a task with `Gentag_tilpasset` (custom repeat) and selecting `Gentagelsesfrekvens = 1` and unit `Måned`, there is currently no way to distinguish between two common monthly recurrence patterns:

1. Repeat on the same calendar day each month (e.g. every month on the 15th)
2. Repeat on the first occurrence of a specific weekday each month (e.g. every month on the first Monday)

Both patterns are fully supported by the existing backend (`EnumerateOccurrences`) and the DB schema (`AreaRulePlanning.DayOfMonth`, `.DayOfWeek`, `.RepeatOrdinalWeek`) — the gap is purely in the Angular UI.

---

## User-Facing Behaviour

When `Måned` is selected as the repeat unit in the custom-repeat-modal, a new **Gentagelsestype** row appears below the frequency row. It contains:

### Primary dropdown
Two options:
- `Månedligt dag` — repeat every month on a specific calendar day
- `Månedligt på den første` — repeat every month on the first occurrence of a specific weekday

### Secondary picker (changes based on primary selection)

**When "Månedligt dag" is selected:**  
A day-number `<select>` with values 1–28 (capped at 28 to be safe for all months including February). The user chooses any day; no auto-derivation from start date.

**When "Månedligt på den første" is selected:**  
A weekday `<select>` with Danish names (Mandag, Tirsdag, Onsdag, Torsdag, Fredag, Lørdag, Søndag). Pre-filled with the weekday of the task's start date. User can change to any weekday.

---

## Data Model

No DB migrations required. All needed columns already exist on `AreaRulePlanning`:

| Column | Type | Used by |
|--------|------|---------|
| `DayOfMonth` | `int` | Option 1: the selected day (1–28) |
| `DayOfWeek` | `int` | Option 2: the selected weekday (JS-style: 0=Sun…6=Sat) |
| `RepeatOrdinalWeek` | `int` | Option 2: hardcoded to `1` (first occurrence) |

`CalendarTaskCreateRequestModel` already carries all three fields.

---

## Frontend Changes

### `custom-repeat-modal.component.html`
- Add a new form row rendered only when `unit === 'month'`
- Row contains: primary `<select>` bound to a new `monthlyRepeatKind` form control + secondary picker rendered via `*ngIf`

### `custom-repeat-modal.component.ts`
- Add `monthlyRepeatKind: 'everyNMonthDom' | 'monthlyFirstWeekday'` to the form group
- Add `dayOfMonth: number` (default `1`) and `dayOfWeek: number` (default derived from start date) controls
- On start-date change: update `dayOfWeek` default if `monthlyRepeatKind === 'monthlyFirstWeekday'`
- On unit change away from `month`: reset `monthlyRepeatKind` to avoid stale state being sent

### `calendar-repeat.service.ts`

**`buildMetaFromCustomConfig`** — add `monthlyFirstWeekday` branch:
```
kind: 'monthlyFirstWeekday'
repeatOrdinalWeek: 1
dayOfWeek: <selected weekday index>
```
The existing `everyNMonthDom` branch already handles Option 1; ensure `dom` carries the chosen day number from the picker (not auto-derived from start date).

**`decomposeCustomMeta`** — add inverse branch: when `kind === 'monthlyFirstWeekday'`, set `monthlyRepeatKind = 'monthlyFirstWeekday'` and populate `dayOfWeek` from meta.

### `CalendarTaskModel` (if not already present)
Confirm `repeatOrdinalWeek` field is mapped through the Angular model to the request payload.

---

## Backend Changes

**No code changes expected.** `EnumerateOccurrences()` already handles:
- Monthly by DOM via `DayOfMonth`
- Monthly by Nth-weekday via `RepeatOrdinalWeek` + `DayOfWeek`

**Verification step:** Confirm that when `repeatOrdinalWeek = 1` and `dayOfWeek = N` are persisted, `EnumerateOccurrences` produces the first matching weekday of each calendar month (not the Nth week). Read the relevant branch in `BackendConfigurationCalendarService.cs` around line 3093.

---

## i18n

Add the following keys to all language files (`da.ts`, `en.ts`, etc.):

| Key | Danish value |
|-----|-------------|
| `Repeat sub-type` | `Gentagelsestype` |
| `Monthly day` | `Månedligt dag` |
| `Monthly on the first` | `Månedligt på den første` |

---

## Out of Scope

- Supporting 2nd/3rd/4th/last weekday of month (only "first" is in scope)
- Supporting days 29–31 (February constraint — cap at 28)
- Yearly repeat sub-types (separate feature)
- Flutter mobile app changes (calendar feature is web-only)

---

## Acceptance Criteria

1. When `Måned` is selected in custom-repeat-modal, the Gentagelsestype row is visible.
2. When `Månedligt dag` is selected and day `15` saved, tasks recur on the 15th of each month.
3. When `Månedligt på den første` + `Mandag` is saved, tasks recur on the first Monday of each month.
4. Editing an existing task with either sub-type correctly pre-fills both pickers.
5. Switching unit away from `Måned` and back resets the sub-type picker to a clean default.
6. Day picker offers exactly values 1–28.
7. Weekday picker defaults to the weekday of the start date on first open.
