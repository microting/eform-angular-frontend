import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettingsService } from 'src/app/common/services/settings';
import { AuthService } from 'src/app/common/services/auth';
import {TranslateService} from '@ngx-translate/core';
import {AuthStateService} from 'src/app/common/store';
import {applicationLanguages} from "src/app/common/const";

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
})
export class RestorePasswordComponent implements OnInit {
  formRestore: FormGroup;
  email: AbstractControl;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private settingsService: AppSettingsService,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private authStateService: AuthStateService
  ) {}

  ngOnInit() {
    console.debug('RestorePasswordComponent - ngOnInit');
    this.formRestore = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.email = this.formRestore.get('email');
    let userLocale: string = navigator.language || navigator.languages[0];
    this.authStateService.updateUserLocale(userLocale);
    if (userLocale.includes('-')) {
      userLocale = userLocale.split('-')[0];
    }
    const locale = applicationLanguages.find(x => x.locale.split('-')[0] === userLocale).locale;
    this.translateService.setDefaultLang(locale);
    this.translateService.use(locale);
    console.debug('RestorePasswordComponent - ngOnInit - done');
  }

  submitRestoreForm(): void {
    this.authService
      .sendEmailRecoveryLink(this.formRestore.getRawValue())
      .subscribe((result) => {
        if (result && result.success) {
          this.formRestore.patchValue({ email: '' });
          this.toastrService.success(
            'Tjek din indbakke for yderligere instruktioner' // TODO Translate this 'Check your inbox for further instructions'
          );
        }
      });
  }
}
