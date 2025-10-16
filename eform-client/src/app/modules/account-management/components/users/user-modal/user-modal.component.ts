import {Component, EventEmitter, Input, OnInit, Output, inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Paged} from 'src/app/common/models/common';
import {SecurityGroupModel} from 'src/app/common/models/security';
import {UserRegisterModel} from 'src/app/common/models/user';
import {AdminService} from 'src/app/common/services/users';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss'],
  standalone: false
})
export class UserModalComponent implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  dialogRef = inject<MatDialogRef<UserModalComponent>>(MatDialogRef);
  userForm: FormGroup;
  public availableGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();
  edit: boolean = false;
  selectedId?: number;
  isDeviceUser = false;

  constructor() {
    const data = inject<{ availableGroups: Paged<SecurityGroupModel>; selectedId?: number }>(MAT_DIALOG_DATA);
    this.availableGroups = data.availableGroups;
    this.selectedId = data.selectedId;

    this.userForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      role: ['user', Validators.required],
      groupId: [null, Validators.required]
    });

    if (data.selectedId) {
      this.edit = true;
      this.loadUser(data.selectedId);
    }
  }

  ngOnInit() {
    if (this.edit) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      this.userForm.get('password')?.setValidators(Validators.required);
      this.userForm.get('password')?.updateValueAndValidity();
    }
    this.userForm.get('password')?.updateValueAndValidity();

    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      const groupControl = this.userForm.get('groupId');
      if (role === 'admin') {
        groupControl?.clearValidators();
        groupControl?.setValue(null);
      } else {
        groupControl?.setValidators(Validators.required);
      }
      groupControl?.updateValueAndValidity();
    });

  }

  loadUser(selectedId: number) {
    this.adminService.getUser(selectedId).subscribe((data) => {
      if (data && data.model) {
        const user = data.model;
        this.userForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          groupId: user.groupId
        });

        if (user.isDeviceUser) {
          this.isDeviceUser = true;
        }

        if (user.role === 'admin') {
          const groupControl = this.userForm.get('groupId');
          groupControl?.clearValidators();
          groupControl?.updateValueAndValidity();
        }
      }
    });
  }

  submit() {
    if (this.userForm.invalid) {
      return;
    }

    const formValue = this.userForm.value;
    const model = new UserRegisterModel();
    Object.assign(model, formValue);

    if (this.edit && this.selectedId) {
      model.id = this.selectedId;
      this.adminService.updateUser(model).subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
    } else {
      this.adminService.createUser(model).subscribe((data) => {
        if (data && data.success) {
          this.hide(true);
        }
      });
    }
  }

  hide(result = false) {
    this.dialogRef.close({result, edit: this.edit});
  }
}
