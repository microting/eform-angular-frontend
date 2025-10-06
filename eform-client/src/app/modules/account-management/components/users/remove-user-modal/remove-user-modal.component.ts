import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {UserInfoModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-remove-user-modal',
    templateUrl: './remove-user-modal.component.html',
    styleUrls: ['./remove-user-modal.component.scss'],
    standalone: false
})
export class RemoveUserModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<RemoveUserModalComponent>>(MatDialogRef);
  selectedUser = inject<UserInfoModel>(MAT_DIALOG_DATA) ?? new UserInfoModel();

  userDeleted: EventEmitter<UserInfoModel> = new EventEmitter<UserInfoModel>();

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
  }

  deleteUser() {
    this.userDeleted.emit(this.selectedUser);
  }
}
