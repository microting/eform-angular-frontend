import {Component, HostBinding, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SettingsModel} from 'src/app/common/models/settings';
import {AppSettingsService} from 'src/app/common/services/settings';

@Component({
  selector: 'app-database-setup',
  templateUrl: './connection-setup.component.html',
  styleUrls: ['./connection-setup.component.scss']
})
export class ConnectionSetupComponent implements OnInit {
  spinnerStatus = false;
  settingsModel: SettingsModel = new SettingsModel();

  languages = [
    {id: 'en-US', text: 'English'},
    {id: 'da-DK', text: 'Danish'},
    {id: 'de-DE', text: 'German'}
  ];

  serverTypes = [
    {id: 'mysql', text: 'MySQL'},
    {id: 'mssql', text: 'MS SQL'}
  ];

  constructor(private settingsService: AppSettingsService, private router: Router) {
  }

  ngOnInit() {
    this.settingsModel.generalAppSetupSettingsModel.defaultLocale = 'en-US';
    this.settingsService.getApplicationHostOs().subscribe(operation => {
      if (operation && operation.success) {
        if (operation.message === 'Windows') {
          this.settingsModel.connectionStringSDK.sqlServerType = 'mssql';
        } else {
          this.settingsModel.connectionStringSDK.sqlServerType = 'mysql';
          this.settingsModel.connectionStringSDK.port = 3306;
          this.settingsModel.connectionStringSDK.host = 'localhost';
        }
      }
    });

  }

  updateConnectionString() {
    this.spinnerStatus = true;
    this.settingsService.updateConnectionString(this.settingsModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/login']).then();
      } this.spinnerStatus = false;
    });
  }


}
