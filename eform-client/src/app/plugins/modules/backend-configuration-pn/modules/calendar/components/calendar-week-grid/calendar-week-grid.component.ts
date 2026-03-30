import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {CdkDragDrop, CdkDragMove} from '@angular/cdk/drag-drop';
import {interval, Subject} from 'rxjs';
import {startWith, takeUntil} from 'rxjs/operators';
import {CalendarBoardModel, CalendarTaskLayoutModel, CalendarTaskModel} from '../../../../models/calendar';
import {CommonDictionaryModel} from 'src/app/common/models';
import {BackendConfigurationPnCalendarService} from '../../../../services';
import {HOUR_HEIGHT} from '../calendar-task-block/calendar-task-block.component';
import {MtxGridColumn} from '@ng-matero/extensions/grid';

@Component({
  standalone: false,
  selector: 'app-calendar-week-grid',
  templateUrl: './calendar-week-grid.component.html',
  styleUrls: ['./calendar-week-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarWeekGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('scrollContainer') scrollContainerRef!: ElementRef<HTMLElement>;
  @ViewChild('timeAxisTpl', {static: true}) timeAxisTpl!: TemplateRef<any>;
  @ViewChild('dayColTpl', {static: true}) dayColTpl!: TemplateRef<any>;

  @Input() tasksByDay: CalendarTaskLayoutModel[][] = Array.from({length: 7}, () => []);
  @Input() allDayTasksByDay: CalendarTaskModel[][] = Array.from({length: 7}, () => []);
  @Input() currentDate: string = '';
  @Input() boards: CalendarBoardModel[] = [];
  @Input() dayViewMode = false;
  @Input() isAdmin = false;
  @Input() employees: CommonDictionaryModel[] = [];
  @Input() tags: string[] = [];
  @Input() properties: CommonDictionaryModel[] = [];

  @Output() slotClicked = new EventEmitter<{date: string; startHour: number; cellLeft: number; cellRight: number; slotTop: number}>();
  @Output() taskClicked = new EventEmitter<{task: CalendarTaskLayoutModel; cellLeft: number; cellRight: number; slotTop: number}>();
  @Output() taskMoved = new EventEmitter<{taskId: number; newDate: string; newStartHour: number; repeatSeriesId?: string; originalDate: string}>();
  @Output() tasksReload = new EventEmitter<void>();

  private destroy$ = new Subject<void>();
  readonly hourHeight = HOUR_HEIGHT;
  readonly hours = Array.from({length: 24}, (_, i) => i);
  nowTopPx = 0;
  weekDays: Date[] = [];
  tableColumns: MtxGridColumn[] = [];
  gridData = [{}];
  dragIndicatorTopPx: number | null = null;
  draggingTask: CalendarTaskLayoutModel | null = null;
  dragIndicatorHour: number | null = null;
  dragGhostLeft: number | null = null;
  dragGhostWidth: number = 0;
  dragSourceLeft: number | null = null;
  dragSourceTop: number | null = null;
  dragSourceWidth: number = 0;
  private dragTargetDayIndex: number | null = null;

  // Selection indicator (absolute coords within scroll container)
  selectionTop: number | null = null;
  selectionLeft: number | null = null;
  selectionWidth: number = 0;
  selectionHeight: number = 0;
  private selectionBaseTop: number = 0; // top of the day column in scroll coords
  private selectionDayIndex: number = -1;

  constructor(
    private calendarService: BackendConfigurationPnCalendarService,
  ) {}

  ngOnInit() {
    this.rebuildWeekDays();
    this.buildColumns();
    interval(60000).pipe(startWith(0), takeUntil(this.destroy$)).subscribe(() => {
      this.updateNowLine();
    });
  }

  ngAfterViewInit() {
    this.scrollToNow();
  }

  ngOnChanges() {
    this.rebuildWeekDays();
    this.buildColumns();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private rebuildWeekDays() {
    if (!this.currentDate) return;
    const d = new Date(this.currentDate);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    monday.setHours(0, 0, 0, 0);

    if (this.dayViewMode) {
      this.weekDays = [new Date(monday)];
    } else {
      this.weekDays = Array.from({length: 7}, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return date;
      });
    }
  }

  get dayDropListIds(): string[] {
    return this.weekDays.map((_, i) => `cal-day-${i}`);
  }

  private buildColumns(): void {
    if (!this.timeAxisTpl || !this.dayColTpl) return;
    const timeAxisCol: MtxGridColumn = {
      field: 'time-axis',
      header: '',
      width: '56px',
      cellTemplate: this.timeAxisTpl,
      sortable: false,
    };
    const dayCols: MtxGridColumn[] = this.weekDays.map((date, i) => ({
      field: `col-${i}`,
      header: this.getDateLabel(date),
      cellTemplate: this.dayColTpl,
      sortable: false,
      class: this.isToday(date) ? 'today-col' : '',
    }));
    this.tableColumns = [timeAxisCol, ...dayCols];
  }

  private updateNowLine() {
    const now = new Date();
    this.nowTopPx = (now.getHours() + now.getMinutes() / 60) * this.hourHeight;
  }

  private scrollToNow() {
    setTimeout(() => {
      const el = this.scrollContainerRef?.nativeElement;
      if (!el) return;
      el.scrollTop = Math.max(0, this.nowTopPx - 100);
    }, 100);
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  getDateLabel(date: Date): string {
    if (this.isToday(date)) return 'I dag';
    const weekday = date.toLocaleDateString('da-DK', {weekday: 'short'});
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${weekday} ${day}/${month}`;
  }

  getDayIndex(field: string): number {
    const m = field.match(/^col-(\d+)$/);
    return m ? parseInt(m[1], 10) : 0;
  }

  getDayDate(field: string): Date {
    return this.weekDays[this.getDayIndex(field)];
  }

  isPastSlot(dayIndex: number, hour: number): boolean {
    const slotDate = new Date(this.weekDays[dayIndex]);
    slotDate.setHours(hour, 0, 0, 0);
    return slotDate < new Date();
  }

  onCellClick(event: MouseEvent) {
    if ((event.target as HTMLElement).closest('app-calendar-task-block')) return;
    const cell = event.currentTarget as HTMLElement;
    const dayIndex = parseInt(cell.dataset['day'] ?? '0', 10);
    const date = this.weekDays[dayIndex];
    if (!date) return;
    const rect = cell.getBoundingClientRect();
    const relY = event.clientY - rect.top;
    const startHour = Math.max(0, Math.round((relY / this.hourHeight) * 4) / 4);

    // Reject clicks on past time slots
    const clickDateTime = new Date(date);
    clickDateTime.setHours(Math.floor(startHour), (startHour % 1) * 60, 0, 0);
    if (clickDateTime < new Date()) {
      return;
    }

    // Compute selection indicator position (absolute within scroll container)
    const containerEl = this.scrollContainerRef.nativeElement;
    const containerRect = containerEl.getBoundingClientRect();
    this.selectionLeft = rect.left - containerRect.left + containerEl.scrollLeft;
    this.selectionBaseTop = rect.top - containerRect.top + containerEl.scrollTop;
    this.selectionTop = this.selectionBaseTop + startHour * this.hourHeight;
    this.selectionWidth = rect.width;
    this.selectionHeight = this.hourHeight;
    this.selectionDayIndex = dayIndex;

    // Pass viewport coordinates for overlay positioning
    const slotTop = rect.top + startHour * this.hourHeight;
    this.slotClicked.emit({
      date: this.toLocalDateString(date),
      startHour,
      cellLeft: rect.left,
      cellRight: rect.right,
      slotTop,
    });
  }

  clearSelection() {
    this.selectionTop = null;
    this.selectionLeft = null;
  }

  updateSelectionTime(startHour: number, endHour: number) {
    if (this.selectionTop === null) return;
    const duration = Math.max(endHour - startHour, 0.25);
    this.selectionTop = this.selectionBaseTop + startHour * this.hourHeight;
    this.selectionHeight = duration * this.hourHeight;
  }

  onDrop(event: CdkDragDrop<CalendarTaskLayoutModel[]>) {
    const task: CalendarTaskLayoutModel = event.item.data;

    // Use the snapped position tracked during onTaskDragMoved
    const dayIndex = this.dragTargetDayIndex;
    const newStartHour = this.dragIndicatorHour ?? 0;
    this.clearDragState();
    if (dayIndex == null || dayIndex < 0) return;
    const date = this.weekDays[dayIndex];
    const newDate = date ? this.toLocalDateString(date) : null;
    if (!date || !newDate) return;

    // Reject drop to past time
    const targetDateTime = new Date(date);
    targetDateTime.setHours(Math.floor(newStartHour), (newStartHour % 1) * 60, 0, 0);
    if (targetDateTime < new Date()) {
      return;
    }

    this.taskMoved.emit({taskId: task.id, newDate, newStartHour, repeatSeriesId: task.repeatSeriesId, originalDate: task.taskDate});
  }

  private toLocalDateString(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  onTaskDragMoved(event: CdkDragMove<CalendarTaskLayoutModel>) {
    const isNewDrag = !this.draggingTask;
    this.draggingTask = event.source.data;
    if (isNewDrag) {
      this.captureDragSource(this.draggingTask);
    }
    const pointerX = event.pointerPosition.x;
    const pointerY = event.pointerPosition.y;
    const containerEl = this.scrollContainerRef.nativeElement;
    const containerRect = containerEl.getBoundingClientRect();

    const columnEls = containerEl.querySelectorAll<HTMLElement>('.day-cell-content');
    let found = false;
    for (let j = 0; j < columnEls.length; j++) {
      const el = columnEls[j];
      const rect = el.getBoundingClientRect();
      if (pointerX >= rect.left && pointerX < rect.right && pointerY >= rect.top && pointerY < rect.bottom) {
        const cellTopAbsolute = rect.top - containerRect.top + containerEl.scrollTop;
        const relY = pointerY - rect.top;
        const snappedHour = Math.max(0, Math.round((relY / this.hourHeight) * 4) / 4);
        this.dragIndicatorHour = snappedHour;
        this.dragIndicatorTopPx = cellTopAbsolute + snappedHour * this.hourHeight;
        this.dragGhostLeft = rect.left - containerRect.left + containerEl.scrollLeft;
        this.dragGhostWidth = rect.width - 4;
        this.dragTargetDayIndex = parseInt(el.dataset['day'] ?? '-1', 10);
        found = true;
        break;
      }
    }
    if (!found) {
      this.dragIndicatorTopPx = null;
      this.dragGhostLeft = null;
    }
  }

  onTaskDragEnded() {
    // Only clear visual state here — position data is consumed by onDrop which fires after this
    this.draggingTask = null;
    this.dragIndicatorTopPx = null;
    this.dragGhostLeft = null;
    this.dragSourceLeft = null;
    this.dragSourceTop = null;
  }

  private clearDragState() {
    this.dragIndicatorHour = null;
    this.dragTargetDayIndex = null;
  }

  private captureDragSource(task: CalendarTaskLayoutModel): void {
    const containerEl = this.scrollContainerRef.nativeElement;
    const containerRect = containerEl.getBoundingClientRect();
    const dayIndex = this.weekDays.findIndex(
      d => this.toLocalDateString(d) === task.taskDate
    );
    if (dayIndex < 0) return;
    const colEl = containerEl.querySelector<HTMLElement>(`.day-cell-content[data-day="${dayIndex}"]`);
    if (!colEl) return;
    const colRect = colEl.getBoundingClientRect();
    this.dragSourceLeft = colRect.left - containerRect.left + containerEl.scrollLeft;
    this.dragSourceTop = colRect.top - containerRect.top + containerEl.scrollTop + task.startHour * this.hourHeight;
    this.dragSourceWidth = colRect.width - 4;
  }

  formatHour(h: number): string {
    const totalMinutes = Math.round(h * 60);
    const hh = Math.floor(totalMinutes / 60) % 24;
    const mm = totalMinutes % 60;
    return `${hh.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
  }

  onTaskClicked(task: CalendarTaskLayoutModel) {
    const containerEl = this.scrollContainerRef.nativeElement;
    const containerRect = containerEl.getBoundingClientRect();
    const dayIndex = this.weekDays.findIndex(d => this.toLocalDateString(d) === task.taskDate);
    const colEl = containerEl.querySelector<HTMLElement>(`.day-cell-content[data-day="${dayIndex}"]`);
    if (!colEl) return;
    const colRect = colEl.getBoundingClientRect();

    const slotTop = colRect.top + task.startHour * this.hourHeight;
    this.taskClicked.emit({
      task,
      cellLeft: colRect.left,
      cellRight: colRect.right,
      slotTop,
    });
  }

  updateTaskTime(taskId: number, startHour: number, endHour: number) {
    const dur = Math.max(endHour - startHour, 0.25);
    for (const dayTasks of this.tasksByDay) {
      const task = dayTasks.find(t => t.id === taskId);
      if (task) {
        task.startHour = startHour;
        task.duration = dur;
        break;
      }
    }
  }

  onTaskToggleComplete(task: CalendarTaskLayoutModel) {
    this.calendarService.toggleComplete(task.id, !task.completed).subscribe(res => {
      if (res && res.success) this.tasksReload.emit();
    });
  }

  get timeAxisLabels(): string[] {
    return Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  }

  get hasAllDayTasks(): boolean {
    return this.allDayTasksByDay.some(day => day.length > 0);
  }

  onAllDayTaskClicked(event: MouseEvent, task: CalendarTaskModel, dayIndex: number) {
    const chipEl = event.currentTarget as HTMLElement;
    const chipRect = chipEl.getBoundingClientRect();
    this.taskClicked.emit({
      task: {...task, _colIndex: 0, _colCount: 1} as CalendarTaskLayoutModel,
      cellLeft: chipRect.left,
      cellRight: chipRect.right,
      slotTop: chipRect.bottom,
    });
  }
}
