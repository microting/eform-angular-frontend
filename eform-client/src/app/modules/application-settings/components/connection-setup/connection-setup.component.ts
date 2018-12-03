import {Component, HostBinding, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SettingsModel} from 'src/app/common/models/settings';
import {AppSettingsService} from 'src/app/common/services/app-settings';

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
    {id: 'da-DK', text: 'Danish'}
  ];

  constructor(private settingsService: AppSettingsService, private router: Router) {
  }

  ngOnInit() {
    this.settingsModel.generalAppSetupSettingsModel.defaultLocale = 'en-US';
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
