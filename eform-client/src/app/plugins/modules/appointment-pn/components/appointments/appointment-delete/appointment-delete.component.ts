import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AppointmentModel} from '../../../models';
import {AppointmentPnCalendarService} from '../../../services';

@Component({
  selector: 'app-appointment-delete',
  templateUrl: './appointment-delete.component.html',
  styleUrls: ['./appointment-delete.component.scss']
})
export class AppointmentDeleteComponent implements OnInit {
  @ViewChild('frame') frame;
  @Output() appointmentDeleted: EventEmitter<void> = new EventEmitter<void>();
  selectedModel: AppointmentModel = new AppointmentModel();

  constructor(private appointmentPnCalendarService: AppointmentPnCalendarService) {
  }

  ngOnInit() {
  }

  show(model: AppointmentModel) {
    this.selectedModel = model;
    this.frame.show();
  }

  deleteAppointment() {
    this.appointmentPnCalendarService.deleteAppointment(this.selectedModel.id).subscribe((data) => {
      if (data && data.success) {
        this.appointmentDeleted.emit();
        this.frame.hide();
      }
    });
  }
}
