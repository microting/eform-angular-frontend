import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  GoogleAuthenticatorModel,
  LoginRequestModel,
} from 'src/app/common/models/auth';
import { AppSettingsService } from 'src/app/common/services/settings';
import { GoogleAuthService, LocaleService } from 'src/app/common/services/auth';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { UserSettingsService } from 'src/app/common/services/auth/user-settings.service';
import { AuthStateService } from 'src/app/common/store';
import {filter} from 'rxjs/operators';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {Subscription, take} from 'rxjs';
import {TitleService} from 'src/app/common/services';
import {TranslateService} from '@ngx-translate/core';
import {Store} from '@ngrx/store';
import {selectAuthIsAuth} from 'src/app/state';

@AutoUnsubscribe()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, OnDestroy {
  formLogin: FormGroup;

  username: AbstractControl;
  email: AbstractControl;
  password: AbstractControl;
  secretKey: AbstractControl;
  code: AbstractControl;

  googleAuthenticatorModel: GoogleAuthenticatorModel = new GoogleAuthenticatorModel();

  showLoginForm = true;
  showAdminResetForm = false;
  error: string;
  isAuthAsyncSub$: Subscription;
  private selectIsAuth$ = this.store.select(selectAuthIsAuth);

  constructor(
    private router: Router,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private localeService: LocaleService,
    private userSettings: UserSettingsService,
    private authStateService: AuthStateService,
    private titleService: TitleService,
    private translateService: TranslateService,
    private store: Store,
  ) {}

  login() {
    this.authStateService.login(
      new LoginRequestModel(this.formLogin.getRawValue())
    );
  }

  submitLoginForm(): void {
    const loginRequestModel = new LoginRequestModel(
      this.formLogin.getRawValue()
    );
    this.googleAuthService
      .loginAndGetGoogleAuthKey(loginRequestModel)
      .subscribe((result) => {
        if (result.success) {
          // check if two factor is enabled
          if (result.model) {
            this.googleAuthenticatorModel = result.model;
            const cypher = btoa(
              JSON.stringify({
                loginData: loginRequestModel,
                googleAuthData: result.model,
              })
            );
            this.router.navigate(['auth/google-authenticator', cypher]).then();
          } else {
            this.login();
          }
        }
      });
  }

  ngOnInit() {
    this.translateService.get('Login').pipe(take(1)).subscribe(translate => this.titleService.setTitle(translate));
    this.formLogin = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.isAuthAsyncSub$ = this.selectIsAuth$.pipe(filter((isAuth: boolean) => isAuth === true)).subscribe(() => {
      this.router.navigate(['/']).then();
    });
  }

  ngOnDestroy(): void {
  }
}
