import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LoginPageSettingsModel} from 'src/app/common/models';
import {AppSettingsService} from 'src/app/common/services';
import {GoogleAuthService} from 'src/app/common/services';
import {take} from 'rxjs';

@Component({
  selector: 'app-auth',
  styleUrls: ['./auth.component.scss'],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  loginPageSettings: LoginPageSettingsModel = new LoginPageSettingsModel();
  loginImage: any;
  twoFactorForced = false;
  onForgotPasswordPage = false;

  constructor(
    private router: Router,
    private googleAuthService: GoogleAuthService,
    public settingsService: AppSettingsService,
    // private authService: AuthStateService,
  ) {
    console.log('AuthComponent - constructor');
  }

  ngOnInit() {
    console.log('AuthComponent - ngOnInit');
    this.getInitialData();
    this.router.events.subscribe(_ => {
      if(
        this.router.url.includes('reset-admin-password') ||
        this.router.url.includes('restore-password-confirmation') ||
        this.router.url.includes('restore-password')
      ) {
        this.onForgotPasswordPage = true;
      }
    })
  }

  getInitialData() {
    this.getSettings();
    this.getTwoFactorInfo();
  }

  /*checkConnectionString() {
    console.debug('checkConnectionString called');
    this.authService.isConnectionStringExistAsync.pipe(
      count((isConnectionStringExist, i) => {
        if (isConnectionStringExist === false && i < 1) {
        // if connection string not exist and trys < 2 -- try after 5 second.
          setTimeout(() => {
            this.isConnectionStringExist();
          }, 5000);
        } else if (isConnectionStringExist === false && i >= 1) {
        // if connection string not exist and trys >= 2 -- redirect to set connection string.
          this.router
            .navigate(['/application-settings/connection-string'])
            .then();
        } else { // else connection string exist
          this.getSettings();
          this.getTwoFactorInfo();
        }
        return true; // need for subs.
      })).subscribe();
    this.isConnectionStringExist();
  }

  isConnectionStringExist() {
    this.authService.isConnectionStringExist();
  }*/

  getSettings() {
    this.settingsService.getLoginPageSettings().pipe(take(1)).subscribe((data) => {
      if (data && data.success) {
        this.loginPageSettings = this.settingsService.loginPageSettingsModel =
          data.model;
        if (
          this.loginPageSettings.imageLink &&
          this.loginPageSettings.imageLinkVisible
        ) {
          this.loginImage =
            'api/images/login-page-images?fileName=' +
            this.loginPageSettings.imageLink;
        } else if (!this.loginPageSettings.imageLink) {
          this.loginImage = '../../../assets/images/eform-phone.jpg';
        }
      }
    });
  }

  getTwoFactorInfo() {
    this.googleAuthService.twoFactorAuthInfo().pipe(take(1)).subscribe((data) => {
      this.twoFactorForced = data.model;
    });
  }
}
