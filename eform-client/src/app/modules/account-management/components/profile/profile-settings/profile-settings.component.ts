import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBrokerService } from 'src/app/common/helpers';
import { GoogleAuthInfoModel } from 'src/app/common/models/auth';
import { UserSettingsModel } from 'src/app/common/models/settings';
import {
  GoogleAuthService,
  LocaleService,
  UserSettingsService,
} from 'src/app/common/services/auth';
import { TimezonesModel } from 'src/app/common/models/common/timezones.model';
import {
  applicationLanguages,
  applicationLanguages2,
  applicationLanguagesTranslated
} from 'src/app/common/const/application-languages.const';
import { countries } from 'src/app/common/const/application-countries.const';
import { AppMenuStateService, AuthStateService } from 'src/app/common/store';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  get languages() {
    return applicationLanguages2;
  }

  get countries() {
    return countries;
  }

  userSettingsModel: UserSettingsModel = new UserSettingsModel();
  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel();
  timeZones: TimezonesModel = new TimezonesModel();

  constructor(
    public authStateService: AuthStateService,
    private googleAuthService: GoogleAuthService,
    private localeService: LocaleService,
    private userSettingsService: UserSettingsService,
    private appMenuStateService: AppMenuStateService
  ) {}

  ngOnInit() {
    this.getTimeZones();
    this.getGoogleAuthenticatorInfo();
    this.getUserSettings();
  }

  getGoogleAuthenticatorInfo() {
    this.googleAuthService.getGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.model) {
        this.googleAuthInfoModel = data.model;
      }
    });
  }

  getTimeZones() {
    this.googleAuthService.allTimeZones().subscribe((data) => {
      if (data && data.model) {
        this.timeZones = data.model;
      }
    });
  }

  getUserSettings() {
    this.userSettingsService.getUserSettings().subscribe((data) => {
      this.userSettingsModel = data.model;
    });
  }

  isTwoFactorEnabledCheckBoxChanged(e) {
    if (e.target) {
      this.googleAuthInfoModel.isTwoFactorEnabled = e.target.checked;
    } else {
      return;
    }
    this.googleAuthService
      .updateGoogleAuthenticatorInfo(this.googleAuthInfoModel)
      .subscribe((data) => {
        if (data.success) {
          this.authStateService.logout();
        }
      });
  }

  deleteGoogleAuthenticatorInfo() {
    this.googleAuthService.deleteGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.success) {
        this.googleAuthInfoModel.psk = null;
      }
    });
  }

  updateUserProfileSettings() {
    this.userSettingsService
      .updateUserSettings(this.userSettingsModel)
      .subscribe((data) => {
        this.localeService.updateCurrentUserLocaleAndDarkTheme(
          this.userSettingsModel.locale,
          this.userSettingsModel.darkTheme
        );
        this.appMenuStateService.getAppMenu(false).subscribe();
      });
  }
}
