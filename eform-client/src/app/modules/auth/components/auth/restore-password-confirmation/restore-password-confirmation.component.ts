import {Component, OnDestroy, OnInit} from '@angular/core';
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

@AutoUnsubscribe()
@Component({
  selector: 'app-restore-password-confirmation',
  templateUrl: './restore-password-confirmation.component.html',
})
export class RestorePasswordConfirmationComponent implements OnInit, OnDestroy {
  submitRestoreModel: PasswordRestoreModel = new PasswordRestoreModel();
  form: FormGroup;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private settingsService: AppSettingsService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  private authtStateService: AuthStateService
  ) {}

  ngOnInit() {
    console.debug('RestorePasswordConfirmationComponent - ngOnInit');
    this.route.queryParams.subscribe((params) => {
      this.form = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPasswordConfirm: ['', [Validators.required]],
        userId: [params['userId']],
        code: [params['code']],
      }, {validators: this.passwordConfirming});
    });
    let userLocale: string = navigator.language || navigator.languages[0];
    if (userLocale.includes('en')) {
      userLocale = 'en-US';
    } else {
      if (userLocale.includes('da')) {
        userLocale = 'da';
      } else {
        userLocale = 'en-US';
      }
    }
    this.authtStateService.updateUserLocale(userLocale);
    this.translateService.setDefaultLang(userLocale);
    this.translateService.use(userLocale);
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
}
