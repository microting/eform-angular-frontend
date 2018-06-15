import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService, NotifyService, AppSettingsService, LocaleService, UserSettingsService} from 'app/services';
import {GoogleAuthInfoModel, UserSettingsModel} from 'app/models';

@Component({
  selector: 'user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
  languages = [
    {id: 'en-US', text: 'English'},
    {id: 'da-DK', text: 'Danish'}
    ];

  isSettingsUpdating = false;
  userSettingsModel: UserSettingsModel = new UserSettingsModel();

  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel;

  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notifyService: NotifyService,
              private localeService: LocaleService,
              private userSettingsService: UserSettingsService) {
  }

  ngOnInit(): void {
    this.getGoogleAuthenticatorInfo();
    this.getUserSettings();

    this.userSettingsModel.locale = this.localeService.getCurrentUserLocale();
  }

  getGoogleAuthenticatorInfo() {
    this.authService.getGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.model) {
        this.googleAuthInfoModel = data.model;
      }
    });
  }

  getUserSettings() {
    this.userSettingsService.getUserSettings().subscribe((data) => {
      this.userSettingsModel = data.model;
    });
  }

  isTwoFactorEnabledCheckBoxChanged(e) {
    if (e.target && e.target.checked) {
      this.googleAuthInfoModel.isTwoFactorEnabled = true;
    } else if (e.target && !e.target.checked) {
      this.googleAuthInfoModel.isTwoFactorEnabled = false;
    } else {
      return;
    }
    this.authService.updateGoogleAuthenticatorInfo(this.googleAuthInfoModel).subscribe((data) => {
      if (data.success) {
        this.authService.logout().subscribe(() => {
          localStorage.removeItem('currentAuth');
          this.router.navigate(['/login']).then();
        });
      } else {
        this.notifyService.error({text: data.message});
      }
    });
  }

  deleteGoogleAuthenticatorInfo() {
    this.authService.deleteGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.success) {
        this.googleAuthInfoModel.psk = null;
      }
    });
  }

  updateUserProfileSettings() {
    this.userSettingsService.updateUserSettings(this.userSettingsModel).subscribe(((data) => {
      this.isSettingsUpdating = true;
      this.localeService.updateUserLocale(this.userSettingsModel.locale);
      this.authService.logout().subscribe(() => {
        this.isSettingsUpdating = false;
        localStorage.removeItem('currentAuth');
        this.router.navigate(['/login']).then();
      });
    }), error => {
      this.isSettingsUpdating = false;
      });
  }
}
