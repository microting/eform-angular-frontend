import { Component, EventEmitter, OnInit, inject } from '@angular/core';
import {UserInfoModel} from 'src/app/common/models';
import {MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions} from '@angular/material/dialog';
import {CdkScrollable} from '@angular/cdk/scrolling';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
    selector: 'app-confirm-email-modal',
    templateUrl: './confirm-email-modal.component.html',
    styleUrls: ['./confirm-email-modal.component.scss'],
    imports: [MatDialogTitle, CdkScrollable, MatDialogContent, MatDialogActions, TranslatePipe]
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
