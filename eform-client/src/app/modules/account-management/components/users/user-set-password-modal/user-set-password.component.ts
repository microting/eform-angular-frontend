import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UserInfoModel} from 'src/app/common/models';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/common/services';
import {ChangePasswordAdminModel} from 'src/app/common/models/user/change-password-admin.model';

@Component({
  selector: 'app-user-set-password',
  templateUrl: './user-set-password.component.html',
})
export class UserSetPasswordComponent implements OnInit {
  setPasswordForm: FormGroup;
  changePasswordModel: ChangePasswordAdminModel = new ChangePasswordAdminModel();
  userPasswordSet: EventEmitter<UserInfoModel> = new EventEmitter<UserInfoModel>();
  constructor(private authService: AuthService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<UserSetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedUser: UserInfoModel = new UserInfoModel()) {
    this.setPasswordForm = this.fb.group({
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['', [Validators.minLength(6)]]
    });
  }

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
  }

  setPassword() {
    this.changePasswordModel = this.setPasswordForm.getRawValue();
    this.changePasswordModel.email = this.selectedUser.email;
    this.authService.changePasswordAdmin(this.changePasswordModel).subscribe(
      (data) => {},
    );
    this.userPasswordSet.emit(this.selectedUser);
  }
  get valid(){
    if(this.setPasswordForm) {
      return this.setPasswordForm.valid;
    }
    return false;
  }
}
