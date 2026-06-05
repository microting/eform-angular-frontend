# Calendar: Hide Completion Circle for Non-Active, Non-Completed Events

**Date:** 2026-06-05
**Status:** Approved

## Problem

On the calendar view (`/plugins/backend-configuration-pn/calendar`), the completion circle button is rendered unconditionally on every event block. For non-active events (`task.status === false`) that are not yet completed, this circle is misleading: it implies the event can be completed, but it should not be interactable for completion purposes.

## Goal

Hide the completion circle for events that are both inactive (`task.status === false`) and not completed (`task.completed === false`). Events that are inactive but already completed must still show the completed marker (so the completion state is not lost from view). Edit access (clicking the event body) must remain unchanged for all events.

## Decision

Approach A — `*ngIf` on the button element. Removes the element from the DOM, making it truly non-clickable and invisible. Matches the pattern already used for resize handles in the same template.

## Visibility Matrix

| `task.status` | `task.completed` | Circle shown? |
|---|---|---|
| `true` | `false` | Yes — open circle |
| `true` | `true` | Yes — check circle |
| `false` | `false` | **No** |
| `false` | `true` | Yes — check circle |

## Change

**File:** `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/components/calendar-task-block/calendar-task-block.component.html`

**Before (line 29):**
```html
<button
  class="completion-btn"
  [class.done]="task.completed"
  (click)="onCompletionClick($event)"
  ...
>
```

**After:**
```html
<button
  *ngIf="task.status || task.completed"
  class="completion-btn"
  [class.done]="task.completed"
  (click)="onCompletionClick($event)"
  ...
>
```

## Out of Scope

- Resize handle visibility for inactive events (not requested)
- Drag behaviour for inactive events (not requested)
- Any server-side enforcement (UI-only change)
