# Calendar Inactive Completion Circle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Hide the completion circle button on calendar event blocks that are both inactive (`task.status === false`) and not completed (`task.completed === false`).

**Architecture:** Single `*ngIf` guard added to the existing completion button in the task-block template. No service, model, or CSS changes needed. Four cases covered by the guard: active/inactive × completed/not-completed.

**Tech Stack:** Angular 17+ (standalone components), Angular CDK drag-drop, Angular Material icons, Jest + Angular Testing Library (`@angular/core/testing`)

**Spec:** `docs/superpowers/specs/2026-06-05-calendar-inactive-event-completion-circle-design.md`

---

### Task 1: Write the failing component spec

**Files:**
- Create: `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/components/calendar-task-block/calendar-task-block.component.spec.ts`

The component `CalendarTaskBlockComponent` is standalone and lives at the path above. It takes four `@Input()` properties: `task: CalendarTaskModel`, `hourHeight: number`, `showId: boolean`, and a raised-state input. Use `NoopAnimationsModule` to suppress CDK/Material animation warnings.

- [ ] **Step 1: Create the spec file**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarTaskBlockComponent } from './calendar-task-block.component';
import { CalendarTaskModel } from '../../../../../models/calendar/calendar-task.model';

function makeTask(overrides: Partial<CalendarTaskModel> = {}): CalendarTaskModel {
  return {
    id: 1,
    title: 'Test Task',
    startHour: 9,
    duration: 1,
    startText: '09:00',
    endText: '10:00',
    tags: [],
    assigneeIds: [],
    boardId: 1,
    color: '#4CAF50',
    descriptionHtml: '',
    repeatRule: 'none',
    taskDate: '2026-06-05',
    completed: false,
    status: true,
    propertyId: 1,
    complianceEnabled: false,
    ...overrides,
  } as CalendarTaskModel;
}

describe('CalendarTaskBlockComponent — completion button visibility', () => {
  let fixture: ComponentFixture<CalendarTaskBlockComponent>;
  let component: CalendarTaskBlockComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarTaskBlockComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarTaskBlockComponent);
    component = fixture.componentInstance;
    component.hourHeight = 60;
    component.showId = false;
  });

  it('shows completion button for active non-completed task', () => {
    component.task = makeTask({ status: true, completed: false });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.completion-btn'))).not.toBeNull();
  });

  it('shows completion button for active completed task', () => {
    component.task = makeTask({ status: true, completed: true });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.completion-btn'))).not.toBeNull();
  });

  it('hides completion button for inactive non-completed task', () => {
    component.task = makeTask({ status: false, completed: false });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.completion-btn'))).toBeNull();
  });

  it('shows completion button for inactive completed task', () => {
    component.task = makeTask({ status: false, completed: true });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.completion-btn'))).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

```bash
cd eform-client && yarn test:unit --testPathPattern="calendar-task-block.component.spec"
```

Expected output: 3 tests pass (`active/non-completed`, `active/completed`, `inactive/completed`), **1 test fails** (`hides completion button for inactive non-completed task`).

> If ALL four fail with a setup error (e.g. CDK drag-drop module not initialised), add `schemas: [NO_ERRORS_SCHEMA]` to `TestBed.configureTestingModule`:
> ```typescript
> import { NO_ERRORS_SCHEMA } from '@angular/core';
> // inside configureTestingModule:
> schemas: [NO_ERRORS_SCHEMA],
> ```
> Re-run; now the one target test should fail and the other three should pass (or be skipped).

---

### Task 2: Apply the template fix

**Files:**
- Modify: `eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/components/calendar-task-block/calendar-task-block.component.html`

The button element currently starts at line ~29 with no `*ngIf`. Add the guard so the button is only rendered when `task.status` is truthy OR `task.completed` is truthy.

- [ ] **Step 3: Add `*ngIf` to the completion button**

Find this block in the template:

```html
<button
  class="completion-btn"
  [class.done]="task.completed"
  (click)="onCompletionClick($event)"
  [title]="task.completed ? ('Mark as not completed' | translate) : ('Mark as completed' | translate)"
>
  <mat-icon>{{ task.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
</button>
```

Replace with:

```html
<button
  *ngIf="task.status || task.completed"
  class="completion-btn"
  [class.done]="task.completed"
  (click)="onCompletionClick($event)"
  [title]="task.completed ? ('Mark as not completed' | translate) : ('Mark as completed' | translate)"
>
  <mat-icon>{{ task.completed ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
</button>
```

- [ ] **Step 4: Run the tests to verify all four pass**

```bash
cd eform-client && yarn test:unit --testPathPattern="calendar-task-block.component.spec"
```

Expected output: 4 tests pass, 0 failures.

- [ ] **Step 5: Commit**

```bash
git add eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/components/calendar-task-block/calendar-task-block.component.html
git add eform-client/src/app/plugins/modules/backend-configuration-pn/modules/calendar/components/calendar-task-block/calendar-task-block.component.spec.ts
git commit -m "fix(calendar): hide completion circle for inactive non-completed events"
```
