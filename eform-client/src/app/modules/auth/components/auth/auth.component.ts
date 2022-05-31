import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginPageSettingsModel } from 'src/app/common/models';
import { AppSettingsService } from 'src/app/common/services';
import { GoogleAuthService } from 'src/app/common/services';

@Component({
  selector: 'app-auth',
  styleUrls:  ['./auth.component.scss'],
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  loginPageSettings: LoginPageSettingsModel = new LoginPageSettingsModel();
  loginImage: any;
  twoFactorForced = false;

  constructor(
    private router: Router,
    private googleAuthService: GoogleAuthService,
    public settingsService: AppSettingsService,
  ) {}

  ngOnInit() {
    this.checkConnectionString();
  }

  checkConnectionString() {
    console.debug('checkConnectionString called');
    if (!this.isConnectionStringExist(false)) {
      setTimeout(() => {
        this.isConnectionStringExist(true);
      }, 5000);
    }
  }

  isConnectionStringExist(secondCheck: boolean) {
    console.debug('isConnectionStringExist called');
    this.settingsService.connectionStringExist().subscribe(
      (result) => {
        if (result && !result.success) {
          if (secondCheck) {
            this.router
              .navigate(['/application-settings/connection-string'])
              .then();
          }
          return false;
        } else if (result && result.success) {
          this.getSettings();
          this.getTwoFactorInfo();
        }
        return true;
      }
      // (error) => false
    );
    return false;
  }

  getSettings() {
    this.settingsService.getLoginPageSettings().subscribe((data) => {
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
    this.googleAuthService.twoFactorAuthInfo().subscribe((data) => {
      this.twoFactorForced = data.model;
    });
  }
}
