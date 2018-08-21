import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AppSettingsService} from 'src/app/common/services/app-settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';

@Component({
  selector: 'app-reset-admin-password',
  templateUrl: './reset-admin-password.component.html'
})
export class ResetAdminPasswordComponent implements OnInit {
  formReset: FormGroup;
  secretKey: AbstractControl;
  spinnerStatus = false;

  constructor(private router: Router,
              private authService: AuthService,
              private settingsService: AppSettingsService,
              private fb: FormBuilder,
              private toastrService: ToastrService,
              private localeService: LocaleService,
              private userSettings: UserSettingsService) {
  }

  ngOnInit() {
    this.formReset = this.fb.group({
      secretKey: [
        '',
        [Validators.required]
      ]
    });
    this.secretKey = this.formReset.get('secretKey');
  }

  submitResetAdminForm() {
    const secretKey = this.formReset.getRawValue().secretKey;
    this.authService.resetAdminPassword(secretKey).subscribe((result) => {
      if (result && result.success) {
        this.secretKey.reset();
      } else {
        this.toastrService.error(result.message);
      }
    });
  }
}
