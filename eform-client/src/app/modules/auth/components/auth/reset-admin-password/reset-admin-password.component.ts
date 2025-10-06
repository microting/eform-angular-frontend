import { Component, OnInit, inject } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {AppSettingsService} from 'src/app/common/services/settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';

@Component({
    selector: 'app-reset-admin-password',
    templateUrl: './reset-admin-password.component.html',
    standalone: false
})
export class ResetAdminPasswordComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private settingsService = inject(AppSettingsService);
  private fb = inject(FormBuilder);
  private toastrService = inject(ToastrService);
  private localeService = inject(LocaleService);
  private userSettings = inject(UserSettingsService);

  formReset: FormGroup;
  secretKey: AbstractControl;

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
