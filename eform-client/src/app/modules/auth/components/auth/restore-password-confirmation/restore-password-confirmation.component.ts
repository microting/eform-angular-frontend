import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import {
  AbstractControl, FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PasswordRestoreModel } from 'src/app/common/models/auth';
import { AppSettingsService, AuthService } from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {AuthStateService} from 'src/app/common/store';
import {TranslateService} from '@ngx-translate/core';
import {applicationLanguages} from "src/app/common/const";

@AutoUnsubscribe()
@Component({
    selector: 'app-restore-password-confirmation',
    templateUrl: './restore-password-confirmation.component.html',
    standalone: false
})
export class RestorePasswordConfirmationComponent implements OnInit, OnDestroy {
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private settingsService = inject(AppSettingsService);
  private toastrService = inject(ToastrService);
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authStateService = inject(AuthStateService);

  submitRestoreModel: PasswordRestoreModel = new PasswordRestoreModel();
  form: FormGroup;
  newPasswordVisible = false;
  newPasswordConfirmVisible = false;
  passwordStrength = 0;

  ngOnInit() {
    console.debug('RestorePasswordConfirmationComponent - ngOnInit');
    this.route.queryParams.subscribe((params) => {
      this.form = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        newPasswordConfirm: ['', [Validators.required]],
        userId: [params['userId']],
        code: [params['code']],
      }, {validators: this.passwordConfirming});
    });
    let userLocale: string = navigator.language || navigator.languages[0];
    this.authStateService.updateUserLocale(userLocale);
    if (userLocale.includes('-')) {
      userLocale = userLocale.split('-')[0];
    }
    const locale = applicationLanguages.find(x => x.locale.split('-')[0] === userLocale).locale;
    this.translateService.setDefaultLang(locale);
    this.translateService.use(locale);
    console.debug('RestorePasswordConfirmationComponent - ngOnInit - done');
  }
  passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('newPasswordConfirm').value) {
      c.get('newPasswordConfirm').setErrors({passwordsNotEqual: true})
      return {invalid: true};
    }
  }

  submitRestoreConfirmationForm(): void {
    this.submitRestoreModel = this.form.value;
    this.authService
      .restorePassword(this.submitRestoreModel)
      .subscribe((result) => {
        if (result && result.success) {
          this.router.navigate(['']).then();
          this.toastrService.success('Password set successfully');
        }
      });
  }

  ngOnDestroy(): void {
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleNewPasswordConfirmVisibility() {
    this.newPasswordConfirmVisible = !this.newPasswordConfirmVisible;
  }

  onPasswordStrengthChanged(strength: number): void {
    this.passwordStrength = strength;
    // Optionally add additional validation based on strength
    const passwordControl = this.form.get('newPassword');
    if (passwordControl && strength < 40) {
      passwordControl.setErrors({ ...passwordControl.errors, weakPassword: true });
    } else if (passwordControl && passwordControl.hasError('weakPassword')) {
      delete passwordControl.errors.weakPassword;
      if (Object.keys(passwordControl.errors).length === 0) {
        passwordControl.setErrors(null);
      }
    }
  }
}
