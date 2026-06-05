import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarTaskBlockComponent } from './calendar-task-block.component';
import { CalendarTaskLayoutModel } from '../../../../models/calendar/calendar-task.model';
import { MockTranslatePipe } from 'src/test-helpers';

function makeTask(overrides: Partial<CalendarTaskLayoutModel> = {}): CalendarTaskLayoutModel {
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
    _left: 0,
    _width: 100,
    _zIndex: 10,
    ...overrides,
  } as CalendarTaskLayoutModel;
}

describe('CalendarTaskBlockComponent — completion button visibility', () => {
  let fixture: ComponentFixture<CalendarTaskBlockComponent>;
  let component: CalendarTaskBlockComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarTaskBlockComponent, MockTranslatePipe],
      imports: [NoopAnimationsModule],
      schemas: [NO_ERRORS_SCHEMA],
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

  it('always shows completion indicator when task is already completed regardless of active status', () => {
    component.task = makeTask({ status: false, completed: true });
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.completion-btn'))).not.toBeNull();
  });
});
