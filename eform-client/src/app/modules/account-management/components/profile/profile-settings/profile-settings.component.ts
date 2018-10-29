import {Component, HostBinding, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {EventBrokerService} from 'src/app/common/helpers';
import {GoogleAuthInfoModel} from 'src/app/common/models/auth';
import {UserSettingsModel} from 'src/app/common/models/settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent implements OnInit {

  test = true;

  languages = [
    {id: 'en-US', text: 'English'},
    {id: 'da-DK', text: 'Danish'}
  ];

  userSettingsModel: UserSettingsModel = new UserSettingsModel();
  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel;
  spinnerStatus = false;

  constructor(private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private localeService: LocaleService,
              private userSettingsService: UserSettingsService,
              private eventBrokerService: EventBrokerService) {
  }

  ngOnInit() {
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
    debugger;
    if (e.target && e.target.checked) {
      this.googleAuthInfoModel.isTwoFactorEnabled = true;
    } else if (e.target && !e.target.checked) {
      this.googleAuthInfoModel.isTwoFactorEnabled = false;
    } else {
      return;
    }
    this.spinnerStatus = true;
    this.authService.updateGoogleAuthenticatorInfo(this.googleAuthInfoModel).subscribe((data) => {
      if (data.success) {
        localStorage.removeItem('currentAuth');
        this.router.navigate(['/login']).then();
      }
      this.spinnerStatus = false;
    });
  }

  deleteGoogleAuthenticatorInfo() {
    this.spinnerStatus = true;
    this.authService.deleteGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.success) {
        this.googleAuthInfoModel.psk = null;
      }
      this.spinnerStatus = false;
    });
  }

  updateUserProfileSettings() {
    this.spinnerStatus = true;
    this.userSettingsService.updateUserSettings(this.userSettingsModel).subscribe(((data) => {
      this.localeService.updateUserLocale(this.userSettingsModel.locale);
      this.spinnerStatus = false;
      this.eventBrokerService.emit<void>('get-navigation-menu', null);
    }), error => {
      this.spinnerStatus = false;
    });
  }
}
