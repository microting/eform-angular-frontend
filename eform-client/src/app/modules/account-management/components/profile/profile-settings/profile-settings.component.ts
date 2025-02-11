import { Component, OnInit } from '@angular/core';
import { GoogleAuthInfoModel } from 'src/app/common/models/auth';
import { UserSettingsModel } from 'src/app/common/models/settings';
import {
  GoogleAuthService,
  LocaleService,
  UserSettingsService,
} from 'src/app/common/services/auth';
import { TimezonesModel } from 'src/app/common/models/common/timezones.model';
import { countries } from 'src/app/common/const/application-countries.const';
import { AuthStateService } from 'src/app/common/store';
import {tap} from 'rxjs/operators';
import {Subscription} from 'rxjs';
import {AppSettingsStateService} from 'src/app/modules/application-settings/components/store';
import {LanguagesModel} from 'src/app/common/models';
import {Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {loadAppMenu, selectCurrentUserIsAdmin, updateCurrentUserLocaleAndDarkTheme} from 'src/app/state';

@Component({
    selector: 'app-profile-settings',
    templateUrl: './profile-settings.component.html',
    styleUrls: ['./profile-settings.component.scss'],
    standalone: false
})
export class ProfileSettingsComponent implements OnInit {

  userSettingsModel: UserSettingsModel = new UserSettingsModel();
  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel();
  timeZones: TimezonesModel = new TimezonesModel();
  getLanguagesSub$: Subscription;
  appLanguages: LanguagesModel = new LanguagesModel();
  activeLanguages: Array<any> = [];
  public selectCurrentUserIsAdmin$ = this.authStore.select(selectCurrentUserIsAdmin);

  constructor(
    public authStateService: AuthStateService,
    private authStore: Store,
    private googleAuthService: GoogleAuthService,
    private localeService: LocaleService,
    private translateService: TranslateService,
    private userSettingsService: UserSettingsService,
    private store: Store,
    private userSettings: UserSettingsService,
    private appSettingsStateService: AppSettingsStateService
  ) {}

  ngOnInit() {
    this.getEnabledLanguages();
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
        this.userSettings.getUserSettings().subscribe((data) => {
          this.userSettingsModel = data.model;
          this.store.dispatch(updateCurrentUserLocaleAndDarkTheme({
            darkTheme: this.userSettingsModel.darkTheme,
            locale: this.userSettingsModel.locale,
            languageId: this.userSettingsModel.languageId
          }))
        });
        this.store.dispatch(loadAppMenu());
      });
  }

  getEnabledLanguages() {
    this.getLanguagesSub$ = this.appSettingsStateService.getLanguages()
      .pipe(tap(data => {
        if (data && data.success && data.model) {
          this.appLanguages = data.model;
          this.activeLanguages = this.appLanguages.languages.filter((x) => x.isActive);
          this.getTimeZones();
          this.getGoogleAuthenticatorInfo();
          this.getUserSettings();
        }
      }))
      .subscribe();
  }

  get languages() {
    return this.appLanguages.languages.filter((x) => x.isActive);
  }

  get countries() {
    return countries;
  }
}
