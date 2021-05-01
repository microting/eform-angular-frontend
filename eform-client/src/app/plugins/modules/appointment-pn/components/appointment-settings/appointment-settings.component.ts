import {Router} from '@angular/router';

import {Component, OnInit} from '@angular/core';
import {AppointmentBaseSettingsModel} from '../../models/appointment-base-settings.model';
import {AppointmentPnSettingsService} from '../../services';

@Component({
  selector: 'app-appointment-settings',
  templateUrl: './appointment-settings.component.html',
  styleUrls: ['./appointment-settings.component.scss']
})
export class AppointmentSettingsComponent implements OnInit {
  settingsModel: AppointmentBaseSettingsModel = new AppointmentBaseSettingsModel();

  constructor(private appointmentPnSettingsService: AppointmentPnSettingsService, private router: Router) {
  }

  ngOnInit() {
    this.getSettings();
  }


  getSettings() {
    // debugger;
    this.appointmentPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }

  updateSettings() {
    this.appointmentPnSettingsService.updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {

        }
      });
  }
}
