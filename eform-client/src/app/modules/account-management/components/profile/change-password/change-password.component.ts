import { Component, OnInit } from '@angular/core';
import { ChangePasswordModel } from 'src/app/common/models/user';
import { AuthService } from 'src/app/common/services';
import { UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordModel: ChangePasswordModel = new ChangePasswordModel();
  changePasswordForm: UntypedFormGroup;
  constructor(private authService: AuthService, private fb: UntypedFormBuilder) {
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

/*  checkPasswords(group: FormGroup) {
    let pass = group.get('newPassword').value;
    let confirmPass = group.get('confirmPassword').value;

    return pass === confirmPass ? null : { notSame: true }
  }*/
}
