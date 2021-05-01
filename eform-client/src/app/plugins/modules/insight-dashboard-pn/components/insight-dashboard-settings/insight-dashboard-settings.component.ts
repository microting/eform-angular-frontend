import {Component, OnInit} from '@angular/core';
import {InsightDashboardPnSettingsService} from '../../services';
import {InsightDashboardBaseSettingsModel} from '../../models';

@Component({
  selector: 'app-insight-dashboard-settings',
  templateUrl: './insight-dashboard-settings.component.html',
  styleUrls: ['./insight-dashboard-settings.component.scss']
})
export class InsightDashboardSettingsComponent implements OnInit {
  settingsModel: InsightDashboardBaseSettingsModel = new InsightDashboardBaseSettingsModel();

  constructor(private insightDashboardPnSettingsService: InsightDashboardPnSettingsService) {
  }

  ngOnInit() {
    this.getSettings();
  }


  getSettings() {
    this.insightDashboardPnSettingsService.getAllSettings().subscribe((data) => {
      if (data && data.success) {
        this.settingsModel = data.model;
      }
    });
  }

  updateSettings() {
    this.insightDashboardPnSettingsService.updateSettings(this.settingsModel)
      .subscribe((data) => {
        if (data && data.success) {

        }
      });
  }
}
