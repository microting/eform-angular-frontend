import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { Paged } from 'src/app/common/models/common';
import { SecurityGroupModel } from 'src/app/common/models/security';
import { UserRegisterModel } from 'src/app/common/models/user';
import { AdminService } from 'src/app/common/services/users';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html',
    styleUrls: ['./user-modal.component.scss'],
    standalone: false
})
export class UserModalComponent implements OnInit {
  private adminService = inject(AdminService);
  dialogRef = inject<MatDialogRef<UserModalComponent>>(MatDialogRef);

  userModel: UserRegisterModel = new UserRegisterModel();
  public availableGroups: Paged<SecurityGroupModel> = new Paged<SecurityGroupModel>();
  edit: boolean = false;

  constructor() {
    const data = inject<{
    availableGroups: Paged<SecurityGroupModel>;
    selectedId?: number;
}>(MAT_DIALOG_DATA);

    this.availableGroups = data.availableGroups;
    if(data.selectedId) {
      this.edit = true;
      this.getUserInfo(data.selectedId);
    }
  }

  ngOnInit() {}

  createUser() {
    this.adminService.createUser(this.userModel).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
      }
    });
  }

  getUserInfo(selectedId: number) {
    this.adminService.getUser(selectedId).subscribe((data) => {
      if (data && data.model) {
        this.userModel = data.model;
      }
    });
  }

  updateUser() {
    this.adminService.updateUser(this.userModel).subscribe((data) => {
      if (data && data.success) {
        this.hide(true);
      }
    });
  }

  hide(result = false) {
    this.dialogRef.close({result: result, edit: this.edit});
  }
}
