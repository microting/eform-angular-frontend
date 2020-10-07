import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AuthResponseModel, GoogleAuthenticatorModel, LoginRequestModel} from 'src/app/common/models/auth';
import {AppSettingsService} from 'src/app/common/services/settings';
import {AuthService, GoogleAuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {normalizeUserClaimNames} from 'src/app/common/helpers';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;

  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  secretKey: AbstractControl;
  code: AbstractControl;

  googleAuthenticatorModel: GoogleAuthenticatorModel = new GoogleAuthenticatorModel;

  showLoginForm = true;
  showAdminResetForm = false;
  error: string;

  constructor(private router: Router,
              private authService: AuthService,
              private googleAuthService: GoogleAuthService,
              public settingsService: AppSettingsService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private localeService: LocaleService,
              private userSettings: UserSettingsService) {
  }

  login() {
    this.authService.login(new LoginRequestModel(this.formLogin.getRawValue()))
      .subscribe((result: AuthResponseModel) => {
          // Set auth
          localStorage.setItem('currentAuth', JSON.stringify(result));
          // get user settings from db
          this.getUserSettings();
        },
        (error) => {
          this.error = error;
        },
      );
  }

  getUserSettings() {
    this.userSettings.getUserSettings().subscribe((data) => {
      localStorage.setItem('locale', data.model.locale);
      if (data.model.loginRedirectUrl) {
        localStorage.setItem('loginRedirectUrl', data.model.loginRedirectUrl);
      }
      this.getUserClaims(data.model.loginRedirectUrl);
    });
  }

  getUserClaims(redirectUrl: string | null) {
    this.authService.obtainUserClaims()
      .subscribe((data) => {
          debugger;
          // set user claims
          localStorage.setItem('userClaims', JSON.stringify(data.model));
          this.router.navigate([`/${redirectUrl ? redirectUrl : ''}`]).then();
        },
        (error) => {
          this.error = error;
        },
      );
  }

  submitLoginForm(): void {
    const loginRequestModel = new LoginRequestModel(this.formLogin.getRawValue());
    this.googleAuthService.loginAndGetGoogleAuthKey(loginRequestModel)
      .subscribe((result) => {
        if (result.success) {
          // check if two factor is enabled
          if (result.model) {
            this.googleAuthenticatorModel = result.model;
            const cypher = btoa(JSON.stringify({loginData: loginRequestModel, googleAuthData: result.model}));
            this.router.navigate(['auth/google-authenticator', cypher]).then();
          } else {
            this.login();
          }
        }
      });
  }

  ngOnInit() {
    this.formLogin = this.fb.group({
      username: [
        '',
        Validators.required,
      ],
      password: [
        '',
        Validators.required,
      ],
    });
  }
}
