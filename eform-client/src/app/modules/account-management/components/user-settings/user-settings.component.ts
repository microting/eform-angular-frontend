import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService, NotifyService, SettingsService, LocaleService} from 'app/services';
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

  userSettingsModel: UserSettingsModel = new UserSettingsModel();

  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel;

  constructor(private settingsService: SettingsService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notifyService: NotifyService,
              private localeService: LocaleService) {
  }

  ngOnInit(): void {
    this.getGoogleAuthenticatorInfo();

    this.userSettingsModel.language = this.localeService.getCurrentUserLocale();
  }

  getGoogleAuthenticatorInfo() {
    this.authService.getGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.model) {
        this.googleAuthInfoModel = data.model;
      }
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
          localStorage.clear();
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
    this.localeService.updateUserLocale(this.userSettingsModel.language);
    this.authService.logout().subscribe(() => {
      localStorage.removeItem('currentAuth');
      this.router.navigate(['/login']).then();
    });
  }
}
