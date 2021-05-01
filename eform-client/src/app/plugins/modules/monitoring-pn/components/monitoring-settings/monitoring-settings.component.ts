import {Component, OnInit} from '@angular/core';
import {MonitoringPnSettingsService} from '../../services';
import {MonitoringBaseSettingsModel} from '../../models';

@Component({
  selector: 'app-monitoring-settings',
  templateUrl: './monitoring-settings.component.html',
  styleUrls: ['./monitoring-settings.component.scss']
})
export class MonitoringSettingsComponent implements OnInit {
  settingsModel: MonitoringBaseSettingsModel = new MonitoringBaseSettingsModel();

  constructor(private monitoringPnSettingsService: MonitoringPnSettingsService) {
  }

  ngOnInit() {
    this.getSettings();
  }


  getSettings() {
    this.monitoringPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }

  updateSettings() {
    this.monitoringPnSettingsService.updateSettings(this.settingsModel)
      .subscribe(() => {
      });
  }
}
