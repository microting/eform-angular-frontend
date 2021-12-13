import {Component, HostBinding, OnInit, Renderer2} from '@angular/core';
import {Router} from '@angular/router';
import {SettingsModel} from 'src/app/common/models/settings';
import {AppSettingsService} from 'src/app/common/services/settings';

@Component({
  selector: 'app-database-setup',
  templateUrl: './connection-setup.component.html',
  styleUrls: ['./connection-setup.component.scss']
})
export class ConnectionSetupComponent implements OnInit {
  settingsModel: SettingsModel = new SettingsModel();

  languages = [
    {id: 'en-US', text: 'English'},
    {id: 'da', text: 'Danish'},
    {id: 'de-DE', text: 'German'}
  ];

  serverTypes = [
    {id: 'mysql', text: 'MySQL'},
    {id: 'mssql', text: 'MS SQL'}
  ];

  constructor(
    private renderer: Renderer2,
    private settingsService: AppSettingsService, private router: Router) {
  }

  ngOnInit() {
    this.renderer.addClass(document.body, 'theme-dark');
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
    this.settingsService.updateConnectionString(this.settingsModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['/login']).then();
      }
    });
  }


}
