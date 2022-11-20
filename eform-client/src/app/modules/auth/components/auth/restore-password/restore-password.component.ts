import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppSettingsService } from 'src/app/common/services/settings';
import { AuthService } from 'src/app/common/services/auth';

@Component({
  selector: 'app-restore-password',
  templateUrl: './restore-password.component.html',
})
export class RestorePasswordComponent implements OnInit {
  formRestore: UntypedFormGroup;
  email: AbstractControl;

  constructor(
    private router: Router,
    private authService: AuthService,
    private settingsService: AppSettingsService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.formRestore = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.email = this.formRestore.get('email');
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
