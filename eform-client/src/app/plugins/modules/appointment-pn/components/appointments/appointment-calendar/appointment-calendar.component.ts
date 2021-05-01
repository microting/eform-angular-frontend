import {Component, OnInit, ViewChild} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {AppointmentModel, AppointmentSimpleModel, RepeatType} from '../../../models';
import {AppointmentPnCalendarService} from '../../../services';
import * as moment from 'moment';
import {AppointmentRequestModel} from '../../../models';
import {ViewPeriod} from 'calendar-utils';
import {PluginClaimsHelper} from '../../../../../../common/helpers';
import {AppointmentPnClaims} from '../../../const/appointment-pn-claims.const';

@Component({
  selector: 'app-appointment-calendar',
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss']
})
export class AppointmentCalendarComponent implements OnInit {
  @ViewChild('editAppointmentModal') editAppointmentModal;
  @ViewChild('viewAppointmentModal') viewAppointmentModal;
  @ViewChild('deleteAppointmentModal') deleteAppointmentModal;
  view: CalendarView;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil text-success"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editEvent(event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times text-danger"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteEvent(event);
      }
    }
  ];
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  activeDayIsOpen = false;
  period: ViewPeriod;
  locale: string;

  get pluginClaimsHelper() {
    return PluginClaimsHelper;
  }

  get appointmentPnClaims() {
    return AppointmentPnClaims;
  }

  constructor(
    private appointmentPnCalendarService: AppointmentPnCalendarService
  ) {}

  ngOnInit(): void {
    this.locale = localStorage.getItem('locale');
    this.view = CalendarView.Month;
  }

  beforeViewRender(renderEvent) {
    this.period = renderEvent.period;

    if (this.events.length === 0) {
      this.getAppointmentsList();
    }
  }

  getAppointmentsList() {
    const request: AppointmentRequestModel = {
      startDate: moment(this.period.start).utcOffset(0, true).toISOString(),
      endDate: moment(this.period.end).utcOffset(0, true).toISOString()
    };

    this.appointmentPnCalendarService.getAppointmentsList(request).subscribe((data) => {
      if (data && data.success) {
        const listModel = data.model;

        if (listModel.total > 0) {
          this.events = [];

          for (const a of listModel.appointments) {
            a.startAt = moment(a.startAt).utc(true).local();
            a.expireAt = moment(a.expireAt).utc(true).local();
            a.repeatUntil = a.repeatUntil ? moment(a.repeatUntil).utc(true).local() : null;

            const event = {
              id: a.id,
              start: a.startAt.toDate(),
              end: a.expireAt.toDate(),
              title: a.title,
              color: {
                primary: a.colorHex,
                secondary: a.colorHex
              },
              actions: a.startAt > moment() ? this.actions : [],
              resizable: {
                beforeStart: true,
                afterEnd: true
              },
              draggable: a.startAt > moment() && a.expireAt.diff(a.startAt, 'h') < 24
            };

            if (a.repeatType && !a.nextId && a.startAt > moment()) {
              // this will create copies of the repeatable event
              this.addRecurringAppointment(event, a);
            } else {
              // event is not repeatable, so add it only once
              this.events = [...this.events, event];
            }
          }
        }
      }
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      this.activeDayIsOpen = !((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0);
      this.viewDate = date;
    }
  }

  eventTimesChanged({event, newStart, newEnd}: CalendarEventTimesChangedEvent): void {
    // do nothing if dragging occurred, but date doesn't change
    if (event.start.getTime() === newStart.getTime() && event.end.getTime() === newEnd.getTime()) {
      return;
    }

    // calculate differences between previous and new event start and end dates, these are needed to update appointment dates
    const startDiff = newStart.getTime() - event.start.getTime();
    const endDiff = newEnd.getTime() - event.end.getTime();

    // just update for calendar view to put event label to place where it was dragged
    event.start = newStart;
    event.end = newEnd;
    this.refresh.next();

    // request the exact appointment object by Id from event to get the original dates
    this.appointmentPnCalendarService.getAppointment(event.id).subscribe((data) => {
      if (data && data.success) {
        const appointmentModel = data.model;

        // modify original dates using differences calculated previously
        appointmentModel.startAt = moment(appointmentModel.startAt).add(startDiff, 'ms').utcOffset(0, true);
        appointmentModel.expireAt = moment(appointmentModel.expireAt).add(endDiff, 'ms').utcOffset(0, true);

        // send modified appointment model to server and retrieve list despite the result of request
        this.appointmentPnCalendarService.updateAppointment(appointmentModel)
          .subscribe(() => {
            this.getAppointmentsList();
          });
      }
    });
  }

  showEditAppointmentModal(appointmentModel?: AppointmentModel): void {
    this.editAppointmentModal.show(appointmentModel);
  }

  viewEvent(eventToView: CalendarEvent) {
    this.appointmentPnCalendarService.getAppointment(eventToView.id).subscribe(data => {
      if (data && data.success) {
        data.model.startAt = moment(data.model.startAt).local();
        data.model.expireAt = moment(data.model.expireAt).local();
        this.viewAppointmentModal.show(data.model);
      }
    });
  }

  editEvent(eventToEdit: CalendarEvent) {
    this.appointmentPnCalendarService.getAppointment(eventToEdit.id).subscribe(data => {
      if (data && data.success) {
        data.model.startAt = moment(data.model.startAt).local();
        data.model.expireAt = moment(data.model.expireAt).local();
        this.showEditAppointmentModal(data.model);
      }
    });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.appointmentPnCalendarService.getAppointment(eventToDelete.id).subscribe(data => {
      if (data && data.success) {
        data.model.startAt = moment(data.model.startAt).local();
        data.model.expireAt = moment(data.model.expireAt).local();
        this.deleteAppointmentModal.show(data.model);
      }
    });
  }

  setView(view: CalendarView) {
    this.view = view;
    this.updatePeriod(this.viewDate);
  }

  viewDateChange(event) {
    this.updatePeriod(event);
    this.activeDayIsOpen = false;
  }

  updatePeriod(date: Date) {
    // calculate the period of currently displayed calendar view and date
    const d = moment(date);
    switch (this.view) {
      case CalendarView.Month:
        this.period.start = d.startOf('month').toDate();
        this.period.end = d.endOf('month').toDate();
        break;
      case CalendarView.Week:
        this.period.start = d.startOf('isoWeek').toDate();
        this.period.end = d.endOf('isoWeek').toDate();
        break;
      case CalendarView.Day:
        this.period.start = d.startOf('day').toDate();
        this.period.end = d.endOf('day').toDate();
        break;
    }

    this.getAppointmentsList();
  }

  addRecurringAppointment(event: CalendarEvent, appointment: AppointmentSimpleModel) {
    // choose the correct unit according to type of recurring event
    let unit;
    switch (appointment.repeatType) {
      case RepeatType.Month:
        unit = 'M';
        break;
      case RepeatType.Week:
        unit = 'w';
        break;
      case RepeatType.Day:
        unit = 'd';
        break;
      default:
    }

    // duplicate events until the end of currently displayed period or events repeatUntil value
    while (event.start <= this.period.end && (!appointment.repeatUntil || event.start <= appointment.repeatUntil.toDate())) {
      this.events = [...this.events, event];

      // make a copy because we don't want to modify previous event
      event = Object.assign({}, event);
      const now = new Date();

      // calculate dates for the next copy of event
      event.start = moment(event.start).add(appointment.repeatEvery, unit).toDate();
      event.end = moment(event.end).add(appointment.repeatEvery, unit).toDate();
      // next properties are applying only for future events, so perform additional checks
      event.actions = event.start > now ? this.actions : [];
      event.draggable = event.start > now;
      event.resizable = {
        beforeStart: event.start > now,
        afterEnd: event.start > now
      };
    }
  }
}
