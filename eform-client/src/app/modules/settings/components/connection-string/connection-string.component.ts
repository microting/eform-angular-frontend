import {Component, OnInit} from '@angular/core';
import {ConnectionStringModel} from '../../../../models/settings/connection-string.model';
import {SettingsService} from '../../../../services/settings.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-connection-string',
  templateUrl: './connection-string.component.html',
  styleUrls: ['./connection-string.component.css']
})
export class ConnectionStringComponent implements OnInit {

  connectionStringModel: ConnectionStringModel = new ConnectionStringModel();

  constructor(private settingsService: SettingsService, private router: Router) {
  }

  ngOnInit() {
  }

  updateConnectionString() {
    this.settingsService.updateConnectionString(this.connectionStringModel).subscribe(operation => {
      if (operation && operation.success) {
        this.router.navigate(['']);
      }
    });
  }

}
