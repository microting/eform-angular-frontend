import {Component, OnInit} from '@angular/core';
import {SettingsModel} from 'app/models';
import {SettingsService} from 'app/services';
import {Router} from '@angular/router';
import {AdminSettingsModel} from 'app/models/settings/admin-settings.model';
import {NotifyService} from 'app/services/notify.service';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  spinnerStatus: boolean;
  adminSettingsModel: AdminSettingsModel = new AdminSettingsModel;

  constructor(private settingsService: SettingsService, private router: Router, private notifyService: NotifyService) {
  }

  ngOnInit() {
    this.getAdminSettings();
  }

  getAdminSettings() {
    this.settingsService.getAdminSettings().subscribe(operation => {
      if (operation && operation.success) {
        this.spinnerStatus = false;
        this.adminSettingsModel = operation.model;
      }
    });
  }

  updateAdminSettings() {
    this.spinnerStatus = true;
    this.settingsService.updateAdminSettings(this.adminSettingsModel).subscribe(operation => {
      if (operation && operation.success) {
        this.notifyService.success({text: operation.message});
      } else {
        this.notifyService.error({text: operation.message});
      }
      this.spinnerStatus = false;
    });
  }

}
