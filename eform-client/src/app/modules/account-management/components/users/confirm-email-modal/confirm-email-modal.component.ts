import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {UserInfoModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-email-modal',
    templateUrl: './confirm-email-modal.component.html',
    styleUrls: ['./confirm-email-modal.component.scss'],
    standalone: false
})
export class ConfirmEmailModalComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ConfirmEmailModalComponent>>(MatDialogRef);
  selectedUser = inject<UserInfoModel>(MAT_DIALOG_DATA) ?? new UserInfoModel();

  emailConfirmed: EventEmitter<UserInfoModel> = new EventEmitter<UserInfoModel>();

  ngOnInit() {
  }

  hide() {
    this.dialogRef.close();
  }

  confirmEmail() {
    this.emailConfirmed.emit(this.selectedUser);
  }
}
