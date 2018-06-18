import {Component, OnInit} from '@angular/core';
import {SettingsModel} from 'app/models';
import {AppSettingsService} from 'app/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connection-string',
  templateUrl: './connection-string.component.html',
  styleUrls: ['./connection-string.component.css']
})
export class ConnectionStringComponent implements OnInit {
  spinnerStatus: boolean;
  settingsModel: SettingsModel = new SettingsModel();

  languages = [
    {id: 'en-US', text: 'English'},
    {id: 'da-DK', text: 'Danish'}
  ];

  constructor(private settingsService: AppSettingsService, private router: Router) {
  }

  ngOnInit() {
  }

  updateConnectionString() {
    this.spinnerStatus = true;
    this.settingsService.updateConnectionString(this.settingsModel).subscribe(operation => {
      if (operation && operation.success) {
        this.spinnerStatus = false;
        this.router.navigate(['/login']).then();
      }
    });
  }

}
