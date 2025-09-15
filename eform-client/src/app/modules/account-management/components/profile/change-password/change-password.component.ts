import { Component, OnInit } from '@angular/core';
import { ChangePasswordModel } from 'src/app/common/models/user';
import { AuthService } from 'src/app/common/services';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: false
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  changePasswordForm: FormGroup;
  passwordStrength = 0; // Track password strength score
  constructor(private authService: AuthService, private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.min(8)]],
      newPassword: ['', [Validators.required, Validators.min(8)]],
      confirmPassword: ['', [Validators.required, Validators.min(8)/*, this.checkPasswords*/]]
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

  // TODO: Uncomment once @angular-material-extensions/password-strength is installed
  // onPasswordStrengthChanged(strength: number): void {
  //   this.passwordStrength = strength;
  //   // Optionally add additional validation based on strength
  //   const passwordControl = this.changePasswordForm.get('newPassword');
  //   if (passwordControl && strength < 40) {
  //     passwordControl.setErrors({ ...passwordControl.errors, weakPassword: true });
  //   } else if (passwordControl && passwordControl.hasError('weakPassword')) {
  //     delete passwordControl.errors.weakPassword;
  //     if (Object.keys(passwordControl.errors).length === 0) {
  //       passwordControl.setErrors(null);
  //     }
  //   }
  // }

/*  checkPasswords(group: FormGroup) {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }*/
}
