export type CalendarRepeatRule =
  | 'none'
  | 'daily'
  | 'weekly'
  | 'weekdays'
  | 'monthly'
  | 'yearly'
  | 'custom';

export interface CalendarTaskModel {
  id: number;
  title: string;
  startHour: number;         // fractional hour, e.g. 9.5 = 09:30
  duration: number;           // duration in hours
  startText: string;         // "09:30"
  endText: string;           // "10:00"
  tags: string[];
  assigneeIds: number[];
  boardId: number;
  color: string;
  descriptionHtml: string;
  repeatRule: CalendarRepeatRule;
  repeatMeta?: CalendarRepeatMeta;
  taskDate: string;          // ISO "YYYY-MM-DD"
  repeatSeriesId?: string;
  completed: boolean;
  driveLink?: string;
  propertyId: number;
  isFromCompliance?: boolean;
  complianceId?: number;
  deadline?: string;
  nextExecutionTime?: string;
  planningId?: number;
  isAllDay?: boolean;
  exceptionId?: number;
}

export interface CalendarRepeatMeta {
  kind: string;
  n?: number;
  weekday?: number;
  weekdays?: number[];
  dom?: number;
  month?: number;
  endMode: 'never' | 'after' | 'until';
  afterCount?: number;
  untilTs?: number;
}

export interface CalendarTaskLayoutModel extends CalendarTaskModel {
  _colIndex: number;
  _colCount: number;
}
