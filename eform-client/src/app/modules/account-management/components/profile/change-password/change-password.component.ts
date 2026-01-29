import { Component, OnInit, inject } from '@angular/core';
import { ChangePasswordModel } from 'src/app/common/models/user';
import { AuthService } from 'src/app/common/services';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EformNewSubheaderComponent } from '../../../../../common/modules/eform-shared/components/eform-new-subheader/eform-new-subheader.component';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatSuffix, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    imports: [EformNewSubheaderComponent, ReactiveFormsModule, MatCard, MatFormField, MatLabel, MatInput, MatIcon, MatSuffix, NgIf, MatError, MatPasswordStrengthModule, TranslatePipe]
})
export class ChangePasswordComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  changePasswordForm: FormGroup;
  newPasswordVisible = false;
  newPasswordConfirmVisible = false;
  passwordStrength = 0; // Track password strength score
  constructor() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(8)]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)/*, this.checkPasswords*/]]
    });
  }

  get valid(){
    if(this.changePasswordForm) {
      return this.changePasswordForm.valid;
    }
    return false;
  }

  ngOnInit() {
  }

  updateUserPassword() {
    this.changePasswordModel = this.changePasswordForm.getRawValue();
    this.authService.changePassword(this.changePasswordModel).subscribe(
      (data) => {},
    );
  }

  onPasswordStrengthChanged(strength: number): void {
    this.passwordStrength = strength;
    // Optionally add additional validation based on strength
    const passwordControl = this.changePasswordForm.get('newPassword');
    if (passwordControl && strength < 40) {
      passwordControl.setErrors({ ...passwordControl.errors, weakPassword: true });
    } else if (passwordControl && passwordControl.hasError('weakPassword')) {
      delete passwordControl.errors.weakPassword;
      if (Object.keys(passwordControl.errors).length === 0) {
        passwordControl.setErrors(null);
      }
    }
  }



  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleNewPasswordConfirmVisibility() {
    this.newPasswordConfirmVisible = !this.newPasswordConfirmVisible;
  }
}
