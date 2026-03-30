import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CdkDragDrop} from '@angular/cdk/drag-drop';
import {CalendarBoardModel, CalendarTaskLayoutModel} from '../../../../models/calendar';
import {HOUR_HEIGHT} from '../calendar-task-block/calendar-task-block.component';

const DAY_HEADER_PX = 40;

@Component({
  standalone: false,
  selector: 'app-calendar-day-column',
  templateUrl: './calendar-day-column.component.html',
  styleUrls: ['./calendar-day-column.component.scss'],
})
export class CalendarDayColumnComponent {
  @Input() date!: Date;
  @Input() dayIndex!: number;
  @Input() tasks: CalendarTaskLayoutModel[] = [];
  @Input() boards: CalendarBoardModel[] = [];
  @Input() hourHeight = HOUR_HEIGHT;
  @Input() isToday = false;
  @Input() nowTopPx: number | null = null;

  @Output() slotClicked = new EventEmitter<{date: string; startHour: number}>();
  @Output() taskClicked = new EventEmitter<CalendarTaskLayoutModel>();
  @Output() taskToggleComplete = new EventEmitter<CalendarTaskLayoutModel>();
  @Output() taskDropped = new EventEmitter<{task: CalendarTaskLayoutModel; newDate: string; newStartHour: number; originalDate: string}>();

  readonly hours = Array.from({length: 24}, (_, i) => i);

  onColumnClick(event: MouseEvent) {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const relY = event.clientY - rect.top - DAY_HEADER_PX;
    const rawHour = relY / this.hourHeight;
    // Snap to 15-min grid
    const startHour = Math.max(0, Math.round(rawHour * 4) / 4);
    const iso = this.date.toISOString().split('T')[0];
    this.slotClicked.emit({date: iso, startHour});
  }

  onDrop(event: CdkDragDrop<CalendarTaskLayoutModel[]>) {
    const task: CalendarTaskLayoutModel = event.item.data;
    const target = event.container.element.nativeElement;
    const rect = target.getBoundingClientRect();
    const relY = event.dropPoint.y - rect.top - DAY_HEADER_PX;
    const rawHour = relY / this.hourHeight;
    const newStartHour = Math.max(0, Math.round(rawHour * 4) / 4);
    const newDate = this.date.toISOString().split('T')[0];
    this.taskDropped.emit({task, newDate, newStartHour, originalDate: task.taskDate});
  }

  get dateLabel(): string {
    if (this.isToday) return 'I dag';
    const weekday = this.date.toLocaleDateString('da-DK', {weekday: 'short'});
    const day = this.date.getDate().toString().padStart(2, '0');
    const month = (this.date.getMonth() + 1).toString().padStart(2, '0');
    return `${weekday} ${day}/${month}`;
  }
}
