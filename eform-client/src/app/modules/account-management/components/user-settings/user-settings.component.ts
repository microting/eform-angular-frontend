import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

import {AuthService, NotifyService, SettingsService} from 'app/services';
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
              private translate: TranslateService) {
  }

  ngOnInit(): void {
    this.getGoogleAuthenticatorInfo();
    this.localeSwitcher();
  }

  getGoogleAuthenticatorInfo() {
    this.authService.getGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.model) {
        this.googleAuthInfoModel = data.model;
      }
    });
  }

  localeSwitcher() {
      this.userSettingsModel.language = localStorage.getItem('locale');
      if (!this.userSettingsModel.language) {
        this.userSettingsModel.language = 'da-DK';
      }
      // TODO: FIX
      localStorage.setItem('locale', this.userSettingsModel.language);
      this.translate.setDefaultLang(this.userSettingsModel.language);
      this.translate.use(this.userSettingsModel.language);
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

}
