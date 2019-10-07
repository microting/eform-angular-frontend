import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {LoginPageSettingsModel} from 'src/app/common/models/settings';
import {AppSettingsService} from 'src/app/common/services/settings';
import {AuthService, LocaleService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit {
  loginPageSettings: LoginPageSettingsModel = new LoginPageSettingsModel;
  loginImage: any;
  twoFactorForced = false;
  spinnerStatus = false;

  constructor(private router: Router,
              private authService: AuthService,
              private settingsService: AppSettingsService,
              private toastrService: ToastrService,
              private localeService: LocaleService) {}


  ngOnInit() {
    this.localeService.initLocale();
    this.checkConnectionString();
  }

  checkConnectionString() {
    if (!this.isConnectionStringExist(false)) {
      setTimeout(() => {
        this.isConnectionStringExist(true);
      }, 5000);
    }
  }

  isConnectionStringExist(secondCheck: boolean) {
    this.spinnerStatus = true;
    this.settingsService.connectionStringExist().subscribe((result) => {
      if (result && !result.success) {
        if (secondCheck) {
          this.router.navigate(['/application-settings/connection-string']).then();
        }
        return false;
      } else if (result && result.success) {
        this.getSettings();
        this.getTwoFactorInfo();
      } this.spinnerStatus = false;
      return true;
    },
        error => false);
    return false;
  }

  getSettings() {
    this.spinnerStatus = true;
    this.settingsService.getLoginPageSettings().subscribe((data) => {
      if (data && data.success) {
        this.loginPageSettings = this.settingsService.loginPageSettingsModel = data.model;
        if (this.loginPageSettings.imageLink && this.loginPageSettings.imageLinkVisible) {
          this.loginImage = 'api/images/login-page-images?fileName=' + this.loginPageSettings.imageLink;
        } else if (!this.loginPageSettings.imageLink) {
          this.loginImage = '../../../assets/images/eform-phone.jpg';
        }
      } this.spinnerStatus = false;
    });
  }

  getTwoFactorInfo() {
    this.spinnerStatus = true;
    this.authService.twoFactorAuthInfo().subscribe((data) => {
      this.twoFactorForced = data.model;
      this.spinnerStatus = false;
    });
  }
}
