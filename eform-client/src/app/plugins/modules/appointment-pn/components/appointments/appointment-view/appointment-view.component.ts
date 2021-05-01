import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AppointmentModel} from '../../../models';
import {AppointmentPnCalendarService} from '../../../services';
import * as moment from 'moment';

@Component({
  selector: 'app-appointment-view',
  templateUrl: './appointment-view.component.html',
  styleUrls: ['./appointment-view.component.scss']
})
export class AppointmentViewComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() appointmentSaved: EventEmitter<void> = new EventEmitter<void>();
  selectedModel: AppointmentModel = new AppointmentModel();

  constructor(private appointmentPnCalendarService: AppointmentPnCalendarService) {
  }

  ngOnInit() {
  }

  show(model: AppointmentModel) {
    this.selectedModel = model;
    this.selectedModel.startAt = moment(this.selectedModel.startAt).utc(true).local();
    this.selectedModel.expireAt = moment(this.selectedModel.expireAt).utc(true).local();
    this.frame.show();
  }
}
