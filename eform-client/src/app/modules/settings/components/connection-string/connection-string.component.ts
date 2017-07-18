import {Component, OnInit} from '@angular/core';
import {SettingsModel} from '../../../../models/settings/connection-string.model';
import {SettingsService} from '../../../../services/settings.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connection-string',
  templateUrl: './connection-string.component.html',
  styleUrls: ['./connection-string.component.css']
})
export class ConnectionStringComponent implements OnInit {

  settingsModel: SettingsModel = new SettingsModel();

  constructor(private settingsService: SettingsService, private router: Router) {
  }

  ngOnInit() {
  }

  updateConnectionString() {
    this.settingsService.updateConnectionString(this.settingsModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['']);
      }
    });
  }

}
