import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {Router} from '@angular/router';
import {SettingsModel} from 'src/app/common/models';
import {AppSettingsService} from 'src/app/common/services';
import {AuthStateService} from 'src/app/common/store';
import {Subscription} from 'rxjs';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
    selector: 'app-database-setup',
    templateUrl: './connection-setup.component.html',
    styleUrls: ['./connection-setup.component.scss'],
    standalone: false
})
export class ConnectionSetupComponent implements OnInit, OnDestroy {
  private settingsService = inject(AppSettingsService);
  private router = inject(Router);
  authStateService = inject(AuthStateService);

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

  // isConnectionStringExistAsyncSub$: Subscription;
  updateConnectionStringSub$: Subscription;
  getApplicationHostOsSub$: Subscription;

  constructor() {
    console.debug('ConnectionSetupComponent - constructor');
  }


  ngOnInit() {
    console.debug('ConnectionSetupComponent - ngOnInit');
    this.authStateService.updateDarkTheme(true);
    this.settingsModel.generalAppSetupSettingsModel.defaultLocale = 'en-US';
    this.getApplicationHostOsSub$ = this.settingsService.getApplicationHostOs().subscribe(operation => {
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

    /*this.isConnectionStringExistAsyncSub$ = this.authStateService.isConnectionStringExistAsync.subscribe(isConnectionStringExist => {
      if (isConnectionStringExist) {
        setTimeout(() => this.router.navigate(['/auth']).then(), 5000);
      }
    });*/
  }

  updateConnectionString() {
    this.updateConnectionStringSub$ = this.settingsService.updateConnectionString(this.settingsModel).subscribe(operation => {
      if (operation && operation.success) {
        setTimeout(() => {
          this.authStateService.isConnectionStringExist();
        }, 10000);
      }
    });
  }

  ngOnDestroy(): void {
  }
}
