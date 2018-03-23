import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from 'app/services/accounts/auth.service';
import {NotifyService} from 'app/services/notify.service';
import {GoogleAuthInfoModel} from '../../../../models';
import {SettingsService} from '../../../../services';

@Component({
  selector: 'google-authenticator',
  templateUrl: './google-authenticator.component.html'
})
export class GoogleAuthenticatorComponent implements OnInit {
  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel;

  constructor(private settingsService: SettingsService,
              private authService: AuthService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private notifyService: NotifyService) {
  }

  ngOnInit(): void {
    this.getGoogleAuthenticatorInfo();
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

}
