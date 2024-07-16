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
    private authtStateService: AuthStateService
  ) {}

  ngOnInit() {
    console.debug('RestorePasswordComponent - ngOnInit');
    this.formRestore = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.email = this.formRestore.get('email');
    const userLocale: string = navigator.language || navigator.languages[0];
    this.authtStateService.updateUserLocale(userLocale);
    this.translateService.setDefaultLang(userLocale);
    this.translateService.use(userLocale);
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
