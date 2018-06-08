import {Component, OnInit} from '@angular/core';
import {SettingsModel} from 'app/models';
import {SettingsService} from 'app/services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connection-string',
  templateUrl: './connection-string.component.html',
  styleUrls: ['./connection-string.component.css']
})
export class ConnectionStringComponent implements OnInit {
  spinnerStatus: boolean;
  settingsModel: SettingsModel = new SettingsModel();

  constructor(private settingsService: SettingsService, private router: Router) {
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
