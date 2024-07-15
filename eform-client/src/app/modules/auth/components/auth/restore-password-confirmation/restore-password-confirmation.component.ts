import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PasswordRestoreModel } from 'src/app/common/models/auth';
import { AppSettingsService, AuthService } from 'src/app/common/services';
import {AutoUnsubscribe} from 'ngx-auto-unsubscribe';
import {AuthStateService} from "src/app/common/store";
import {TranslateService} from "@ngx-translate/core";

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
  private authtStateService: AuthStateService
  ) {}

  ngOnInit() {
    console.debug('RestorePasswordComponent - ngOnInit');
    this.route.queryParams.subscribe((params) => {
      this.form = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
        newPasswordConfirm: new FormControl('', [Validators.required]),
        userId: new FormControl(params['userId']),
        code: new FormControl(params['code']),
      }, {validators: this.passwordConfirming});
    });
    const userLocale: string = navigator.language || navigator.languages[0];
    this.authtStateService.updateUserLocale(userLocale);
    this.translateService.setDefaultLang(userLocale);
    this.translateService.use(userLocale);
    console.debug('RestorePasswordComponent - ngOnInit - done');
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
